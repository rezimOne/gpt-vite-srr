<template>
  <h1>Component factory</h1>
  <div>
    <input type="text" name="prompt" v-model="inputValue">
    <button type="button" @click="handleGetResponse">Click</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import useOpenAIApi from '../api/useOpenAIApi'

const { getResponse } = useOpenAIApi();

const inputValue = ref<string>('');
const isUserAuthorized = ref<boolean>(true);

const handleGetResponse = async (): Promise<void> => {
  if (inputValue.value.length > 0) {
    getResponse(inputValue.value, isUserAuthorized.value)
  }
}
</script>

<style>
code {
  font-family: monospace;
  background-color: #eaeaea;
  padding: 3px 5px;
  border-radius: 4px;
}
</style>