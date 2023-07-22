import { Configuration } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

export const COMPLETION_SETTINGS = {
  temperature: 0.888,
  max_tokens: 2048,
  frequency_penalty: 0,
  presence_penalty: 0,
  top_p: 1
}
export const PORT = process.env.PORT;
export const MODEL = process.env.MODEL;
export const CHATMODEL = process.env.CHAT_MODEL;
export const ISPRODUCTION = process.env.NODE_ENV === 'production'
export const CONFIGURATION = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const completionModel = (data: any) => {
  return {
    id: data.data.id,
    created: data.created,
    message: data.data.choices[0].message
  }
}