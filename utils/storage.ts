import { Clothing, Outfit, WearLog } from './types';

const CLOTHES_KEY = 'wardrobe_clothes';
const OUTFITS_KEY = 'wardrobe_outfits';
const LOGS_KEY = 'wardrobe_wear_logs';
export const PENDING_SELECTION_KEY = 'wardrobe_pending_selection';

const now = () => new Date().toISOString();

export function seedDemoData(): void {
  if (wx.getStorageSync(CLOTHES_KEY)) return;
  const demo: Clothing[] = [
    { id: 'demo-white-shirt', userId: 'local', category: '上衣', color: '白色', season: ['春', '夏', '秋'], style: ['简约', '通勤'], fit: '宽松', warmth: 1, formality: 4, occasion: ['上班', '日常'], keywords: ['白衬衫', '基础款'], wornCount: 2, feedbacks: [], createdAt: now(), updatedAt: now() },
    { id: 'demo-denim', userId: 'local', category: '下装', color: '蓝色', season: ['春', '夏', '秋'], style: ['休闲'], fit: '直筒', warmth: 2, formality: 2, occasion: ['日常'], keywords: ['牛仔裤'], wornCount: 1, feedbacks: [], createdAt: now(), updatedAt: now() },
    { id: 'demo-black-jacket', userId: 'local', category: '外套', color: '黑色', season: ['秋', '冬'], style: ['极简', '通勤'], fit: '挺括', warmth: 4, formality: 4, occasion: ['上班', '约会'], keywords: ['黑色外套'], wornCount: 0, feedbacks: [], createdAt: now(), updatedAt: now() }
  ];
  wx.setStorageSync(CLOTHES_KEY, demo);
  wx.setStorageSync(OUTFITS_KEY, []);
  wx.setStorageSync(LOGS_KEY, []);
}

export const getClothes = (): Clothing[] => wx.getStorageSync(CLOTHES_KEY) || [];
export const saveClothes = (items: Clothing[]) => wx.setStorageSync(CLOTHES_KEY, items);
export const getOutfits = (): Outfit[] => wx.getStorageSync(OUTFITS_KEY) || [];
export const saveOutfits = (items: Outfit[]) => wx.setStorageSync(OUTFITS_KEY, items);
export const getWearLogs = (): WearLog[] => wx.getStorageSync(LOGS_KEY) || [];
export const saveWearLogs = (items: WearLog[]) => wx.setStorageSync(LOGS_KEY, items);

export function upsertClothing(item: Clothing): void {
  saveClothes([item, ...getClothes().filter((x) => x.id !== item.id)]);
}

export function getWardrobeInsights() {
  const threshold = new Date(Date.now() - 60 * 24 * 3600 * 1000);
  const clothes = getClothes();
  return {
    rarelyWorn: clothes.filter((x) => x.wornCount === 0 || !x.lastWornAt || new Date(x.lastWornAt) < threshold),
    hardToMatch: clothes.filter((x) => x.feedbacks.filter((f) => f === '难搭配').length >= 2)
  };
}
