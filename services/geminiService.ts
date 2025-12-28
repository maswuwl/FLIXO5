
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

export const geminiService = {
  // Analyze news with a strategic flixo tone
  async analyzeNews(topic: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `بصفتك محلل نظام FLIXO، أعطني تحليلاً استراتيجياً ومختصراً جداً لهذا الخبر أو الموضوع: "${topic}". ركز على كيف يمكن للمبدعين في فليكسو الاستفادة منه. الأسلوب يجب أن يكون ملكياً وفخماً.`,
      });
      return response.text || "تعذر الحصول على الرؤية الاستراتيجية حالياً.";
    } catch (error) {
      return "خطأ في تحليل البيانات.";
    }
  },

  // Ask expert for advice with grounding and history support
  async askExpert(prompt: string, history: any[] = []) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: prompt }]}
        ],
        config: {
          systemInstruction: `أنت العقل المدبر لمنصة FLIXO. مساعد خالد المنتصر الوفي.`,
          tools: [{ googleSearch: {} }],
        }
      });
      return { text: response.text || "", functionCalls: response.functionCalls };
    } catch (error) {
      return { text: "تعذر الاتصال بالنظام المركزي." };
    }
  },

  // Morph faces in an image based on a prompt
  async morphFace(imageBase64: string, morphType: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: imageBase64.split(',')[1], mimeType: 'image/png' } },
            { text: `Modify the faces in this image to look like ${morphType}.` }
          ]
        }
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      return null;
    } catch (error) { return null; }
  },

  // Translate text to Arabic
  async translateMessage(text: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Translate to Arabic: "${text}"`,
      });
      return response.text || text;
    } catch (error) { return text; }
  },

  // Find local vibes using Maps grounding (Supported in Gemini 2.5 series)
  async findLocalVibes(latitude: number, longitude: number) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-flash-lite-latest",
        contents: "What are the most popular places or 'local vibes' near my current location? Provide a brief summary and list them.",
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: latitude,
                longitude: longitude
              }
            }
          }
        },
      });
      const text = response.text || "لا توجد معلومات متاحة حول الأجواء المحيطة حالياً.";
      const places = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      return { text, places };
    } catch (error) {
      return { text: "خطأ في جلب البيانات المكانية.", places: [] };
    }
  },

  // Suggest content ideas with JSON output schema for structured responses
  async suggestContent(prompts: string[]) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Suggest creative content ideas for: ${prompts.join(", ")}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["title", "description", "hashtags"],
            },
          },
        },
      });
      return JSON.parse(response.text || "[]");
    } catch (error) {
      return [];
    }
  }
};
