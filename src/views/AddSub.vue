<template>
  <div>
    <div class="flex flex-wrap items-center justify-center my-6 print:hidden">
      <div class="mx-4 my-2 whitespace-nowrap flex items-center">
        <strong>范围：</strong>
        <span v-for="(range, index) in ranges" :key="range">
          <input
            :id="`range${index}`"
            v-model="currentRange"
            :value="range"
            class="peer"
            name="range"
            type="radio"/>
          <label
            :for="`range${index}`"
            class="peer-checked:text-sky-500 peer-checked:font-bold">
          {{ range }}
          </label>
        </span>
      </div>
      <div class="mx-4 my-2 whitespace-nowrap flex items-center">
        <strong>运算：</strong>
        <span v-for="(label, key, index) in methods" :key="key">
            <input
              :id="`method${index}`"
              v-model="currentMethod"
              :value="key"
              class="peer"
              name="method"
              type="radio"
            />
            <label
              :for="`method${index}`"
              class="peer-checked:text-sky-500 peer-checked:font-bold"
            >
                {{ label }}
            </label>
                </span>
      </div>
      <div class="mx-4 my-2 whitespace-nowrap flex items-center">
        <strong>运算数：</strong>
        <span class="mx-2">{{ num }}</span>
        <input v-model.number="num" max="4" min="2" type="range"/>
      </div>
      <div class="mx-4 my-2 whitespace-nowrap flex items-center">
        <strong>规则：</strong>
        <span>
            <input
              id="addCarry"
              v-model="rules"
              :disabled="currentMethod === 'sub'"
              class="peer"
              type="checkbox"
              value="addCarry"
            />
            <label
              class="peer-checked:text-sky-500 peer-checked:font-bold peer-disabled:text-gray-400"
              for="addCarry"
            >
                可进位
            </label>
        </span>
        <span>
            <input
              id="subBack"
              v-model="rules"
              :disabled="currentMethod === 'add' || currentRange === 10"
              class="peer"
              type="checkbox"
              value="subBack"
            />
            <label
              class="peer-checked:text-sky-500 peer-checked:font-bold peer-disabled:text-gray-400"
              for="subBack"
            >
                可退位
            </label>
        </span>
        <span>
            <input
              id="repeat"
              v-model="rules"
              class="peer"
              type="checkbox"
              value="repeat"
            />
            <label
              class="peer-checked:text-sky-500 peer-checked:font-bold  peer-disabled:text-gray-400"
              for="repeat"
            >
                可重复
            </label>
        </span>
        <span>
            <input
              id="cloze"
              v-model="rules"
              class="peer"
              type="checkbox"
              value="cloze"
            />
            <label
              class="peer-checked:text-sky-500 peer-checked:font-bold peer-disabled:text-gray-400"
              for="cloze"
            >
                填空题
            </label>
        </span>
      </div>

      <div class="mx-4 my-2 whitespace-nowrap flex items-center">
        <strong>占位符：</strong>
        <span v-for="(placeholder, index) in placeholders" :key="placeholder.name">
          <input
            :id="`placeholder${index}`"
            v-model="currentPlaceholder"
            :value="placeholder"
            class="peer"
            name="placeholder"
            type="radio"
          />
          <label
            :for="`placeholder${index}`"
            class="peer-checked:text-sky-500 peer-checked:font-bold"
          >
              {{ placeholder.label }}
          </label>
        </span>
      </div>
    </div>

    <div class="text-center mb-6 print:hidden">
      <span>
          <strong>题数：</strong>
          {{ resLen }}
          <input
            v-model.number="resLen"
            max="50"
            min="1"
            name="points"
            type="range"
          />
      </span>
      <button
        class="bg-sky-500 border-none text-white px-4 py-1 cursor-pointer hover:bg-sky-400"
        @click="submit"
      >
        生成
      </button>
      <button
        :disabled="res.length === 0"
        class="bg-sky-500 border-none text-white px-4 py-1 cursor-pointer hover:bg-sky-400 disabled:bg-neutral-400 disabled:text-neutral-200 disabled:cursor-not-allowed disabled:hover:bg-neutral-400"
        @click="printPage"
      >
        打印
      </button>
      <span>
        <input
          id="showRes"
          v-model="showRes"
          class="peer"
          type="checkbox"
        />
        <label
          class="peer-checked:text-sky-500 peer-checked:font-bold peer-disabled:text-gray-400"
          for="showRes">
            显示结果
        </label>
      </span>
      <router-link :hidden="res.length === 0" :to="resStr()">查看答案</router-link>
    </div>

    <div
      class="relative container max-w-[800px] overflow-hidden mx-auto p-12 pb-20 bg-white"
    >
      <div
        class="flex-grow flex-shrink-0 text-xl grid grid-cols-3 print:grid-cols-3 print:p-0 print:shadow-none"
        style="font-family: consolas,serif;"
      >
        <div
          v-for="(item, index) in res"
          :key="index"
          class="flex items-center mb-6.5 group"
        >
          <span class="text-xs text-gray-300 mr-2">
              {{ String(index + 1).padStart(2, '0') }}.
          </span>

          <span v-for="(number, i) in item.numbers" :key="i" class="text-2xl">
            {{
              number !== 'cloze'
                ? number
                : showRes
                  ? (isUnderscore(currentPlaceholder) ? `(${item.result})` : `${currentPlaceholder.prefix}${item.result}${currentPlaceholder.suffix}`)
                  : currentPlaceholder.value
            }}{{
              item.methods[i] !== undefined
                ? operator[item.methods[i]] + ''
                : ''
            }}
          </span>

          <button
            v-if="!(currentRange === 10 && currentMethod === 'add')"
            aria-label="重新生成本题"
            class="invisible cursor-pointer text-xs group-hover:visible print:hidden ml-2"
            title="重新生成本题"
            type="button"
            @click="refresh(index)"
          >
            <IconRefresh/>
          </button>
        </div>
      </div>
      <div v-if="qrcodeStr" hidden="hidden">
        <div class="flex items-center absolute right-0 bottom-0">
          <div>扫一扫 查答案 &nbsp;</div>
          <Qrcode :value="qrcodeStr" size="100"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import Qrcode from '../components/Qrcode.vue'
