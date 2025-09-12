// Contains the relavant code for the Tetris game
import { reactive, computed } from 'vue'
import type { Reactive } from 'vue'

// Configs
interface TetrisConfig {
  bg: string
  blockColor: string
  nextShapeColor: string
  gameOverColor: string
  time: number
}

interface MapConfig {
  width: number
  height: number
  blockWidth: number
  blockHeight: number
}

const config: Reactive<TetrisConfig> = reactive({
  bg: 'gray',
  blockColor: '#304c9a',
  nextShapeColor: 'orange',
  gameOverColor: 'red',
  time: 200,
})

// default
// block size: 30 * 30
// map size: 10 block * 20 block
// pos: 0 - 199

const mapConfig: Reactive<MapConfig> = reactive({
  width: 10,
  height: 20,
  blockWidth: 30,
  blockHeight: 30,
})

// next shape size: 4 block * 4 block
// pos: 0 - 15

const nextShapeConfig: Reactive<MapConfig> = reactive({
  width: 4,
  height: 4,
  blockWidth: 25,
  blockHeight: 25,
})

const mapLength = computed(() => {
  return mapConfig.width * mapConfig.height
})

const nextShapeLength = computed(() => {
  return nextShapeConfig.width * nextShapeConfig.height
})

function draw(
  pos: number,
  color: string,
  cxt: CanvasRenderingContext2D,
  mapConf: MapConfig = mapConfig,
): void {
  const { width, blockWidth, blockHeight } = mapConf

  cxt.fillStyle = color

  const x = (pos % width) * blockWidth
  const y = Math.floor(pos / width) * blockHeight

  cxt.fillRect(x + 1, y + 1, blockWidth - 1, blockHeight - 1)
}

function fresh(
  bg: string,
  cxt: CanvasRenderingContext2D,
  mapConf: MapConfig = mapConfig,
  mapLen: number = mapLength.value,
): void {
  for (let i = 0; i < mapLen; i++) {
    draw(i, bg, cxt, mapConf)
  }
}

interface TetrisShape {
  name: string
  shape: number[]
}

const shapes: TetrisShape[] = [
  {
    name: 'I',
    // shape: [4, 5, 6, 7],
    shape: [0, 1, 2, 3],
  },
  {
    name: 'J',
    shape: [0, 4, 5, 6],
  },
  {
    name: 'L',
    shape: [2, 4, 5, 6],
  },
  {
    name: 'O',
    shape: [0, 1, 4, 5],
  },
  {
    name: 'S',
    shape: [1, 2, 4, 5],
  },
  {
    name: 'T',
    shape: [1, 4, 5, 6],
  },
  {
    name: 'Z',
    shape: [0, 1, 5, 6],
  },
]

// Mappings for original shapes to rotated shapes
const rotateMap = [12, 8, 4, 0, 13, 9, 5, 1, 14, 10, 6, 2, 15, 11, 7, 3]

let gameStart = () => {}
let addScore: (lines: number) => void = () => {}
let gameOver: () => void = () => {}

export function onAddScore(hookFunc: (lines: number) => void): void {
  addScore = hookFunc
}

export function onGameStart(hookFunc: () => void): void {
  gameStart = hookFunc
}

export function onGameOver(hookFunc: () => void): void {
  gameOver = hookFunc
}

class Tetris {
  interval: number = 0
  cxt: CanvasRenderingContext2D
  nextCxt: CanvasRenderingContext2D
  currentShapePreset: number[] = []
  currentShapePos: number = 0
  currentShape: number[] = []
  nextShape: number[] = []
  blocksPos: number[] = []

  constructor(cxt: CanvasRenderingContext2D, nextCxt: CanvasRenderingContext2D) {
    this.cxt = cxt
    this.nextCxt = nextCxt
  }

  generateNextShape(): number[] {
    const randomIndex = Math.floor(Math.random() * shapes.length)
    const shape = shapes[randomIndex].shape

    return shape
  }

  drawNextShape(shape: number[]): void {
    shape.forEach((pos) => {
      draw(pos, config.nextShapeColor, this.nextCxt, nextShapeConfig)
    })
  }

  drawNextShapeOnMap(shape: number[]): void {
    shape.forEach((pos) => {
      draw(pos, config.blockColor, this.cxt)
    })
  }

