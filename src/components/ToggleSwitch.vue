<template>
  <button class="toggle-btn" @click="toggle">
    <span :class="['toggle-icon', { 'toggle-on': isActive }]"></span>
  </button>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Emits {
  (event: 'toggle-switch', value: boolean): void;
}
const emit = defineEmits<Emits>();

const isActive = ref<boolean>(false);

const toggle = (): void => {
  isActive.value = !isActive.value;
};
// Watch isActive and apply animations
watch(isActive, (isActive: boolean): void => {
  emit('toggle-switch', isActive)
});
</script>

<style scoped>
.toggle-btn {
  position: relative;
  width: 50px;
  height: 30px;
  background-color: #6c7ba1;
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