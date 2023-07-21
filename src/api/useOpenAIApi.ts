
import axios  from 'axios'
import { reactive, watch } from 'vue';
import type { CompletionData, UseOpenApiState } from './types';
import jsonData from '../mocks/prompts.json';

const state = reactive<UseOpenApiState>({
  completionData: null,
  history: [],
  role: undefined,
  lastSessionId: ''
});

watch(
  () => state.history,
  (data): void => console.log('state.history: ', data), {deep: true}
);

export default function useOpenAiApi () {
  const set = <T extends keyof UseOpenApiState>(
    parameter: T,
    value: UseOpenApiState[T]
  ): void => {
    state[parameter] = value;
  };
  const get = <T extends keyof UseOpenApiState>(parametr: T) =>
    state[parametr];

  const setChatRole = () => {
    return jsonData.prompts.vueDeveloper;
  }

  const getCompletion = async (text: string, isUserAuthorized: boolean): Promise<any> => {
    await axios({
      method: 'POST',
      url: 'http://localhost:3000/component-factory/completion',
      headers: {
      ' Content-Type': 'application/json'
      },
      params: {
        isUserAuthorized: isUserAuthorized,
        text: text,
        chatRole: setChatRole()
      }
    }).then(res => {
      state.completionData = res.data.completion
      state.history.push({
        user: {
          id: 'user_id',
          created: 200,
          message: {
            content: text,
            role: 'user'
          }
        },
        chat: {
          ...res.data.completion
        }
      })
    }).catch(err => console.log(err));
  };

  const getChatCompletion = async (text: string, isUserAuthorized: boolean): Promise<any> => {
    await axios({
      method: 'POST',
      url: 'http://localhost:3000/component-factory/chat-completion',
      headers: {
      ' Content-Type': 'application/json'
      },
      params: {
        isUserAuthorized: isUserAuthorized,
        text: text,
        chatRole: setChatRole()
      }
    }).then(res => {
      state.completionData = res.data.completion
      state.history.push({
        user: {
          sessionId: state.lastSessionId,
          id: 'user_id',
          created: Date.now(),
          message: {
            content: text,
            role: 'user'
          }
        },
        chat: {
          sessionId: state.lastSessionId,
          ...res.data.completion
        }
      })
    }).catch(err => console.log(err));
  };

  const createChatSession = (payload: string) => {
    state.lastSessionId = payload;
  }

  return {
    set,
    get,
    getCompletion,
    getChatCompletion,
    setChatRole,
    createChatSession
  }
}