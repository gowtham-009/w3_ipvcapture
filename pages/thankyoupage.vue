<template>
  <div class="w-full h-screen flex flex-col justify-between bg-gray-100">
    <div class="w-full">
      <div class="w-full flex bg-white">
        <div class="w-1/6 flex justify-center items-center">
          <span @click="goBack">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
              class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </span>
        </div>
        <div class="w-5/6 p-1">
          <p class="text-black font-medium text-lg">In-Person Verification (IPV)</p>
          <p class="text-sm text-gray-500 leading-3.5">Complete verification from anywhere, in minutes</p>
        </div>
        <div class="w-1/6 p-1">
          <button @click="open = true">
            <img 
              src="~/assets/images/help.png" 
              alt="Help" 
              width="100" 
              height="100"
            >
          </button>
        </div>
      </div>
     
      <div class="w-full p-1 px-2 mt-1 bg-white">
        <p class="font-bold text-black text-lg">Client Name</p>
        <p class="font-bold text-gray-500 text-sm">UCC: 0000</p>
      </div>

      <div class="mt-4 p-2 bg-yellow-100 flex justify-center gap-2 text-yellow-700 rounded-lg">
        <img src="~/assets/images/check.png" width="30" height="30" alt="">
        <i>Thank you, IPV is completed</i>
      </div>
      
      <div class="w-full flex justify-center mt-1">
        <div class="w-70 h-70 rounded-full" >
          <img class="w-70 h-70 rounded-full" :src="src" alt="IPV Image">
        </div>
      </div>
    </div>
  
    <div class="w-full p-1"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const src = ref('');
const open = ref(false);

const goBack = () => {
  router.go(-1); 
};

onMounted(() => {
  const ipv = localStorage.getItem('ipv');
  src.value = `https://gkyc.gwcindia.in/kyc-api/uploads/${ipv}.png`;
});
</script>

<style>
/* Add any custom styles here if needed */
</style>