import IconRefresh from '../components/icon/Refresh.vue'

type MethodKey = 'add' | 'sub' | 'add_sub'

const methods: Record<MethodKey, string> = {
  add: '加法',
  sub: '减法',
  add_sub: '加减法'
}

const operator = ['+', '-', '×', '÷', '=']

const ranges = [10, 20, 50, 100]

const qrcodeStr = ref('')

interface Placeholder {
  name: string,
  label: string,
  value: string,
  prefix: string,
  suffix: string
}

function isUnderscore(placeholder: Placeholder) {
  return placeholder.name === 'underscore'
}

const placeholders: Placeholder[] = [
  {name: 'brackets', label: '括号', value: '(   )', prefix: '(', suffix: ')'},
  {name: 'underscore', label: '下划线', value: '___', prefix: '', suffix: ''},
  {name: 'square brackets', label: '方括号', value: '[   ]', prefix: '[', suffix: ']'},
];

const currentPlaceholder = ref<Placeholder>(
  localStorage.getItem('currentPlaceholder') ? JSON.parse(localStorage.getItem('currentPlaceholder') as string) : placeholders[0]
)

const currentMethod = ref<MethodKey>(
  (localStorage.getItem('currentMethod') as MethodKey) || 'add'
)

const currentRange = ref<number>(
  localStorage.getItem('currentRange') ? parseInt(localStorage.getItem('currentRange') as string) : 10
)

const num = ref<number>(
  localStorage.getItem('num') ? JSON.parse(localStorage.getItem('num') as string) : 2
)
const rules = ref<string[]>(
  localStorage.getItem('rules') ? JSON.parse(localStorage.getItem('rules') as string) : []
)
const resLen = ref<number>(
  localStorage.getItem('resLen') ? parseInt(localStorage.getItem('resLen') as string) : 50
)

const res = ref<any[]>([])

const showRes = ref(false)

const clearRes = () => {
  res.value = []
  qrcodeStr.value = ''
}

const resStr = () => {
  const result: string[] = []
  res.value.forEach((item) => {
    result.push(item.result.toString(36).padStart(2, '_'))
  })
  return result.join('')
}

watch(currentMethod, (val) => {
  localStorage.setItem('currentMethod', val)
  // 减法时不允许进位
  if (val === 'sub') {
    rules.value = rules.value.filter((r) => r !== 'addCarry')
  }
  // 加法或 10 以内时不允许退位
  if (val === 'add' || currentRange.value === 10) {
    rules.value = rules.value.filter((r) => r !== 'subBack')
  }
  localStorage.setItem('rules', JSON.stringify(rules.value))
  clearRes()
})

watch(currentPlaceholder, (val) => {
  localStorage.setItem('currentPlaceholder', JSON.stringify(val))
})

watch(currentRange, (val) => {
  localStorage.setItem('currentRange', String(val))
  // 10 以内不允许退位
  if (currentMethod.value === 'add' || val === 10) {
    rules.value = rules.value.filter((r) => r !== 'subBack')
  }
  localStorage.setItem('rules', JSON.stringify(rules.value))
  clearRes()
})

watch(num, (val) => {
  localStorage.setItem('num', String(val))
  clearRes()
})

