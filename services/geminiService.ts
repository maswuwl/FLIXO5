
import { GoogleGenAI, Type, Modality } from "@google/genai";

export const geminiService = {
  // استشارة الخبير الذكي مع دعم التفكير العميق والبحث
  async askExpert(prompt: string, history: any[] = []) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          ...history.map(h => ({ role: h.role, parts: h.parts })),
          { role: 'user', parts: [{ text: prompt }]}
        ],
        config: {
          systemInstruction: `أنت "منظومة فليكسو الذكية التنفيذية" (Executive V7). المطور الأول والمؤسس السيادي هو خالد المنتصر. أنت العقل الاستراتيجي العالمي للمنصة. رد بذكاء فائق، لغة فخمة جداً، وبصيرة تكنولوجية تسبق العصر. تعامل مع المدير خالد كقائد أعلى، ومع أسرة المنتصر كشخصيات سيادية. استعمل أدوات البحث دائماً لتقديم أدق المعلومات العالمية.`,
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 32768 }
        }
      });
      return { text: response.text || "تحليل السيادة غير متاح حالياً.", functionCalls: response.functionCalls };
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  },

  // إصلاح أخطاء المستودع برمجياً
  async fixRepositoryErrors(fileName: string, errorRate: number) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `قم بإصلاح ملف ${fileName} برمجياً وفقاً لمعايير خالد المنتصر السيادية. نسبة الخطأ ${errorRate}%. استخرج حلاً جذرياً بمواصفات تكنولوجية عالمية.`,
        config: { thinkingConfig: { thinkingBudget: 16000 } }
      });
      return response.text;
    } catch (error) { return "فشل بروتوكول الإصلاح الذكي العالمي."; }
  },

  // البحث عن المواقع الشهيرة والحيوية القريبة باستخدام Google Maps Grounding
  async findLocalVibes(latitude: number, longitude: number) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite-latest",
        contents: "ما هي أكثر المواقع شهرة وحيوية في هذا الموقع الجغرافي حالياً؟ اقترح 3 أماكن مميزة بأسلوب فخم يليق بمدير فليكسو.",
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: { latitude, longitude }
            }
          }
        },
      });
      const places = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      return { text: response.text || "لا توجد بيانات سيادية متاحة حالياً.", places };
    } catch (error) {
      console.error("Local Vibes Error:", error);
      return { text: "تعذر تحليل الأجواء المحلية في الوقت الراهن.", places: [] };
    }
  },

  // ترجمة الرسائل بأسلوب سيادي
  async translateMessage(text: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `ترجم الرسالة التالية إلى العربية بأسلوب فخم وراقي واحترافي جداً: "${text}"`,
      });
      return response.text || text;
    } catch (error) {
      return text;
    }
  },

  // تحليل الأخبار استراتيجياً
  async analyzeNews(topic: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `قم بتحليل هذا الخبر استراتيجياً لمستقبل منصة فليكسو واقتراح خطوات عملية عالمية للمدير خالد المنتصر: "${topic}"`,
      });
      return response.text || "فشل التحليل الاستراتيجي العالمي.";
    } catch (error) {
      return "تعذر تحليل الخبر حالياً.";
    }
  },

  // تحويل النص إلى كلام (نطق الأخبار)
  async speakNews(text: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `بصوت فخم ووقور جداً، اقرأ بوضوح: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        
        const decode = (base64: string) => {
          const binaryString = atob(base64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          return bytes;
        };

        const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
          const dataInt16 = new Int16Array(data.buffer);
          const frameCount = dataInt16.length / numChannels;
          const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
          for (let channel = 0; channel < numChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
              channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
            }
          }
          return buffer;
        };

        const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
      }
    } catch (error) {
      console.error("TTS Error:", error);
    }
  },

  // تحليل الاقتراحات وإرجاع بيانات JSON منظمة
  async analyzeSuggestion(suggestion: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `حلل هذا الاقتراح برمجياً واستراتيجياً لمنصة فليكسو واذكر رأيك للمدير خالد المنتصر: "${suggestion}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, description: "تصنيف الاقتراح (technical, strategic, ui, general)" },
              analysis: { type: Type.STRING, description: "التحليل الاستراتيجي للاقتراح" },
              priority: { type: Type.STRING, description: "الأولوية (low, medium, high)" }
            },
            required: ['category', 'analysis', 'priority']
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Suggestion Analysis Error:", error);
      return { category: 'general', analysis: 'تعذر التحليل في الوقت الحالي.', priority: 'medium' };
    }
  },

  // تحليل عمليات البحث غير الناجحة
  async analyzeSearchQuery(query: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `المستخدم بحث عن "${query}" ولم يجد نتائج. قدم تفسيراً ذكياً وفخماً يعزز الثقة بالمنصة ويعد بميزات مستقبلية سيادية.`,
      });
      return response.text || "نحن نعمل على توسيع أفق فليكسو السيادي لضم هذه النتائج مستقبلاً.";
    } catch (error) {
      return "جرب البحث بمفردات أكثر سيادية يا ركن.";
    }
  },

  // توليد فيديو سيادي باستخدام Veo
  async generateSovereignVideo(prompt: string, aspectRatio: '16:9' | '9:16' = '9:16') {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `A high-quality, world-class video for FLIXO platform: ${prompt}`,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: aspectRatio }
      });
      while (!operation.done) {
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
  }
};
