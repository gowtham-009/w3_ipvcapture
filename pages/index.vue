<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import adHELPCARSOULE from '~/components/adhelpcarsoule.vue'
import iosHELPCARSOULE from '~/components/ioshelpcarsoule.vue'

const isIOS = ref(false)
const deviceHeight = ref(0)

const router = useRouter()
const route = useRoute()

const updateHeight = () => {
  if (typeof window !== 'undefined') {
    deviceHeight.value = window.innerHeight
  }
}

onMounted(() => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    isIOS.value = true
  }

  if (typeof window !== 'undefined') {
    const queryName = route.query.clientname
    const queryCode = route.query.clientcode

    if (queryName && queryCode) {
      localStorage.setItem('clientname', queryName)
      localStorage.setItem('clientcode', queryCode)

      if (window.history.replaceState) {
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
  }

  updateHeight()
  window.addEventListener('resize', updateHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeight)
})

const topBoxHeight = computed(() => (deviceHeight.value * 0.1)-20);
const bottomBoxHeight = computed(() =>(deviceHeight.value * 0.1) - 20);
const centerBoxHeight = computed(() => deviceHeight.value - topBoxHeight.value - bottomBoxHeight.value)

const handleNext = () => {
  if (localStorage.getItem('clientname') && localStorage.getItem('clientcode')) {
    router.push('/ipv')
  } else {
    alert('Client code exist')
  }
}
</script>

<template>
  <div class="main-container">
    <div class="content-wrapper" :style="{ height: deviceHeight + 'px' }">
      <!-- Top Box -->
      <div class="top-box bg-white" :style="{ height: topBoxHeight + 'px' }">
         <div class="w-1/6 flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"
          class="size-5 font-bold">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </div>
      <div class="w-5/6 p-1">
        <p class="text-black font-medium text-lg">In-Person Verification (IPV)</p>
        <p class="text-sm text-gray-500 leading-3.5">Complete verification from anywhere</p>
      </div>
      </div>

      <!-- Center Box -->
      <div class="center-box" :style="{ height: centerBoxHeight + 'px' }">
        <div v-if="isIOS" class="box1 px-8 pt-2">
          <iosHELPCARSOULE class="w-full " />
        </div>
        <div v-else class="box2 px-8 pt-2" >
          <adHELPCARSOULE class="w-full " />
        </div>
      </div>

      <!-- Bottom Box -->
      <div class="bottom-box bg-white px-2" :style="{ height: bottomBoxHeight + 'px' }">
        <button type="button" class="w-full bg-blue-500 rounded-lg text-white px-2 py-3" @click="handleNext">
          Proceed
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.top-box {

  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #ccc;
  flex-shrink: 0;
}
.main-container {
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: rgb(219, 219, 219);
}

.content-wrapper {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.center-box {
  overflow: hidden;
  background-color: #f9f9f9;
}

.bottom-box {
  display: flex;
  align-items: center;

}

.box1, .box2 {
  width: 100%;
}
</style>
