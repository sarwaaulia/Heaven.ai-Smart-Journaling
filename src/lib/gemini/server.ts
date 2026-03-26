'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'; 

const apiAIKey = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export const geminiModel = apiAIKey.getGenerativeModel({
  model: 'gemini-1.5-flash',
});
