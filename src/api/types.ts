export interface UseOpenApiState {
  completionData: null | CompletionData;
  role: undefined,
  history: any[]
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