  move(dir: number): 0 | 1 {
    const { bg, blockColor } = config
    const { width } = mapConfig

    let movable = true

    // Check if the current shape can move
    this.currentShape.forEach((pos) => {
      const nextPos = pos + dir
      if (
        nextPos >= mapLength.value ||
        this.blocksPos.includes(nextPos) ||
        (nextPos % width == 0 && dir == 1) ||
        ((nextPos + 1) % width == 0 && dir == -1)
      )
        movable = false
    })

    if (!movable) return 0

    // Clear the current shape
    this.currentShape.forEach((pos) => {
      draw(pos, bg, this.cxt)
    })

    // Move
    this.currentShape = this.currentShape.map((pos) => pos + dir)
    this.currentShapePos += dir

    // Draw the new position of the shape
    this.currentShape.forEach((pos) => {
      draw(pos, blockColor, this.cxt)
    })

    return 1
  }

  rotate(): void {
    const { bg, blockColor } = config

    // Check if the current shape can rotate
    const newCurrentShapePreset = this.currentShapePreset.map((pos) => rotateMap[pos])
    const newCurrentShape = newCurrentShapePreset.map(
      (pos) => this.toMapPos(pos) + this.currentShapePos,
    )
    if (
      newCurrentShape.some(
        (pos) => pos >= mapLength.value || pos < 0 || this.blocksPos.includes(pos),
      )
    ) {
      return
    }

    // Clear the current shape
    this.currentShape.forEach((pos) => {
      draw(pos, bg, this.cxt)
    })

    // Rotate
    this.currentShapePreset = newCurrentShapePreset
    this.currentShape = newCurrentShape

    // Draw the new position of the shape
    this.currentShape.forEach((pos) => {
      draw(pos, blockColor, this.cxt)
    })
  }

  toMapPos(pos: number): number {
    const { width } = mapConfig
    const { width: nsWidth } = nextShapeConfig

    return (pos % nsWidth) + Math.floor(pos / nsWidth) * width
  }

  eliminate(): void {
    const { width } = mapConfig
    const { bg, blockColor } = config

    let cnt: number = 0
    let lastPos: number = -1
    const linesToElim: number[] = []

    this.blocksPos.sort((a: number, b: number) => a - b)

    this.blocksPos.forEach((pos: number): void => {
      if (lastPos >= 0 && Math.floor(pos / width) != Math.floor(lastPos / width)) {
        cnt = 0
      }
      cnt++

      if (cnt == width) {
        cnt = 0
        linesToElim.push(Math.floor(pos / width))
      }

      lastPos = pos
    })

    if (linesToElim.length > 0) {
      addScore(linesToElim.length)
    }

    linesToElim.forEach((line: number) => {
      // Clear lines
      for (let i = 0; i < width; i++) {
        draw(line * width + i, bg, this.cxt)
      }

      const startOfLineIndex = this.blocksPos.indexOf(line * width)
      this.blocksPos.splice(startOfLineIndex, width)

      // Move all blocks above down
      for (let i = startOfLineIndex - 1; i >= 0; i--) {
        draw(this.blocksPos[i], bg, this.cxt)
        this.blocksPos[i] += width
        draw(this.blocksPos[i], blockColor, this.cxt)
      }
    })
  }

  start(): void {
    const { width } = mapConfig

    gameStart()

    this.currentShapePreset = this.generateNextShape()
    this.currentShape = this.currentShapePreset.map((pos) => this.toMapPos(pos))
    this.drawNextShapeOnMap(this.currentShape)

    this.nextShape = this.generateNextShape()
    this.drawNextShape(this.nextShape)

    this.interval = setInterval(() => {
      const status = this.move(width)

      if (status == 0) {
        if (this.currentShape.some((pos) => pos < mapConfig.width)) {
          // Game Over
          this.gameOver()
        }

        this.drawNextShapeOnMap(this.currentShape)

        this.blocksPos.push(...this.currentShape)
        this.eliminate()

        this.currentShapePos = 0

        this.currentShapePreset = this.nextShape
        this.currentShape = this.currentShapePreset.map((pos) => this.toMapPos(pos))
        this.nextShape = this.generateNextShape()
        fresh(config.bg, this.nextCxt, nextShapeConfig, nextShapeLength.value)
        this.drawNextShape(this.nextShape)
      }
    }, config.time)
  }

  gameOver(): void {
    // Reset
    clearInterval(this.interval)
    this.blocksPos = []

    gameOver()
  }
}

export { draw, fresh, mapConfig, nextShapeConfig, nextShapeLength, config, Tetris }
