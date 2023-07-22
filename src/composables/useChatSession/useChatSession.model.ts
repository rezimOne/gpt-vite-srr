import type { CompletionData } from '../../api/types';

export interface ChatSession {
  sessionStatus: undefined | boolean;
  sessionId: null | string;
  chatHistory: null | CompletionData[]
}

export interface ChatModel {

}