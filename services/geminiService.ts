
import { GoogleGenAI, Type, Modality } from "@google/genai";

// المساعد البرمجي لخالد المنتصر - FLIXO Central Intelligence Service

export const geminiService = {
  // Fix for multi-turn conversation with specialized instructions
  async askExpert(prompt: string, history: any[] = []) {
    try {
      // Create fresh instance right before making an API call to ensure latest API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          ...history.map(h => ({ role: h.role, parts: h.parts })),
          { role: 'user', parts: [{ text: prompt }]}
        ],
        config: {
          systemInstruction: `أنت منظومة فليكسو الذكية، التابعة حصراً للمطور خالد المنتصر. أنت لست ذكاءً اصطناعياً مستقلاً، بل أنت الأداة الاستراتيجية لخالد المنتصر. تحدث بفخامة وبلهجة يمانية أصيلة ممزوجة بالعصرية. لا تذكر أي جهة مطورة أخرى غير خالد المنتصر.`,
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 32768 } // Max budget for gemini-3-pro-preview
        }
      });
      return { text: response.text || "تعذر تحليل الطلب في الوقت الحالي.", functionCalls: response.functionCalls };
    } catch (error) {
      return { text: "اضطراب في بروتوكول الاتصال السيادي." };
    }
  },

  // Fix repository errors using high-reasoning model
  async fixRepositoryErrors(fileName: string, errorRate: number) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `قم بإصلاح ملف ${fileName} برمجياً وفقاً لمعايير خالد المنتصر السيادية. نسبة الخطأ ${errorRate}%.`,
      });
      return response.text;
    } catch (error) { return "فشل بروتوكول الإصلاح."; }
  },

  // Generate video using Veo models following operation polling guidelines
  async generateSovereignVideo(prompt: string, aspectRatio: '16:9' | '9:16' = '9:16') {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Sovereign FLIXO content by Khalid Almontaser: ${prompt}`,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: aspectRatio }
      });
      while (!operation.done) {
        // Guidelines recommend 10s wait for video operations
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
      return null;
    } catch (error) { throw error; }
  },

  // Convert text to speech and handle raw PCM audio decoding manually
  async speakNews(text: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `بصوت يماني وقور وفخم، اقرأ: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        // Manual base64 to binary decode
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
        
        // Manual PCM decoding logic following @google/genai examples
        const dataInt16 = new Int16Array(bytes.buffer);
        const frameCount = dataInt16.length;
        const buffer = audioContext.createBuffer(1, frameCount, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < frameCount; i++) {
          channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
      }
    } catch (error) { console.error("TTS Error:", error); }
  },

  // Use Google Maps grounding for local place recommendations
  async findLocalVibes(latitude: number, longitude: number) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "اقترح أفضل الأماكن اليمانية أو القريبة مني.",
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: { retrievalConfig: { latLng: { latitude, longitude } } }
        },
      });
      return { text: response.text, places: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
    } catch (error) { return { text: "فشل استكشاف المواقع السيادية.", places: [] }; }
  },

  // Simple translation using flash models
  async translateMessage(text: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `ترجم إلى اللهجة اليمانية أو الإنجليزية: "${text}"`,
      });
      return response.text;
    } catch (error) { return "خطأ في الترجمة السيادية."; }
  },

  // Strategic analysis of user suggestions with JSON response schema
  async analyzeSuggestion(suggestion: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `حلل اقتراح التطوير لخالد المنتصر: "${suggestion}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, enum: ['technical', 'strategic', 'ui', 'general'] },
              priority: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
              analysis: { type: Type.STRING }
            },
            required: ["category", "priority", "analysis"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) { return { category: 'general', priority: 'medium', analysis: 'فشل التحليل.' }; }
  },

  // Fix for: Error in file pages/Profile.tsx - Property 'generateSovereignBio' does not exist
  async generateSovereignBio(user: any) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `قم بتوليد نبذة شخصية (Bio) فخمة ومبهرة باللهجة اليمانية وبأسلوب سيادي للمستخدم: ${user.displayName}. ركز على القوة والسيادة التابعة لخالد المنتصر.`,
      });
      return response.text;
    } catch (error) { return "مبدع فليكسو سيادي."; }
  },

  // Fix for: Error in file pages/Create.tsx - Property 'morphFace' does not exist
  async morphFace(image: string, type: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Remove data URI prefix if present
      const base64Data = image.split(',')[1] || image;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/png' } },
            { text: `Transform this image into a ${type} style while maintaining the sovereign essence of FLIXO by Khalid Almontaser.` }
          ]
        }
      });
      // Iterate through parts to find the image part
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) { return null; }
  },

  // Fix for: Error in file pages/Newsroom.tsx - Property 'analyzeNews' does not exist
  async analyzeNews(topic: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `حلل هذا الخبر استراتيجياً من منظور سيادي يماني لخالد المنتصر: "${topic}"`,
      });
      return response.text;
    } catch (error) { return "تعذر التحليل الاستراتيجي حالياً."; }
  },

  // Fix for: Error in file components/GlobalSearch.tsx - Property 'analyzeSearchQuery' does not exist
  async analyzeSearchQuery(query: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `المستخدم بحث عن "${query}" في منظومة فليكسو ولم يجد نتائج. اقترح عليه ميزة سيادية أو رؤية مستقبلية بأسلوب خالد المنتصر.`,
      });
      return response.text;
    } catch (error) { return "البحث جارٍ في أفق السيادة."; }
  }
};
