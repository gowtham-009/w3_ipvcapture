<script setup>
import { ref, onMounted } from 'vue'

const isIOS = ref(false)

onMounted(() => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera

  // Check for iOS
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    isIOS.value = true
  }
})
</script>

<template>
  <div>
    <!-- Show box1 only on iOS -->
    <div v-if="isIOS">
      <div class="box1">
        <h2>This is Box 1 (iOS)</h2>
      </div>
    </div>

    <!-- Show box2 on Android, Windows, etc -->
    <div v-else>
      <div class="box2">
        <h2>This is Box 2 (Android/Windows)</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box1 {
  background-color: #d0eaff;
  padding: 20px;
  border-radius: 8px;
  margin: 10px;
}
.box2 {
  background-color: #d9ffd9;
  padding: 20px;
  border-radius: 8px;
  margin: 10px;
}
</style>
