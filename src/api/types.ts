export interface UseOpenApiState {
  completionData: null | CompletionData;
  history: any[]
  role: undefined,
  lastSessionId: string
}

export interface CompletionData {
  id: string,
  created: number,
  message: {
    role: string,
    content: string
  }
}

export interface HistoryRecord {
    user: CompletionData;
    chatbot: CompletionData;
}