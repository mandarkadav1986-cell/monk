
import { GoogleGenAI, Type } from "@google/genai";
import { CaptureItem } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeText = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Summarize the following text in one or two sentences:\n\n${text}`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error summarizing text:", error);
    return "Could not summarize text.";
  }
};

export const suggestTags = async (item: CaptureItem): Promise<string[]> => {
  try {
    const prompt = `Based on the following item, suggest up to 3 relevant tags.
Title: ${item.title}
Content: ${item.body}
Existing Tags: ${item.tags.join(', ')}

Return a JSON array of strings. For example: ["project-x", "urgent", "marketing"]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
      },
    });
    const parsedResponse = JSON.parse(response.text);
    return Array.isArray(parsedResponse) ? parsedResponse : [];
  } catch (error) {
    console.error("Error suggesting tags:", error);
    return [];
  }
};

export const estimateEffort = async (item: CaptureItem): Promise<string> => {
    try {
        const prompt = `Estimate the effort required for the following task. Provide a common time-based estimate like "15 minutes", "1 hour", "4 hours", or "1 day".
Title: ${item.title}
Content: ${item.body}`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        
        return response.text.trim();
    } catch (error) {
        console.error("Error estimating effort:", error);
        return "Could not estimate effort.";
    }
};
