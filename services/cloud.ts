import { Clothing, Outfit, OutfitRequest } from '../utils/types';
import { getClothes, getOutfits, saveOutfits, upsertClothing } from '../utils/storage';

function isCloudEnabled(): boolean {
  const app = getApp<IAppOption>();
  return Boolean(app.globalData.cloudEnabled);
}

export async function callCloud<T>(name: string, data: Record<string, unknown>): Promise<T> {
  const result = await wx.cloud.callFunction({ name, data });
  return result.result as T;
}

export async function normalizeTags(input: Record<string, unknown>) {
  if (isCloudEnabled()) return callCloud<Record<string, unknown>>('normalizeTags', { input });
  return { ...input, keywords: input.keywords || [] };
}

export async function generateOutfits(request: OutfitRequest): Promise<{ outfits: Array<Partial<Outfit> & { clothingIds: string[] }> }> {
  if (isCloudEnabled()) return callCloud('generateOutfits', request as unknown as Record<string, unknown>);
  const clothes = getClothes();
  const selected = clothes.filter((x) => request.clothingIds.includes(x.id));
  const pool = clothes.filter((x) => !request.clothingIds.includes(x.id));
  const top = selected.find((x) => x.category === '上衣') || pool.find((x) => x.category === '上衣');
  const bottom = selected.find((x) => x.category === '下装') || pool.find((x) => x.category === '下装');
  const outer = selected.find((x) => x.category === '外套') || pool.find((x) => x.category === '外套');
  const ids = [top?.id, bottom?.id, outer?.id].filter(Boolean) as string[];
  return { outfits: [{ clothingIds: [...new Set([...request.clothingIds, ...ids])], explanation: '基于你已选的单品，补齐了一个简约、适合日常的组合。', score: 86 }] };
}

export async function saveOutfit(outfit: Outfit) {
  if (isCloudEnabled()) return callCloud('saveOutfitFeedback', { action: 'save', outfit });
  saveOutfits([outfit, ...getOutfits()]);
  return { ok: true };
}

export async function createClothing(item: Clothing, localImagePath?: string) {
  if (!isCloudEnabled()) {
    upsertClothing({ ...item, imagePath: localImagePath, userId: 'local' });
    return { ...item, imagePath: localImagePath };
  }
  const upload = await wx.cloud.uploadFile({ cloudPath: `clothes/${item.id}.jpg`, filePath: localImagePath! });
  const result = await callCloud<{ item: Clothing }>('createClothing', { item, imageFileId: upload.fileID });
  return result.item;
}
