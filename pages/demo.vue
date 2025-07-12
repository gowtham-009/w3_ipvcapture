<script setup>
import { ref, onMounted } from 'vue'

const isMobile = ref(false)

onMounted(() => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera

  // Check for Android or iOS
  if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
    isMobile.value = true
  }
})
</script>

<template>
  <div>
    <!-- Desktop view (Windows/Mac/Linux) -->
    <div v-if="!isMobile">
      <div class="box1">
        <h2>This is Box 1 (Desktop)</h2>
      </div>
    </div>

    <!-- Mobile view (Android/iOS) -->
    <div v-else>
      <div class="box2">
        <h2>This is Box 2 (Mobile)</h2>
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
</style>
