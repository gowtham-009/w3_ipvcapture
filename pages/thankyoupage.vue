<template>
  <div class="main-container">
    <div class="content-wrapper" :style="{ maxWidth: device === 'Desktop' ? '500px' : '100%' }">
      <div class="container" :style="{ height: deviceHeight + 'px' }">
        <div class="top-box bg-white" :style="{ height: topBoxHeight + 'px' }">
          <div class="w-1/6 flex justify-center items-center">
            <span @click="goBack">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"
                class="size-5 font-bold">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </span>
          </div>
          <div class="w-5/6 p-1">
            <p class="text-black font-medium text-lg">In-Person Verification (IPV)</p>
            <p class="text-sm text-gray-500 leading-3.5">Complete verification from anywhere</p>
          </div>
          <div class="w-1/6 p-1 px-2">
            <!-- <button @click="open = true">
              <img src="~/assets/images/help-icon.png" alt="Help" width="100" height="100">
            </button> -->
          </div>
        </div>
        <div class="center-box">
          <div class="scroll-content">
            <div class="w-full p-1 px-4 mt-1 flex justify-between bg-white">
              <p class="font-bold text-black text-md">{{ clientname.charAt(0).toUpperCase() + clientname.slice(1) }}</p>
              <p class="font-bold text-gray-500 text-sm">UCC: {{ clientcode.charAt(0).toUpperCase() + clientcode.slice(1) }}</p>
            </div>
            <div class="bg-white w-full p-2 mt-2">
              <div class="mt-4 p-2 bg-yellow-100 flex justify-center gap-2 text-yellow-700 rounded-lg">
                <img src="~/assets/images/check.png" width="30" height="30" alt="">
                <i>Thank you, IPV is completed</i>
              </div>

              <div class="w-full flex justify-center mt-1">
                <div class="w-70 h-70 rounded-full">
                  <img class="w-70 h-70 rounded-full" :src="src" alt="IPV Image">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

 
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute()
const router = useRouter();

const clientname = ref('')
const clientcode = ref('')
const src = ref('');
const device = ref('Mobile') // Initialize as Mobile
const deviceHeight = ref(0);

const topBoxHeight = computed(() => (deviceHeight.value * 0.1) - 20);

const getdata=async()=>{
 const mydata = await getServerData();
 if(mydata.payload.status=='ok'){
   clientname.value = mydata.payload.metaData.profile.clientName || '';
 clientcode.value =  mydata.payload.metaData.profile.clientCode || '';
  const userToken = sessionStorage.getItem('userkey');
  const ipv = mydata.payload.metaData.proofs.ipvImg || '';

  const id = mydata.payload.metaData.profile.id || '';
const base64Id = btoa(id.toString());

alert(base64Id)
 src.value = `https://nnkyc.w3webtechnologies.co.in/api/v1/view/uploads/C58EC6E7053B95AEF7428D9C7A5DB2D892EBE2D746F81C0452F66C8920CDB3B1/${userToken}/${ipv}`;
const routepage=  await pagestatus('signdraw');
if(routepage.payload.status=='ok'){

  window.location.href = `https://nnkyc.w3webtechnologies.co.in/client/ipv-link.php?${base64Id}&ipvcaptured`;
}

 }

}

const updateHeight = () => {
  if (typeof window !== 'undefined') {
    deviceHeight.value = window.innerHeight;
    // Update device type based on window width
    device.value = window.innerWidth <= 992 ? 'Mobile' : 'Desktop';
  }
};

const goBack = () => {
  router.go(-1); 
};

onMounted(async () => {
  await getdata();
  
  
  updateHeight();
  window.addEventListener('resize', updateHeight);

 
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateHeight);
  }
});
</script>

<style scoped>
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
  display: flex;
  justify-content: center;
}

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

@media (min-width: 993px) {
  .content-wrapper {
    max-width: 500px;
    height: 100vh;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .container {
    border-radius: 0;
  }
}

@media (max-width: 992px) {
  .content-wrapper {
    max-width: 100%;
  }
}

.w-70 {
  width: 280px;
  height: 280px;
  object-fit: cover;
}
</style>