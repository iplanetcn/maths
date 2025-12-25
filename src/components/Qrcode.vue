<template>
  <img :alt="value" :class="className" :src="image"/>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import QrCode from 'qrious'

const props = withDefaults(
    defineProps<{
        errorCorrection?: string
        background?: string
        color?: string
        size?: number | string
        value?: string
        padding?: number
        className?: string
    }>(),
    {
        errorCorrection: 'M',
        background: '#fff',
        color: '#000',
        size: 200,
        value: '',
        padding: 0,
        className: 'qrcode block'
    }
)

const image = ref('')
const qr = new QrCode()

const generateQrCode = () => {
    if (!props.value) return
    qr.set({
        background: props.background,
        foreground: props.color,
        level: props.errorCorrection,
        padding: props.padding,
        size: Number(props.size),
        value: props.value
    })
    image.value = qr.toDataURL('image/jpeg')
}

onMounted(() => {
    generateQrCode()
})

watch(
    () => ({
        background: props.background,
        color: props.color,
        errorCorrection: props.errorCorrection,
        size: props.size,
        value: props.value,
        padding: props.padding
    }),
    () => {
        generateQrCode()
    }
)
</script>


