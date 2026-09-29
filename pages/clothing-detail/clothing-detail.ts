import { Clothing } from '../../utils/types';
import { getClothes, saveClothes, PENDING_SELECTION_KEY } from '../../utils/storage';

Page({
  data: { item: null as Clothing | null },
  onLoad(options: Record<string, string>) { this.setData({ item: getClothes().find((x) => x.id === options.id) || null }); },
  deleteItem() { if (!this.data.item) return; wx.showModal({ title: '删除这件衣服？', content: '照片和标签会从当前衣橱移除。', success: (res) => { if (res.confirm) { saveClothes(getClothes().filter((x) => x.id !== this.data.item!.id)); wx.navigateBack(); } } }); },
  useInWorkspace() { if (this.data.item) { wx.setStorageSync(PENDING_SELECTION_KEY, [this.data.item.id]); wx.switchTab({ url: '/pages/workspace/workspace' }); } }
});
