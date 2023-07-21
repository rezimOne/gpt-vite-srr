<template>
  <div class="retro-prompt">
    <textarea v-model="text" class="retro-textarea" rows="5" cols="40"></textarea>
    <div class="button-container">
      <button class="retro-button" @click="onSubmit">Submit</button>
      <button class="retro-button" @click="onClear">Clear</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import useOpenAIApi from '../api/useOpenAIApi'
const { get, getCompletion, getChatCompletion, createChatSession } = useOpenAIApi();

const text = ref<string>('');
const onSubmit = async () => {
  if (!get('lastSessionId')) createChatSession('10000')
  await handleChatCompletion();

};
const onClear = () => {
  text.value = '';
}
const isUserAuthorized = ref<boolean>(true);

const handleCompletion = async (): Promise<void> => {
  if (text.value.length > 0) {
    getCompletion(text.value, isUserAuthorized.value);
  }
};

const handleChatCompletion = async (): Promise<void> => {
  if (text.value.length > 0) {
    getChatCompletion(text.value, isUserAuthorized.value);
  }
};

</script>

<style>
.retro-prompt {
  font-family: 'Courier New', monospace;
  background-color: #333;
  color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.retro-textarea {
  width: 100%;
  height: 150px;
  resize: none;
  background-color: #394641;
  border: 1px solid #666;
  color: #fff;
  padding: 10px;
  font-size: 14px;
  border-radius: 5px;
}

.retro-button {
  background-color: #777;
  color: #fff;
  border: none;
  padding: 8px 15px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
}

.retro-button:hover {
  background-color: #555;
}
</style>