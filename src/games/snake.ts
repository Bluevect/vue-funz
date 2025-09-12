// Contains the relavant code for the Snake game
import { computed, reactive } from 'vue'
import type { Reactive } from 'vue'

type Status = 1 | 0

// Configs
interface SnakeConfig {
  bg: string
  snakeColor: string
  foodColor: string
  killedColor: string
  initialDir: number
  time: number
}

interface MapConfig {
  width: number
  height: number
  blockWidth: number
  blockHeight: number
}

const config: Reactive<SnakeConfig> = reactive({
  bg: 'gray',
  snakeColor: '#304c9a',
  foodColor: 'orange',
  killedColor: 'red',
  initialDir: 1,
  time: 150,
})

// default
// block size: 25 * 25
// map size: 20 block * 20 block
// pos: 0 - 399

// direction
// 1: right -1: left
// 20: down -20: up
const mapConfig: Reactive<MapConfig> = reactive({
  width: 20,
  height: 20,
  blockWidth: 25,
  blockHeight: 25,
})

const mapLength = computed(() => {
  return mapConfig.width * mapConfig.height
})

let addScore = () => {}
let gameStart = () => {}
let gameOver = () => {}

export function onAddScore(hookFunc: () => void) {
  addScore = hookFunc
}

export function onGameStart(hookFunc: () => void) {
  gameStart = hookFunc
}

export function onGameOver(hookFunc: () => void) {
  gameOver = hookFunc
}

export function changeSnakeConfig(newSnakeConfig: SnakeConfig): void {
  Object.assign(config, newSnakeConfig)
}

export function changeMapConfig(newMapConfig: MapConfig): void {
  Object.assign(mapConfig, newMapConfig)
}

function draw(pos: number, color: string, cxt: CanvasRenderingContext2D): void {
  const { width, blockWidth, blockHeight } = mapConfig

  cxt.fillStyle = color

  const x = (pos % width) * blockWidth
  const y = Math.floor(pos / width) * blockHeight

  cxt.fillRect(x + 1, y + 1, blockWidth - 1, blockHeight - 1)
}

function fresh(bg: string, cxt: CanvasRenderingContext2D): void {
  for (let i = 0; i < mapLength.value; i++) {
    draw(i, bg, cxt)
  }
}

class Snake {
  blocks: number[] = []
  availableMap: number[] = []
  dir: number
  changeFinished: boolean = true
  cxt: CanvasRenderingContext2D
  foodPos: number = 0

  constructor(cxt: CanvasRenderingContext2D, ...args: number[]) {
    const { snakeColor, initialDir } = config
    this.cxt = cxt
    this.dir = initialDir

    for (let i = 0; i < args.length; i++) {
      draw(args[i], snakeColor, cxt)
      this.blocks.push(args[i])
    }

    for (let i = 0; i < mapLength.value; i++) {
      if (args.indexOf(i) == -1) this.availableMap.push(i)
    }

    this.generateFood()
  }

  length(): number {
    return this.blocks.length
  }

  getHead(): number {
    return this.blocks[this.length() - 1]
  }

  // get or set direction
  direction(val?: number): void | number {
    if (val) {
      // solve if change too fast
      this.changeFinished = false
      this.dir = val
    }
    return this.dir
  }

  move(): Status {
    const { width } = mapConfig
    const { killedColor, snakeColor, bg } = config
    const lastHead = this.getHead()
    const head = lastHead + this.dir

    if (
      // out of bounds
      (head % width == 0 && this.dir == 1) ||
      ((head + 1) % width == 0 && this.dir == -1) ||
      head < 0 ||
      head >= mapLength.value ||
      // knock on itself
      this.blocks.indexOf(head) != -1
    ) {
      // game over
      draw(lastHead, killedColor, this.cxt)

      return 0
    } else if (head == this.foodPos) {
      // consume food
      addScore()

      this.blocks.push(head)
      const headIndex = this.availableMap.indexOf(head)
      this.availableMap.splice(headIndex, 1)
      draw(head, snakeColor, this.cxt)

      this.generateFood()

      this.changeFinished = true
      return 1
    }

    this.blocks.push(head)
    const headIndex = this.availableMap.indexOf(head)
    this.availableMap.splice(headIndex, 1)
    draw(head, snakeColor, this.cxt)

    const end = this.blocks.shift() as number
    this.availableMap.push(end)
    draw(end, bg, this.cxt)

    this.changeFinished = true

    return 1
  }

  generateFood(): void {
    const { foodColor } = config
    const posIndex = Math.floor(Math.random() * this.availableMap.length)
    const pos = this.availableMap[posIndex]
    this.foodPos = pos
    draw(pos, foodColor, this.cxt)
  }
}

class SnakeGame {
  interval: number | null = null
  snake: Snake | null = null
  cxt: CanvasRenderingContext2D

  constructor(cxt: CanvasRenderingContext2D) {
    this.cxt = cxt
  }

  start(): void {
    // start hook
    gameStart()

    // start
    this.snake = new Snake(this.cxt, 0, 1, 2)

    const snake = this.snake as Snake
    let status: Status = 1

    this.interval = setInterval(() => {
      status = snake.move()

      if (status == 0) {
        this.gameOver()
      }
    }, config.time)
  }

  gameOver(): void {
    this.snake = null
    gameOver()
    clearInterval(this.interval as number)
  }

  getChangeFinished(): boolean | never {
    if (!this.snake) throw new Error('Game is not running!')
    return this.snake.changeFinished
  }

  direction(val?: number): void | number {
    if (!this.snake) throw new Error('Game is not running!')
    if (val) {
      this.snake.direction(val)
      return val
    }
    return this.snake.direction()
  }
}

export { fresh, draw, SnakeGame, mapConfig, config }
export type { SnakeConfig, MapConfig }
