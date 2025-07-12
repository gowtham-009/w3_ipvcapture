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
      <div class="w-1/6 p-1 px-2" >
        <!-- <button @click="open = true">
          <img src="~/assets/images/help-icon.png" alt="Help" width="100" height="100">
        </button> -->
      </div>
    </div>

   
    <div class="center-box">
      <div class="scroll-content">
      
        <div class="w-full p-1 px-4 mt-1 flex justify-between  bg-white">
          <p class="font-bold text-black text-md">{{ clientname.charAt(0).toUpperCase() + clientname.slice(1) }}</p>
          <p class="font-bold text-gray-500 text-sm">UCC: {{ clientcode.charAt(0).toUpperCase() + clientcode.slice(1) }}</p>
        </div>

        <div class="bg-white w-full p-2 mt-2">

          <div class="w-full flex justify-center items-center bg-white">
            <div v-if="locationEnabled"
              class="w-full flex items-center  justify-center py-1 rounded-lg bg-yellow-100">
              <p class="text-md text-gray-500">Your GPS Location {{ latitude.toFixed(4) }} - {{ longitude.toFixed(4) }}</p>
            
            </div>

     

            <div v-if="locationLoading"
              class="w-full flex items-center flex-col justify-center py-1 rounded-lg bg-yellow-100">
              <p class="text-lg text-gray-500 mb-2">Accessing GPS Location</p>
              <LOADING />
            </div>
          </div>

          <div v-if="showLocationAlert && !isIOS"
            class="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-lg">
            <div class="flex items-start">
              <i class="pi pi-exclamation-triangle text-xl mr-3 mt-0.5"></i>
              <div>
                <p class="font-bold">Location Access Required</p>
                <p class="mt-1">We need your location to verify your identity. Please enable location services in your
                  {{
                    device }} settings.</p>
                <div class="flex gap-2 mt-3">
                  <button @click="requestLocation"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                    <i class="pi pi-refresh mr-1"></i> Enable Location
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="isIOS && (!latitude || !longitude)" class="w-full bg-yellow-100 border-l-4 mt-2 p-4 border-yellow-500 rounded-lg text-yellow-700">
              <p class="font-bold">Location Access Required</p>
            <p class="mt-1  ">
              Safari requires manual permission. After tapping, allow location when asked.
              If not prompted, go to:
              <br />
              Settings → Safari → Location → “Allow”
            </p>
              <button @click="tryagain()"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mt-1 rounded-lg text-sm">
                    <i class="pi pi-refresh mr-1"></i> Try Again
                  </button>
          
          </div>

          

          <div v-if="locationEnabled" class="w-full mt-1 flex justify-center flex-col">
            <p class="text-center text-black font-medium text-lg">TAKE A SELFIE</p>
            <div class="w-ful">
              <p class="text-sm text-gray-500 text-center leading-4">Ensure your nose is positioned at the center of the
                cross</p>
            </div>
            <CMAIDENTIFY class="mt-1" ref="cameraComponent" @captured="onImageCaptured" @error="onCameraError"
              @retake="handleRetake" />
          </div>

          <div v-if="ipverror" class="w-100 p-1 bg-red-100 mt-2 px-2 rounded-lg">
            <p class="text-sm text-red-500 text-center leading-5">{{ ipvlimiterror }}</p>
          </div>

          <div v-if="loadingprogress" class="max-w-md mx-auto mt-3 px-2 bg-white  shadow-lg rounded-lg">
            

            <div class="w-full bg-gray-400 bottom-2  rounded-full h-6 overflow-hidden relative" >
              <div
                class="bg-blue-600 h-6  text-white text-sm font-medium text-center flex items-center justify-center transition-all duration-300 ease-in-out"
                :style="{ width: progress + '%' }">
                {{syncStatus.message }}
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
    </div>
    <div class="bottom-box bg-white px-2" :style="{ height: bottomBoxHeight + 'px' }">
       <button type="button" class="w-full rounded-lg text-white px-2 py-3" :class="{
        'bg-blue-500 hover:bg-blue-600': imageCaptured,
        'bg-gray-400 cursor-not-allowed': !imageCaptured
      }" :disabled="!imageCaptured" @click="handleNext">
        {{ buttonText }}
      </button>
    </div>
  </div>
     </div>
   </div>



</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';

import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

import { useRouter, useRoute } from 'vue-router';
import CMAIDENTIFY from '~/components/cmaidentify.vue';
import LOADING from '~/components/googleloading.vue';
import HELPCARSOULE from '~/components/helpcarsoule.vue';

const cameraComponent = ref(null);


const buttonText = ref("SAVE & PROCEED");

const open = ref(false)

const ipverror = ref(false)
const ipvlimiterror = ref('')

const locationEnabled = ref(false);
const locationLoading = ref(true);
const showLocationAlert = ref(false);
const latitude = ref(null);
const longitude = ref(null);

const locationInterval = ref(null);

const imageCaptured = ref(null);
const cameraError = ref(null);

const loadingprogress = ref(false)




const device = ref('Desktop')
const clientname=ref('')
const clientcode=ref('')

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
      clientname.value = queryName;
      clientcode.value = queryCode;

      localStorage.setItem('clientname', queryName);
      localStorage.setItem('clientcode', queryCode);

      // Clean URL (remove query parameters)
      if (window.history.replaceState) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    } else {
      // Load from localStorage fallback
      clientname.value = localStorage.getItem('clientname') || '';
      clientcode.value = localStorage.getItem('clientcode') || '';
    }
  }


  updateHeight();
  window.addEventListener('resize', updateHeight);

  locationLoading.value = true;
  setupResizeListener();
  checkLocationPermission();
  
locationInterval.value = setInterval(() => {
  if (!locationEnabled.value) {
    getLocationWithTimeout(true);
  }
}, 5000);

if (!isIOS.value) {
  setTimeout(() => {
    if (!locationEnabled.value) {
      requestLocation();
    }
  }, 8000);
}



});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateHeight);
  }
  if (locationInterval.value) {
    clearInterval(locationInterval.value);
    locationInterval.value = null;
  }
});

const isIOS = computed(() => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
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
  locationLoading.value = true;
  showLocationAlert.value = false;

  // This must be called on user gesture for iOS
  navigator.geolocation.getCurrentPosition(
    (position) => {
      handleLocationSuccess(position);
    },
    (err) => {
      handleLocationError(err);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
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
  }  else {
    return {
      title: 'Syncing!',
      message: 'Completing'
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



const router = useRouter()




const ipvfunction = async () => {
  ipverror.value = false
  if (!imageCaptured.value) {
    ipverror.value = true
    ipvlimiterror.value = "Ipv image invalid"
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

    if (data.is_real == true) {
      
      localStorage.setItem('ipv', data.req_id)
      completeProgress();
      
      router.push(`/thankyoupage`);
      // localStorage.removeItem('clientname');
      // localStorage.removeItem('clientcode');
    }
  } catch (error) {

    console.error('IPv Upload Failed:', error.message);
  }
};

const tryagain = () => {
  window.location.reload();
};

const handleNext = () => {
  if (localStorage.getItem('clientname') && localStorage.getItem('clientcode')) {
    ipvfunction()
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



.bottom-box {
  
  display: flex;
  align-items: center;
  justify-content: center;
  /* border-top: 1px solid #ccc; */
  flex-shrink: 0;
}
</style>