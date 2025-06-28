<template>
  <div class="w-full h-screen flex flex-col justify-between bg-gray-100 overflow-hidden">
    <div class="w-full flex-1 overflow-hidden">
      <div class="w-full flex bg-white">
        <div class="w-1/6 flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
        <div class="w-5/6 p-1">
          <p class="text-black font-medium text-lg">In-Person Verification (IPV)</p>
          <p class="text-sm text-gray-500 leading-3.5">Complete verification from anywhere, in minutes</p>
        </div>
        <div class="w-1/6 p-1">
          <button @click="open = true">
            <img src="~/assets/images/help.png" alt="Help" width="100" height="100">
          </button>
        </div>
      </div>
     
      <!-- Scrollable content container -->
      <div class="w-full h-full overflow-y-auto" style="max-height: calc(100vh - 120px);">
        <div class="w-full p-1 px-2 mt-1 bg-white">
          <p class="font-bold text-black text-lg">Client Name</p>
          <p class="font-bold text-gray-500 text-sm">UCC: 0000</p>
        </div>

        <div class="w-full flex justify-center items-center bg-white">
          <div v-if="locationEnabled" class="w-full flex items-center flex-col justify-center py-1 rounded-lg bg-yellow-100">
            <p class="text-lg text-gray-500">Your Approx Location</p>
            <span class="text-gray-500 text-sm">{{ latitude.toFixed(4) }} - {{ longitude.toFixed(4) }}</span>
          </div>

          <div v-if="locationLoading" class="w-full flex items-center flex-col justify-center py-1 rounded-lg bg-yellow-100">
            <p class="text-lg text-gray-500 mb-2">Accessing GPS Location</p>
            <LOADING/>
          </div>
        </div>

       

        <div v-if="showLocationAlert" class="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-lg">
          <div class="flex items-start">
            <i class="pi pi-exclamation-triangle text-xl mr-3 mt-0.5"></i>
            <div>
              <p class="font-bold">Location Access Required</p>
              <p class="mt-1">We need your location to verify your identity. Please enable location services in your {{ device }} settings.</p>
              <div class="flex gap-2 mt-3">
                <button @click="requestLocation" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  <i class="pi pi-refresh mr-1"></i> Try Again
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="locationEnabled" class="w-full mt-3 flex justify-center flex-col">
           <div class="w-full bg-yellow-100 rounded-lg px-1 py-2">
          <p class="text-lg text-gray-500 leading-5">Ensure your nose is positioned at the center of the cross</p>
        </div>
          <CMAIDENTIFY 
          class="mt-1"
            ref="cameraComponent"
            @captured="onImageCaptured" 
            @error="onCameraError" 
            @retake="handleRetake" 
          />
        </div>

        <div v-if="ipverror" class="w-100 p-1 bg-red-100 mt-2 px-2 rounded-lg">
          <p class="text-sm text-red-500 text-center leading-5">{{ ipvlimiterror }}</p>
        </div>

        <div v-if="loadingprogress" class="max-w-md mx-auto p-2 px-2 bg-white  shadow-lg rounded-lg">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-1">
            {{ syncStatus.icon }} {{ syncStatus.title }}
          </h2>

          <p class="text-gray-600  mb-2">
            {{ syncStatus.message }}
          </p>

          <div class="w-full bg-gray-400  rounded-full h-6 overflow-hidden relative">
            <div
              class="bg-blue-600 h-6 text-white text-sm font-medium text-center flex items-center justify-center transition-all duration-300 ease-in-out"
              :style="{ width: progress + '%' }">
              {{ progress.toFixed(2) }}%
            </div>
          </div>
        </div>

        <div v-if="cameraError" class="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
          <div class="flex items-center">
            <div>
              <p class="font-bold">Camera Error</p>
              <p>{{ cameraError }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <div class="w-full p-1">
      <button 
        type="button" 
        class="w-full rounded-lg text-white px-2 py-2" 
        :class="{
          'bg-blue-500 hover:bg-blue-600': imageCaptured,
          'bg-gray-400 cursor-not-allowed': !imageCaptured
        }" 
        :disabled="!imageCaptured"
        @click="handleNext"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>

  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-10" @close="open = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <div class="mt-3 flex justify-center sm:mt-5">
                  <img src="~/assets/images/imgrule.jpg" alt="Rules">
                </div>
              </div>
              <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:col-start-1 sm:mt-0" @click="open = false" ref="cancelButtonRef">Cancel</button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>



