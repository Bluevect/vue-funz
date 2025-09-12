<template>
  <div class="item-root" @click="routerPush(to)">
    <h3><slot name="title"></slot></h3>
    <p><slot name="content"></slot></p>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import type { RouteLocationAsRelativeGeneric, RouteLocationAsPathGeneric } from 'vue-router'
type RouterType = string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric

defineProps<{
  to: RouterType
}>()

const router = useRouter()

function routerPush(to: RouterType) {
  router.push(to)
}
</script>

<style scoped>
.item-root {
  width: 40vh;
  height: 150px;
  background-color: #e8e8e8;
  border-radius: 20px;
  margin-right: 5vh;
  padding: 20px;
  box-sizing: border-box;
}

.item-root:hover {
  background-color: #d0d0d0;
  cursor: pointer;
}

h3 {
  font-size: 1.5rem;
  margin: 5px 0;
  color: rgb(84, 84, 84);
}

@media (max-width: 1024px) {
  .item-root {
    margin: 25px 0;
    width: 100%;
  }
}
</style>
