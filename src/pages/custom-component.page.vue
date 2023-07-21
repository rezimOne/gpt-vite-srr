<template>
  <button class="toggle-btn" @click="toggle">
    <span :class="['toggle-icon', { 'toggle-on': isActive }]"></span>
  </button>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const isActive = ref(false);

const toggle = () => {
  isActive.value = !isActive.value;
};

// Watch isActive and apply animations
watch(isActive, (value) => {
  if (value) {
    document.body.style.backgroundColor = 'green';
  } else {
    document.body.style.backgroundColor = 'red';
  }
});
</script>

<style scoped>
.toggle-btn {
  position: relative;
  width: 50px;
  height: 30px;
  background-color: #ddd;
  border-radius: 15px;
  border: none;
  padding: 2px;
  cursor: pointer;
}

.toggle-icon {
  display: block;
  position: absolute;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: #fff;
  top: 2px;
  left: 2px;
  transition: transform 0.3s ease-in-out;
}

.toggle-on {
  transform: translateX(20px);
}
</style>