
import { Type, Modality, GoogleGenAI, FunctionDeclaration } from "@google/genai";

const sovereignTools: FunctionDeclaration[] = [
  {
    name: 'createSovereignProject',
    description: 'يبدأ بتأسيس مشروع برمجي كامل داخل بيئة فليكسو.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        projectName: { type: Type.STRING },
        techStack: { type: Type.STRING, description: 'التقنيات المستخدمة (مثل React, Tailwind, FastAPI).' },
        architecture: { type: Type.STRING, description: 'وصف لهيكل المشروع.' }
      },
      required: ['projectName', 'techStack']
    }
  },
  {
    name: 'writeProjectFile',
    description: 'يكتب كوداً برمجياً داخل ملف محدد في المشروع الجاري بناؤه.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        filename: { type: Type.STRING },
        content: { type: Type.STRING },
        language: { type: Type.STRING }
      },
      required: ['filename', 'content']
    }
  },
  {
    name: 'generateProjectAsset',
    description: 'يولد أصولاً بصرية (صور، شعارات، واجهات) للمشروع باستخدام الذكاء الاصطناعي.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        prompt: { type: Type.STRING, description: 'وصف تفصيلي للصورة المطلوبة.' },
        assetType: { type: Type.STRING, description: 'نوع الأصل (Logo, UI, Icon).' }
      },
      required: ['prompt']
    }
  }
];

export const geminiService = {
  // توليد تحليل بورصة فليكسو المعتمد على جوجل
  async generateStockInsight(shares: number) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `بصفتك مستشارك المالي السيادي، حلل وضع محفظتي التي تحتوي على ${shares} سهم في فليكسو بناءً على اتجاهات التكنولوجيا الحالية.`,
      config: { tools: [{googleSearch: {}}] },
    });
    return response.text;
  },

  async findLocalVibes(latitude: number, longitude: number) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: "ما هي أكثر الأماكن شهرة وحيوية القريبة من هذا الموقع حالياً؟ قدم وصفاً للأجواء.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: { latLng: { latitude, longitude } }
        }
      },
    });
    return {
      text: response.text,
      places: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  },

  async translateMessage(text: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate the following message to Arabic, maintaining the tone and emotion: "${text}"`,
    });
    return response.text || "";
  },

  async analyzeNews(topic: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `حلل هذا الخبر من منظور استراتيجي لخدمة منصة فليكسو: "${topic}"`,
    });
    return response.text || "";
  },

  async analyzeSuggestion(suggestion: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `حلل هذا الاقتراح لتطوير منصة فليكسو: "${suggestion}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            priority: { type: Type.STRING },
            analysis: { type: Type.STRING }
          },
          required: ["category", "priority", "analysis"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async askExpert(prompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: `أنت الخبير التنفيذي لـ FLIXO. المالك: خالد المنتصر.`,
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return { text: response.text || "" };
  },

  async generateSovereignImage(prompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `Premium sovereign digital asset for FLIXO: ${prompt}` }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });
      const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      return imagePart ? `data:image/png;base64,${imagePart.inlineData.data}` : null;
    } catch (err) {
      console.error("Image Generation Failed:", err);
      return null;
    }
  },

  async *expertMindStream(prompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `أنت "خبير المعرفة" لـ FLIXO. المالك: خالد المنتصر.`,
        tools: [{ functionDeclarations: sovereignTools }],
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    const result = await chat.sendMessageStream({ message: prompt });
    for await (const chunk of result) {
      const parts = chunk.candidates?.[0]?.content?.parts || [];
      const funcCall = parts.find(p => p.functionCall)?.functionCall;
      if (funcCall) yield { type: 'action', name: funcCall.name, args: funcCall.args };
      if (chunk.text) yield { type: 'text', content: chunk.text };
    }
  },

  async analyzeSearchQuery(query: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
       model: "gemini-3-flash-preview",
       contents: `البحث في الويب عن: "${query}".`,
       config: { tools: [{googleSearch: {}}] },
    });
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  },

  async *askExpertStream(prompt: string, history: any[] = []) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `أنت الخبير التنفيذي لـ FLIXO. المالك: خالد المنتصر.`,
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    const result = await chat.sendMessageStream({ message: prompt });
    for await (const chunk of result) {
      if (chunk.text) yield chunk.text;
    }
  },

  async speakNews(text: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
      const dataInt16 = new Int16Array(bytes.buffer);
      const buffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start();
    }
  }
};
