
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTechRecommendation = async (userGoal: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User wants to achieve: "${userGoal}". Suggest a software category and server hosting requirements for this project. Format as helpful advice.`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Our AI assistant is temporarily offline, but we recommend our Pro Hosting tier for most scalable applications.";
  }
};

export const getEntertainmentInsight = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a short, poetic summary or trivia about: "${topic}". Whether it's a genre of music or books, make it engaging for a media marketplace.`,
      config: {
        temperature: 0.9,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Art is the soul's language. Explore our curated collections below.";
  }
};
