<template>
  <h1>Chat</h1>
  <div>
    <input type="text" name="prompt" v-model="inputValue" @keyup.enter="handleGetChatCompletion">
    <button type="button" @click="handleGetCompletion">Completion</button>
    <button type="button" @click="handleGetChatCompletion">Chat completion</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import useOpenAIApi from '../api/useOpenAIApi'

const { getCompletion, getChatCompletion } = useOpenAIApi();

const inputValue = ref<string>('');
const isUserAuthorized = ref<boolean>(true);
const clearInput = () => inputValue.value = '';

const handleGetCompletion = async (): Promise<void> => {
  if (inputValue.value.length > 0) {
    getCompletion(inputValue.value, isUserAuthorized.value);
    clearInput();
  }
}
const handleGetChatCompletion= async (): Promise<void> => {
  if (inputValue.value.length > 0) {
    getChatCompletion(inputValue.value, isUserAuthorized.value);
    clearInput();
  }
}
</script>

<style>
</style>