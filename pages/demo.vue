<script setup>
import { ref, onMounted } from 'vue'

const isIOS = ref(false)
const isAndroid = ref(false)

onMounted(() => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera

  // Detect iOS
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    isIOS.value = true
  }

  // Detect Android
  if (/android/i.test(userAgent)) {
    isAndroid.value = true
  }
})
</script>

<template>
  <div>
    <!-- iOS device -->
    <div v-if="isIOS">
      <div class="box1">
        <h2>This is Box 1 (iOS)</h2>
      </div>
    </div>

    <!-- Android device -->
    <div v-else-if="isAndroid">
      <div class="box2">
        <h2>This is Box 2 (Android)</h2>
      </div>
    </div>

    <!-- Other devices -->
    <div v-else>
      <div class="box-other">
        <h2>This is another device (not iOS/Android)</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box1 {
  background-color: lightblue;
  padding: 20px;
  margin: 10px;
}
.box2 {
  background-color: lightgreen;
  padding: 20px;
  margin: 10px;
}
.box-other {
  background-color: lightgray;
  padding: 20px;
  margin: 10px;
}
</style>
