import { Clothing, ClothingCategory } from '../../utils/types';
import { createClothing, normalizeTags } from '../../services/cloud';

Page({
  data: { imagePath: '', categories: ['上衣', '下装', '连衣裙', '外套', '鞋子', '配饰'], colors: ['黑色', '白色', '灰色', '蓝色', '棕色', '绿色', '红色'], category: '上衣', color: '黑色', style: '', keywords: '', loading: false },
  chooseImage() { wx.chooseMedia({ count: 1, mediaType: ['image'], sourceType: ['album', 'camera'], success: (res) => this.setData({ imagePath: res.tempFiles[0].tempFilePath }) }); },
  chooseCategory(e: WechatMiniprogram.PickerChange) { this.setData({ category: this.data.categories[Number(e.detail.value)] }); },
  chooseColor(e: WechatMiniprogram.PickerChange) { this.setData({ color: this.data.colors[Number(e.detail.value)] }); },
  inputStyle(e: WechatMiniprogram.Input) { this.setData({ style: e.detail.value }); },
  inputKeywords(e: WechatMiniprogram.Input) { this.setData({ keywords: e.detail.value }); },
  async submit() { if (!this.data.imagePath) return wx.showToast({ title: '请先选择照片', icon: 'none' }); this.setData({ loading: true }); try { const tags = await normalizeTags({ category: this.data.category, color: this.data.color, style: this.data.style.split(/[、,， ]/).filter(Boolean), keywords: this.data.keywords.split(/[、,， ]/).filter(Boolean) }); const item: Clothing = { id: `clothing-${Date.now()}`, userId: 'local', category: this.data.category as ClothingCategory, color: this.data.color, season: ['春', '夏', '秋', '冬'], style: Array.isArray(tags.style) ? tags.style as string[] : this.data.style.split(/[、,， ]/).filter(Boolean), fit: '常规', warmth: 2, formality: 2, occasion: ['日常'], keywords: Array.isArray(tags.keywords) ? tags.keywords as string[] : this.data.keywords.split(/[、,， ]/).filter(Boolean), wornCount: 0, feedbacks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; await createClothing(item, this.data.imagePath); wx.showToast({ title: '已加入衣橱', icon: 'success' }); setTimeout(() => wx.navigateBack(), 500); } catch (e) { wx.showToast({ title: '保存失败，请重试', icon: 'none' }); } finally { this.setData({ loading: false }); } }
});
