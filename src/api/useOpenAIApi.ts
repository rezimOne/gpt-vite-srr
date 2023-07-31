
import axios  from 'axios'
import { reactive, watch } from 'vue';
import type { UseOpenApiState } from './types';
import jsonData from '../mocks/prompts.json';
import { useChatSession } from '../composables/useChatSession';

const state = reactive<UseOpenApiState>({
  completionData: null,
  history: [],
  role: undefined,
});

// watch(
//   () => state.history,
//   (data): void => console.log('state.history: ', data), {deep: true}
// );

export default function useOpenAiApi () {

  const set = <T extends keyof UseOpenApiState>(
    parameter: T,
    value: UseOpenApiState[T]
  ): void => {
    state[parameter] = value;
  };
  const get = <T extends keyof UseOpenApiState>(parametr: T) =>
    state[parametr];

  const setChatContext = () => {
    if(!state.history || state.history.length === 0) {
      return jsonData.prompts.vueDeveloper;
  } else
    return state.history.map((item) => item.message);
  }

  const getCompletion = async (text: string, isUserAuthorized: boolean): Promise<any> => {
    try {
      const response = await axios({
        method: 'POST',
        url: 'http://localhost:3000/completion',
        headers: {
        ' Content-Type': 'application/json'
        },
        params: {
          isUserAuthorized: isUserAuthorized,
          text: text,
          chatContext: setChatContext()
        }
      });

      if (response && response.status === 200) {

        console.log(`%c 🤖 ${ response.data.completion.message.content }`, 'color: #F4B10A');
        state.completionData = response.data.completion;

        state.history.push({
          user: {
            sessionId: useChatSession().get('sessionId'),
            id: 'user_id',
            created: Date.now(),
            message: {
              content: text,
              role: 'user'
            }
          },
          chat: {
            sessionId: useChatSession().get('sessionId'),
            ...response.data.completion,
            created: Date.now(),
          }
        });
      }
    } catch(e) {
      console.log(e);
    }
  };

  const getChatCompletion = async (text: string, isUserAuthorized: boolean): Promise<any> => {
    try {
      state.history.push({
        sessionId: useChatSession().get('sessionId'),
        id: 'user_id',
        created: Date.now(),
        message: {
          content: text,
          role: 'user'
        }
      });
      console.log(`%c 👤 ${ text }`, 'color: #6D8ED4');
      const response = await axios({
        method: 'POST',
        url: 'http://localhost:3000/chat-completion',
        headers: {
        ' Content-Type': 'application/json'
        },
        params: {
          isUserAuthorized: isUserAuthorized,
          text: text,
          chatContext: setChatContext()
        }
      });
      if (response && response.status === 200) {

        console.log(`%c 🤖 ${ response.data.completion.message.content }`, 'color: #F4B10A');
        state.completionData = response.data.completion;

        state.history.push(
          {
            sessionId: useChatSession().get('sessionId'),
            ...response.data.completion,
            created: Date.now(),
          }
        );
      }
    } catch(e) {
      console.log(e);
    }
  };

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
        useChatSession().set('sessionStatus', response.data);
        return response;
      }
    } catch (err){
      console.log(err);
    }
  }

  return {
    set,
    get,
    getCompletion,
    getChatCompletion,
    setChatContext,
    getSessionStatus
  }
}