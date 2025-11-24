import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const searchEntity = async (name: string, address: string) => {
  try {
    const prompt = `Conduct a comprehensive investigation for the entity: "${name}" located at "${address}".
    
    1. **Entity Classification**: Analyze if the name likely belongs to an **Individual Person** or a **Business/Organization**. State this clearly.
    2. **Website Identification**: Find and clearly list their official website URL. If multiple domains exist, list the primary one.
    3. **Business Summary**: Describe their core business activities, industry sector, and key products or services.
    4. **Verification**: Confirm if the entity at this address matches the business description found online.

    Format the response clearly with Markdown. Make the website link bold or a clickable link if possible.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    // Check for grounding chunks to extract URLs programmatically if needed,
    // but for this UI we will just display the text which Gemini formats well with markdown.
    return {
      text: response.text,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
};