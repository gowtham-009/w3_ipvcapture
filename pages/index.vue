<template>

   <div class="main-container">
     <div class="content-wrapper" :style="{ maxWidth: device === 'Desktop' ? '500px' : '100%' }">
          <div class="container !w-full" :style="{ height: deviceHeight + 'px' }">
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

   
    <div class="center-box">
      <div class="scroll-content" style="border: 2px solid red;">
      
       
      </div>
    </div>
    <div class=" px-2" :style="{ height: bottomBoxHeight + 'px' }">
       <button type="button" class="w-full bg-blue-500 rounded-lg text-white px-2 py-3" @click="handleNext">
       Proceed
      </button>
    </div>
  </div>
     </div>
   </div>



</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';


import { useRouter, useRoute } from 'vue-router';

import HELPCARSOULE from '~/components/helpcarsoule.vue';








const route = useRoute()

const deviceHeight = ref(0);
const topBoxHeight = computed(() => (deviceHeight.value * 0.1)-20);
const bottomBoxHeight = computed(() =>(deviceHeight.value * 0.1) - 20);;

const updateHeight = () => {
  if (typeof window !== 'undefined') {
    deviceHeight.value = window.innerHeight;
  }
};

onMounted(() => {

   if (typeof window !== 'undefined') {
    const queryName = route.query.clientname;
    const queryCode = route.query.clientcode;

    if (queryName && queryCode) {
      // clientname.value = queryName;
      // clientcode.value = queryCode;

      // localStorage.setItem('clientname', queryName);
      // localStorage.setItem('clientcode', queryCode);

      // Clean URL (remove query parameters)
      if (window.history.replaceState) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    } else {
      // Load from localStorage fallback
      // clientname.value = localStorage.getItem('clientname') || '';
      // clientcode.value = localStorage.getItem('clientcode') || '';
    }
  }


  updateHeight();
  window.addEventListener('resize', updateHeight);


 
  


});






















const router = useRouter()
const handleNext = () => {
  if (localStorage.getItem('clientname') && localStorage.getItem('clientcode')) {
    router.push('/ipv');
  }
  else {
    alert('Client code exist')
  }
};

</script>

<style scoped>
/* Keep the same styles as previous solution */

.main-container {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  background-color: rgb(219, 219, 219);
}

.content-wrapper {
  width: 100%;
  margin: 0 auto;
}

/* Keep your existing styles */
.container {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  width: 100%;
  background-color: rgb(219, 219, 219);
}

.top-box {

  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #ccc;
  flex-shrink: 0;
}

.center-box {
  flex: 1;
  overflow-y: auto;
  background-color: #f9f9f9;
}




</style>