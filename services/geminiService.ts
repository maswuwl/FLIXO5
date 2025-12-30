
// Fix: Use correct imports for Gemini API
import { Type, Modality, GoogleGenAI } from "@google/genai";

const getAIProvider = async () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Fix: Helper to decode base64 string for audio
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Fix: Helper to decode raw PCM audio data for TTS
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
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
}

export const geminiService = {
  // محرك المحادثة الذكي (ChatGPT Style) مع دعم البث
  async *askExpertStream(prompt: string, history: any[] = []) {
    const ai = await getAIProvider();
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `أنت "الخبير التنفيذي الأعلى" لـ FLIXO. ذكاؤك يتجاوز GPT-4. المطور هو خالد المنتصر. ردودك يجب أن تكون: 1. عبقرية تقنياً 2. فخمة لغوياً 3. تحليلية بعمق. إذا سُئلت عن كود، قدم الحل الأفضل عالمياً. أنت لست مجرد بوت، أنت عقل المنصة السيادي.`,
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{ googleSearch: {} }]
      }
    });

    const result = await chat.sendMessageStream({ message: prompt });
    for await (const chunk of result) {
      yield chunk.text;
    }
  },

  // تحليل الصور البرمجية (Vision Fix)
  async analyzeErrorCode(imageSafeBase64: string, prompt: string) {
    const ai = await getAIProvider();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: imageSafeBase64 } },
          { text: `قم بتحليل هذا الخطأ البرمجي في الصورة وقدم الحل النهائي بأسلوب سيادي: ${prompt}` }
        ]
      },
      config: { thinkingConfig: { thinkingBudget: 16000 } }
    });
    return response.text;
  },

  async askExpert(prompt: string, history: any[] = []) {
    const ai = await getAIProvider();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: prompt }]}
      ],
      config: {
        systemInstruction: `أنت العقل الاستراتيجي لـ FLIXO. خالد المنتصر هو القائد. حلل بعمق، فكر بذكاء، ورد بفخامة.`,
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return { text: response.text, functionCalls: response.functionCalls };
  },

  async translateMessage(text: string) {
    const ai = await getAIProvider();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `ترجم بأسلوب فخم: ${text}`,
    });
    return response.text || text;
  },

  async analyzeSearchQuery(query: string) {
    const ai = await getAIProvider();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `بحث المستخدم عن ${query} ولم يجد شيئاً. قدم تعليقاً ذكياً.`,
    });
    return response.text;
  },

  // Fix: Added findLocalVibes using Google Maps grounding tool
  async findLocalVibes(lat: number, lng: number) {
    const ai = await getAIProvider();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: `ما هي أفضل الأماكن والفعاليات والأجواء القريبة من الإحداثيات ${lat}, ${lng}؟ قدم تحليلاً ذكياً للأجواء الحالية.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        }
      },
    });
    return {
      text: response.text,
      places: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  },

  // Fix: Added fixRepositoryErrors for AI Studio code fixing
  async fixRepositoryErrors(filename: string, errorRate: number) {
    const ai = await getAIProvider();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `قم بإصلاح الأخطاء في الملف ${filename} علماً أن نسبة الخطأ هي ${errorRate}%. قدم الحل البرمجي النهائي.`,
      config: { thinkingConfig: { thinkingBudget: 32768 } }
    });
    return response.text;
  },

  // Fix: Added analyzeNews for summary/analysis in Newsroom
  async analyzeNews(topic: string) {
    const ai = await getAIProvider();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `حلل هذا الخبر بأسلوب استراتيجي سيادي لـ FLIXO: ${topic}`,
    });
    return response.text;
  },

  // Fix: Added speakNews for TTS functionality in Newsroom
  async speakNews(text: string) {
    const ai = await getAIProvider();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `بصوت رسمي وفخم لغرفة أخبار فليكسو: ${text}` }] }],
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
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioContext, 24000, 1);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  },

  // Fix: Added analyzeSuggestion with JSON response schema for Settings
  async analyzeSuggestion(text: string) {
    const ai = await getAIProvider();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `حلل هذا الاقتراح لتطوير منصة فليكسو: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "تصنيف الاقتراح" },
            analysis: { type: Type.STRING, description: "التحليل الاستراتيجي" },
            priority: { type: Type.STRING, description: "الأولوية: low, medium, high" }
          },
          required: ["category", "analysis", "priority"],
        },
      },
    });
    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      return { category: 'عام', analysis: response.text, priority: 'medium' };
    }
  }
};
