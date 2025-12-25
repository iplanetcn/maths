<template>
  <div>
    <div
        class="container max-w-[800px] flex-grow flex-shrink-0 mx-auto p-12 shadow bg-white text-3xl grid grid-cols-4 print:grid-cols-4 print:p-0 print:shadow-none"
        style="font-family: consolas,sans-serif;">
      <div
          v-for="(item, index) in resultArr"
          :key="index"
          class="flex items-center justify-center">
            <span class="text-xs text-gray-400 mr-2">
              {{ index + 1 }}.
            </span>
        {{ String(item).padStart(2, ' ') }}
      </div>
    </div>
    <div class="text-center">
      <RouterLink to="/" class="inline-block text-sky-500 p-8 no-underline">
        继续生成数学题
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from 'vue'
import {RouterLink, useRoute, useRouter} from 'vue-router'

const route = useRoute()
const router = useRouter()

const resultArr = computed<number[]>(() => {
  const resultString = String(route.params.resultString || '')
  const arr = resultString.split('')
  const res: number[] = []
  while (arr.length >= 2) {
    let item = arr.splice(0, 2).join('')
    item = item.replace('_', '')
    res.push(parseInt(item, 36))
  }
  return res
})

onMounted(() => {
  document.title = '查看结果'
  if (resultArr.value.length === 0) {
    alert('二维码异常')
    router.replace('/')
  }
})
</script>


