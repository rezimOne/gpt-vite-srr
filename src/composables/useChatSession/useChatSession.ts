import { reactive, watch } from 'vue';
import type { ChatSession } from './useChatSession.model';
import axios from 'axios'

const state = reactive<ChatSession>({
  sessionStatus: undefined,
  sessionId: null,
  chatHistory: null
});

watch(
  () => state.chatHistory,
  (data): void => console.log('state.chatHistory: ', data));

export default function useChatSession() {
  const set = <T extends keyof ChatSession>(
    parameter: T,
    value: ChatSession[T]
  ): void => {
    state[parameter] = value;
  };
  const get = <T extends keyof ChatSession>(parametr: T) =>
    state[parametr];

  const setChatSessionId = (payload: string) => {
    state.sessionId = payload;
  }

  const getSessionStatus = async (payload: boolean) => {
    try{
      const response = await axios({
        method: 'GET',
        url: 'http://localhost:3000/chat/sessionStatus',
        params: {
          sessionStatus: payload
        }
      });
      if (response.status === 200) {
        state.sessionStatus = response.data;
        return response;
      }
    } catch (err){
      console.log(err);
    }
  }

  const saveUserPromptToChatHistory = (text: any) => {
    const user = {
      sessionId: state.sessionId,
      id: 'user_id',
      created: Date.now(),
      message: {
        content: text,
        role: 'user'
      },
    }
    state.chatHistory?.push(user)
  }
  const saveChatAnswerToChatHistory = (response: any) => {
    const chat = {
      sessionId: state.sessionId,
      ...response.data.completion,
      created: Date.now(),
    }
    state.chatHistory?.push(chat)
  }

  return {
    set,
    get,
    setChatSessionId,
    getSessionStatus,
    saveUserPromptToChatHistory,
    saveChatAnswerToChatHistory
  }
}