<template>
  <div class="flex items-center justify-center">
    <div class="relative w-full  max-w-3xl ">
      <!-- Slide Content -->
      <transition name="fade" mode="out-in">
        <div
          v-if="currentSlide"
          :key="currentSlide.id"
          class="bg-blue-500 text-white text-3xl font-bold  rounded-xl  flex items-center justify-center px-6 text-center"  :style="{ height: carsoule + 'px' }"
        >
          <div>
            <div v-if="currentSlide.image" class="mb-4">
              <img :src="currentSlide.image" alt="Slide image" class="w-32 h-32 mx-auto rounded-full" />
            </div>
            <p>{{ currentSlide.content }}</p>
          </div>
        </div>
      </transition>

      <!-- Prev/Next Buttons -->
      <button
        class="absolute -left-6 top-70 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full shadow-md hover:text-orange-500 transition"
        @click="goToPrevious"
      >&#8592;</button>

      <button
        class="absolute -right-6 top-70 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full shadow-md hover:text-orange-500 transition"
        @click="goToNext"
      >&#8594;</button>

      <!-- Indicators -->
      <div class="mt-6 flex items-center justify-center space-x-2">
        <button
          v-for="(slide, index) in slides"
          :key="slide.id"
          @click="activeSlide = index"
          class="w-8 h-2 rounded-full transition-all duration-200"
          :class="{
            'bg-blue-600': activeSlide === index,
            'bg-blue-300': activeSlide !== index
          }"
        ></button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const deviceHeight = ref(0)
const updateHeight = () => {
  if (typeof window !== 'undefined') {
    deviceHeight.value = window.innerHeight
  }
}

onMounted(() => {
     updateHeight()
  window.addEventListener('resize', updateHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeight)
})
const carsoule = computed(() => deviceHeight.value *0.8)
const slides = ref([
  { id: 1, content: 'Welcome to Slide One ios' },
  { id: 2, content: '🌟 Slide Two has stars! ios' },
  { id: 3, content: '🎉 Celebrate Slide Three ios' },
  { id: 4, content: '📷 Image Slide Four', image: '/image4.jpg' },
  { id: 5, content: '🧠 Final Slide' }
])

const activeSlide = ref(0)

const currentSlide = computed(() => slides.value[activeSlide.value])

const goToPrevious = () => {
  activeSlide.value = activeSlide.value === 0 ? slides.value.length - 1 : activeSlide.value - 1
}

const goToNext = () => {
  activeSlide.value = activeSlide.value === slides.value.length - 1 ? 0 : activeSlide.value + 1
}
</script>
<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>