<script setup>
import { ref, onMounted,onUnmounted, computed, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

import { useRouter, useRoute } from 'vue-router';
import CMAIDENTIFY from '~/components/cmaidentify.vue';
import LOADING from '~/components/googleloading.vue';


const cameraComponent = ref(null);


const buttonText = ref("Next");

const open = ref(false)
const isButtonClicked = ref(false)
const ipverror=ref(false)
const ipvlimiterror=ref('')

const locationEnabled = ref(false);
const locationLoading = ref(true);
const showLocationAlert = ref(false);
const latitude = ref(null);
const longitude = ref(null);

const locationInterval = ref(null);

// Camera & Image State
const imageCaptured = ref(null);
const cameraError = ref(null);

const loadingprogress = ref(false)




const device=ref('Desktop')

const route=useRoute()
onMounted(() => {
  locationLoading.value = true;
  setupResizeListener();
  checkLocationPermission();

  // 🔁 Start location polling every 5 seconds
  locationInterval.value = setInterval(() => {
    if (!locationEnabled.value) {
      getLocationWithTimeout(true);
    }
  }, 5000);


});



onUnmounted(() => {
  if (locationInterval.value) {
    clearInterval(locationInterval.value);
    locationInterval.value = null;
  }
});


// Methods
function setupResizeListener() {
  const updateDeviceInfo = () => {
   
    device.value = window.innerWidth <= 992 ? 'Mobile' : 'Desktop';
  };

  // Set initial values
  updateDeviceInfo();

  // Add resize listener
  window.addEventListener('resize', updateDeviceInfo);
}

const handleRetake = () => {
  imageCaptured.value = false // This will disable the Next button
}

async function checkLocationPermission() {
  try {
    locationLoading.value = true;
    showLocationAlert.value = false;

    if (!navigator.geolocation) {
      throw new Error('Geolocation not supported');
    }

    // Modern permission API check
    if (navigator.permissions) {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
      handlePermissionState(permissionStatus.state);
      
      permissionStatus.onchange = () => {
        handlePermissionState(permissionStatus.state);
      };
    } else {
      // Fallback for older browsers
      getLocationWithTimeout();
    }
  } catch (err) {
    handleLocationError(err);
  }
}

function handlePermissionState(state) {
  if (state === 'granted') {
    getLocationWithTimeout();
  } else if (state === 'prompt') {
    getLocationWithTimeout();
  } else {
    locationLoading.value = false;
    showLocationAlert.value = true;
  }
}

function getLocationWithTimeout(isRepeated = false) {
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      handleLocationSuccess(position);
      if (isRepeated && locationInterval.value) {
        clearInterval(locationInterval.value); // ✅ Stop interval after successful location fetch
        locationInterval.value = null;
      }
    },
    (err) => {
      handleLocationError(err);
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}


function handleLocationSuccess(position) {
  latitude.value = position.coords.latitude;
  longitude.value = position.coords.longitude;
  locationEnabled.value = true;
  locationLoading.value = false;
  showLocationAlert.value = false;
}

function handleLocationError(error) {
  console.error('Location error:', error);
  locationLoading.value = true;
  showLocationAlert.value = true;
  locationEnabled.value = false;
}

function requestLocation() {
  showLocationAlert.value = false;
  locationLoading.value = true;
  getLocationWithTimeout();
}

function onImageCaptured(imageData) {
  imageCaptured.value = imageData;
  cameraError.value = null;
}

function onCameraError(error) {
  cameraError.value = error.message || 'Failed to access camera';
}

const getCountry = async () => {
  if (!latitude.value || !longitude.value) {
    console.error('Latitude or longitude is missing')
    return
  }

  const apiKey = 'R2ey6sqmfP210eJgVXX-NvmoUgrKlDAW4JwVXgVEaHs'
  const apiUrl = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latitude.value},${longitude.value}&lang=en-US&apiKey=${apiKey}`

  try {
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`)
    }
    const data = await response.json()
    if (data) {
      const geolocation = {
        latitute: data.items[0].position.lat,
        longitude: data.items[0].position.lng,
        conuntryname: data.items[0].address.countryName,
        countrycode: data.items[0].address.countryCode,
      }
      return geolocation
    }

  } catch (error) {
    console.error('Error fetching location:', error.message)
  }
}



const progress = ref(0);
const progressInterval = ref(null);
const syncStatus = computed(() => {
  if (progress.value <= 30) {
    return {
      title: 'Syncing',
      message: 'Saving...'
    };
  } else if (progress.value <= 80) {
    return {
      title: 'Syncing',
      message: 'Verifying...'
    };
  } else if (progress.value < 100) {
    return {
      title: 'Syncing',
      message: 'Completing...'
    };
  } else {
    return {
      title: 'Syncing!',
      message: 'IPV uploaded successfully!'
    };
  }
});

const startProgressAnimation = () => {
  progress.value = 0;
  // Smooth progress animation
  progressInterval.value = setInterval(() => {
    if (progress.value < 90) { // Only animate to 90%, rest will complete on API success
      progress.value += Math.random() * 10;
      if (progress.value > 90) progress.value = 90;
    }
  }, 300);
};

const completeProgress = () => {
  clearInterval(progressInterval.value);
  progress.value = 100;
  setTimeout(() => {
    loadingprogress.value = false;
  }, 500);
};



const router=useRouter()




const ipvfunction = async () => {
   ipverror.value=false
  if(!imageCaptured.value){
    ipverror.value=true
    ipvlimiterror.value="Ipv image invalid"
    return
  }
  loadingprogress.value = true
  startProgressAnimation();


  const apiurl = "https://gkyc.gwcindia.in/kyc-api/face-liveness.php";


  try {
 
   const formData = new FormData();


const base64Data = imageCaptured.value.split(',')[1] || imageCaptured.value;
formData.append('fileData', base64Data);
  


    const uploadResponse = await fetch(apiurl, {
      method: 'POST',
     
      body: formData,
    });


    if (!uploadResponse.ok) {
      throw new Error(`Network error: ${uploadResponse.status}`);
    }

    const data = await uploadResponse.json();

    if (data.is_real == true ) {
      localStorage.setItem('ipv', data.req_id)
    completeProgress();
      router.push('/thankyoupage')
    }
  } catch (error) {
 
    console.error('IPv Upload Failed:', error.message);
  }
};


const handleNext = () => {
 if(route.query.clientname && route.query.clientcode){
  ipvfunction()
 }
 else{
  alert('Client code exist')
//  ipverror.value=true
//  ipvlimiterror.value="Client code exist"
 }
};




</script>
<style>
/* Add this if you need custom scrollbar styling */
.scroll-container::-webkit-scrollbar {
  width: 6px;
}
.scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.scroll-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}
.scroll-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>