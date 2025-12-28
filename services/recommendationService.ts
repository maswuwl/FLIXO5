
import { geminiService } from './geminiService';
import { ContentItem } from '../types';

interface UserInterest {
  tag: string;
  weight: number;
}

class RecommendationEngine {
  private interests: Map<string, number> = new Map();

  // تسجيل تفاعل (إعجاب، حفظ، مشاركة)
  trackInteraction(tags: string[], weight: number = 1) {
    tags.forEach(tag => {
      const current = this.interests.get(tag) || 0;
      this.interests.set(tag, current + weight);
    });
    console.log("Algorithm Updated:", Object.fromEntries(this.interests));
  }

  // الحصول على "بروفايل" المستخدم الحالي عبر Gemini
  async getUserPersona() {
    const topInterests = Array.from(this.interests.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(i => i[0]);

    if (topInterests.length === 0) return "مستكشف جديد";

    const prompt = `بناءً على هذه الاهتمامات: (${topInterests.join(', ')}). صف هذا المستخدم في جملة واحدة قصيرة جداً ومرحة باللغة العربية (مثلاً: مهووس بالتقنية وعاشق للبيتزا).`;
    const result = await geminiService.askExpert(prompt);
    return result.text || "مبدع فليكسو";
  }

  // ترتيب المحتوى بناءً على الاهتمامات
  rankContent(feed: ContentItem[]): ContentItem[] {
    return [...feed].sort((a, b) => {
      const scoreA = (a.tags || []).reduce((acc, tag) => acc + (this.interests.get(tag) || 0), 0);
      const scoreB = (b.tags || []).reduce((acc, tag) => acc + (this.interests.get(tag) || 0), 0);
      return scoreB - scoreA;
    });
  }

  getTopTags() {
    return Array.from(this.interests.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(i => i[0]);
  }
}

export const recommendationEngine = new RecommendationEngine();
