import { Clothing, Outfit } from '../../utils/types';
import { getClothes, saveOutfits, PENDING_SELECTION_KEY } from '../../utils/storage';
import { generateOutfits } from '../../services/cloud';

Page({
  data: { clothes: [] as Clothing[], selectedClothes: [] as Clothing[], resultClothes: [] as Clothing[], moods: ['轻松', '想显精神', '低调', '想尝试新风格'], styles: ['简约', '通勤', '休闲', '复古', '运动'], occasions: ['日常', '上班', '约会', '旅行'], mood: '', style: '', occasion: '', keywords: '', loading: false, result: null as null | { clothingIds: string[]; score?: number; explanation?: string } },
  onLoad() { const clothes = getClothes(); this.setData({ clothes }); },
  onShow() { const clothes = getClothes(); const ids = (wx.getStorageSync(PENDING_SELECTION_KEY) || []) as string[]; if (ids.length) wx.removeStorageSync(PENDING_SELECTION_KEY); this.setData({ clothes, selectedClothes: clothes.filter((x) => ids.includes(x.id)) }); },
  pickMood(e: WechatMiniprogram.BaseEvent) { this.setData({ mood: e.currentTarget.dataset.value }); },
  pickStyle(e: WechatMiniprogram.BaseEvent) { this.setData({ style: e.currentTarget.dataset.value }); },
  pickOccasion(e: WechatMiniprogram.BaseEvent) { this.setData({ occasion: e.currentTarget.dataset.value }); },
  inputKeywords(e: WechatMiniprogram.Input) { this.setData({ keywords: e.detail.value }); },
  findClothing(id: string): Clothing { return this.data.clothes.find((x) => x.id === id) || ({ category: '上衣', color: '未知' } as Clothing); },
  removeSelected(e: WechatMiniprogram.BaseEvent) { this.setData({ selectedClothes: this.data.selectedClothes.filter((x) => x.id !== e.currentTarget.dataset.id) }); },
  openWardrobe() { wx.switchTab({ url: '/pages/wardrobe/wardrobe' }); },
  async askAI() { this.setData({ loading: true }); try { const response = await generateOutfits({ clothingIds: this.data.selectedClothes.map((x) => x.id), mood: this.data.mood, style: this.data.style, occasion: this.data.occasion, keywords: this.data.keywords }); const result = response.outfits[0] || null; this.setData({ result, resultClothes: result ? result.clothingIds.map((id) => this.findClothing(id)) : [] }); } catch (error) { wx.showToast({ title: '搭配失败，请重试', icon: 'none' }); } finally { this.setData({ loading: false }); } },
  saveResult() { if (!this.data.result) return; const outfit: Outfit = { id: `outfit-${Date.now()}`, userId: 'local', clothingIds: this.data.result.clothingIds, lockedClothingIds: this.data.selectedClothes.map((x) => x.id), source: 'ai', mood: this.data.mood, style: this.data.style, occasion: this.data.occasion, keywords: this.data.keywords, score: this.data.result.score, explanation: this.data.result.explanation, createdAt: new Date().toISOString() }; saveOutfits([outfit, ...wx.getStorageSync('wardrobe_outfits') || []]); wx.showToast({ title: '已保存', icon: 'success' }); }
});
