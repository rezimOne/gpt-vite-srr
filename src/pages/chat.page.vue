<template>
  <div class="retro-prompt">
    <textarea v-model="text" class="retro-textarea" rows="5" cols="40"></textarea>
    <div class="button-container">
      <button class="retro-button" @click="onSubmit">
        <img class="logo" src="../renderer/openai.svg" height="24" width="24" alt="logo" />
        <p>askGPT</p>
      </button>
      <button class="retro-button" @click="onClear">Clear</button>
      <ToggleSwitch @toggle-switch="handleToggleSwitch"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import useOpenAIApi from '../api/useOpenAIApi'
import { useChatSession } from '../../src/composables/useChatSession';
import ToggleSwitch from '../components/ToggleSwitch.vue'
const { getCompletion, getChatCompletion } = useOpenAIApi();

const text = ref<string>('');

const handleToggleSwitch = async (toggleStatus: boolean): Promise<void> => {
useChatSession().set('sessionId','10000');
 const sessionStatus = await useOpenAIApi().getSessionStatus(toggleStatus);
 sessionStatus?.data?.isSessionOpen === 'true'
  ? console.log('__SESSION_OPEN__')
  : console.log('__SESSION_CLOSED__')
}

const onSubmit = async () => {
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

onMounted(()=> useChatSession().set('sessionStatus', true))
</script>

<style>
.retro-prompt {
  font-family: 'Courier New', monospace;
  background-color: #333;
  color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  height: 600px;
  min-width: 250px;
  position: relative;
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
  height: 40px;
  display: flex;
  align-items: center;
  background-color: #777;
  color: #394641;
  font-weight: 600;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
  width: 90px;
  justify-content: center;
}

.retro-button:hover {
  background-color: #6d8ed4;
}

.button-container {
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}
.logo {
  margin-right: 4px;
}
</style>