watch(rules, (val) => {
  // 减法时不允许进位
  if (currentMethod.value === 'sub') {
    rules.value = val.filter((r) => r !== 'addCarry')
  }
  // 加法或 10 以内时不允许退位
  if (currentMethod.value === 'add' || currentRange.value === 10) {
    rules.value = rules.value.filter((r) => r !== 'subBack')
  }
  localStorage.setItem('rules', JSON.stringify(rules.value))
  clearRes()
})

watch(resLen, (val) => {
  localStorage.setItem('resLen', String(val))
  clearRes()
})

watch(
  [currentRange, currentMethod],
  () => {
    document.title = `${currentRange.value}以内${methods[currentMethod.value]}`
  },
  {immediate: true}
)

const random = (min = 0, max: number = currentRange.value): number => {
  return Math.round(Math.random() * (max - min)) + min
}

const handleAdd = () => {
  let numbers: number[] = []
  if (rules.value.includes('addCarry')) {
    while (numbers.length < num.value) {
      numbers.push(random(1))
    }
  } else {
    const rangeStr = (currentRange.value - 1).toString().split('')
    const results: number[][] = []
    while (results.length < num.value) {
      results.push([])
    }
    rangeStr.forEach((item) => {
      let total = 0
      for (let i = 0; i < num.value; i++) {
        const a = random(0, parseInt(item) - total)
        total += a
        results[i].push(a)
      }
    })
    numbers = results.reduce<number[]>((total, item) => {
      total.push(parseInt(item.join('')))
      return total
    }, [])
  }
  const methodsArr: number[] = []
  while (methodsArr.length < numbers.length - 1) {
    methodsArr.push(0)
  }
  return {
    numbers,
    methods: methodsArr,
    result: numbers.reduce((total, n) => total + n, 0)
  }
}

const handleSub = () => {
  const a = random()
  let numbers: (number | string)[] = []

  const rangeStr = a.toString().split('')
  if (rules.value.includes('subBack')) {
    let total = a
    numbers.push(a)
    for (let i = 0; i < num.value - 1; i++) {
      const b = random(0, total - 1)
      total = total - b
      numbers.push(b)
    }
  } else {
    const results: number[][] = []
    while (results.length < num.value - 1) {
      results.push([])
    }
    rangeStr.forEach((item) => {
      let total = parseInt(item)
      for (let i = 0; i < num.value - 1; i++) {
        const b = random(0, total)
        total -= b
        results[i].push(b)
      }
    })
    numbers = results.reduce<(number | string)[]>(
      (total, item) => {
        total.push(parseInt(item.join('')))
        return total
      },
      [a]
    )
  }

  const methodsArr: number[] = []
  while (methodsArr.length < numbers.length - 1) {
    methodsArr.push(1)
  }

  return {
    numbers,
    methods: methodsArr,
    result: (numbers as number[]).reduce((total, n) => {
      if (total === 0) {
        total = n
      } else {
        total = total - n
      }
      return total
    }, 0)
  }
}

const generator = () => {
  let item: any
  switch (currentMethod.value) {
    case 'add':
      item = handleAdd()
      break
    case 'sub':
      item = handleSub()
      break
    case 'add_sub':
      item = random(0, 2) ? handleAdd() : handleSub()
      break
  }

  if (rules.value.includes('cloze')) {
    const clozeIndex = random(0, item.numbers.length - 1)
    item.numbers.push(item.result)
    item.methods.push(4)
    item.result = item.numbers[clozeIndex]
    item.numbers[clozeIndex] = 'cloze'
  } else {
    item.numbers.push('cloze')
    item.methods.push(4)
  }
  return item
}

const handleQrcode = () => {
  const qrcodeRes: string[] = []
  res.value.forEach((item) => {
    qrcodeRes.push(item.result.toString(36).padStart(2, '_'))
  })
  const base = window.location.href
  const hash = window.location.hash === '' ? '#/' : ''
  qrcodeStr.value = base + hash + qrcodeRes.join('')
}

const submit = () => {
  let total: any[] = []
  let time = 0
  while (total.length < resLen.value && time < 999) {
    time++
    const newItem = generator()
    if (newItem.numbers.includes(0)) {
      continue
    }
    if (!rules.value.includes('repeat')) {
      total = total.filter((item) => {
        return JSON.stringify(item) !== JSON.stringify(newItem)
      })
    }
    total.push(newItem)
  }
  res.value = total
  handleQrcode()
}

const printPage = () => {
  window.print()
}

const refresh = (index: number) => {
  if (rules.value.includes('repeat')) {
    res.value[index] = generator()
  } else {
    let newItem: any
    let time = 0
    while (!newItem && time < 100) {
      time++
      const _item = generator()
      const exist = res.value.some((item) => {
        return JSON.stringify(item) === JSON.stringify(_item)
      })
      if (!exist && !_item.numbers.includes(0)) {
        newItem = _item
      }
    }
    res.value[index] = newItem
  }
  handleQrcode()
}
</script>


