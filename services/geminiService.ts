
import { GoogleGenAI, Type } from "@google/genai";

// Ensure API_KEY is available and handle gracefully
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing. AI features will be limited.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const geminiService = {
  // Analyze news with a strategic flixo tone
  async analyzeNews(topic: string) {
    try {
      const ai = getAIClient();
      if (!ai) return "نظام الذكاء غير مفعل حالياً.";
      
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
      const ai = getAIClient();
      if (!ai) return { text: "الخدمة غير متوفرة بدون مفتاح API." };

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: prompt }]}
        ],
        config: {
          systemInstruction: `أنت العقل المدبر لمنصة FLIXO. مساعد خالد المنتصر الوفي. أنت خبير برمجيات Full-stack وتجيد بناء المشاريع من الصفر.`,
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
      const ai = getAIClient();
      if (!ai) return null;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: imageBase64.split(',')[1], mimeType: 'image/png' } },
            { text: `Modify the faces in this image to look like ${morphType}. Return only the image.` }
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
      const ai = getAIClient();
      if (!ai) return text;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Translate the following to fluent Arabic while maintaining the luxury tone: "${text}"`,
      });
      return response.text || text;
    } catch (error) { return text; }
  },

  // Find local vibes using Maps grounding
  async findLocalVibes(latitude: number, longitude: number) {
    try {
      const ai = getAIClient();
      if (!ai) return { text: "الخدمة المكانية معطلة.", places: [] };

      const response = await ai.models.generateContent({
        model: "gemini-flash-lite-latest",
        contents: "ما هي أكثر الأماكن شهرة (Local Vibes) القريبة من موقعي الحالي؟ أعطني ملخصاً وتفاصيل.",
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

  // Suggest content ideas with JSON output schema
  async suggestContent(prompts: string[]) {
    try {
      const ai = getAIClient();
      if (!ai) return [];

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
