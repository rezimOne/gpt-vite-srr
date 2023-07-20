
import axios  from 'axios'
import { reactive, watch } from 'vue';
import type { UseOpenApiState } from './types';

const state = reactive<UseOpenApiState>({
  isActive: false,
  response: null
});

watch(
  (): string | null => state.response,
  (resposne) => {
    console.log('state.response: ', resposne);
  }
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

  const getCompletion = async (input: string, isUserAuthorized: boolean): Promise<any> => {
    await axios({
      method: 'POST',
      url: 'http://localhost:3000/component-factory/completion',
      headers: {
      ' Content-Type': 'application/json'
      },
      params: {
        isUserAuthorized: isUserAuthorized,
        inputValue: input
      }
    }).then(res => {
      state.response = res.data.message;
    }).catch(err => console.log(err));
  };

  const getChatCompletion = async (input: string, isUserAuthorized: boolean): Promise<any> => {
    await axios({
      method: 'POST',
      url: 'http://localhost:3000/component-factory/chat-completion',
      headers: {
      ' Content-Type': 'application/json'
      },
      params: {
        isUserAuthorized: isUserAuthorized,
        inputValue: input
      }
    }).then(res => {
      state.response = res.data.message;
    }).catch(err => console.log(err));
  };

  return {
    set,
    get,
    getCompletion,
    getChatCompletion
  }
}