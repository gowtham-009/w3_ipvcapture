<template>
  <div class="flex items-center justify-center space-x-2" :class="containerClass">
    <div 
      v-for="(dot, index) in dots"
      :key="index"
      class="rounded-full"
      :class="[dot.size, dot.color, dot.animation, dot.delay]"
    />
  </div>
</template>

<script setup lang="ts">
interface DotConfig {
  size: string
  color: string
  animation: string
  delay: string
}

interface Props {
  size?: 'sm' | 'md' | 'lg'
  centered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  centered: false
})

const containerClass = computed(() => ({
  'h-screen w-screen fixed inset-0 bg-white/80 backdrop-blur-sm': props.centered
}))

const sizeMap = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4'
}

const dots = computed<DotConfig[]>(() => [
  {
    size: sizeMap[props.size],
    color: 'bg-blue-500', // Google blue
    animation: 'animate-google-bounce',
    delay: 'animation-delay-300'
  },
  {
    size: sizeMap[props.size],
    color: 'bg-red-500', // Google red
    animation: 'animate-google-bounce',
    delay: 'animation-delay-150'
  },
  {
    size: sizeMap[props.size],
    color: 'bg-yellow-400', // Google yellow
    animation: 'animate-google-bounce',
    delay: ''
  },
  {
    size: sizeMap[props.size],
    color: 'bg-green-500', // Google green
    animation: 'animate-google-bounce',
    delay: 'animation-delay-150'
  }
])
</script>

<style>
@keyframes google-bounce {
  0%, 80%, 100% { 
    transform: scale(0);
    opacity: 0.5;
  }
  40% { 
    transform: scale(1);
    opacity: 1;
  }
}

.animate-google-bounce {
  animation: google-bounce 1.4s infinite ease-in-out both;
}

.animation-delay-150 {
  animation-delay: -0.15s;
}

.animation-delay-300 {
  animation-delay: -0.3s;
}
</style>