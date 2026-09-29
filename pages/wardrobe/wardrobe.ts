import { Clothing } from '../../utils/types';
import { getClothes, PENDING_SELECTION_KEY } from '../../utils/storage';

Page({
  data: { clothes: [] as Clothing[], filteredClothes: [] as Array<Clothing & { isSelected: boolean }>, selectedIds: [] as string[], activeCategory: '全部', activeColor: '全部', activeStyle: '全部', categories: ['上衣', '下装', '连衣裙', '外套', '鞋子', '配饰'], colors: ['全部', '黑色', '白色', '灰色', '蓝色', '棕色', '绿色', '红色'], styles: ['全部', '简约', '通勤', '休闲', '极简', '复古', '运动'] },
  onShow() { const clothes = getClothes(); this.setData({ clothes, selectedIds: [] }); this.applyFilters(clothes, '全部', '全部', '全部'); },
  applyFilters(clothes: Clothing[], category: string, color: string, style: string) { const filtered = clothes.filter((x) => (category === '全部' || x.category === category) && (color === '全部' || x.color === color) && (style === '全部' || x.style.includes(style))).map((x) => ({ ...x, isSelected: this.data.selectedIds.includes(x.id) })); this.setData({ filteredClothes: filtered, activeCategory: category, activeColor: color, activeStyle: style }); },
  chooseCategory(e: WechatMiniprogram.BaseEvent) { this.applyFilters(this.data.clothes, e.currentTarget.dataset.value, this.data.activeColor, this.data.activeStyle); },
  chooseColor(e: WechatMiniprogram.PickerChange) { this.applyFilters(this.data.clothes, this.data.activeCategory, this.data.colors[Number(e.detail.value)], this.data.activeStyle); },
  chooseStyle(e: WechatMiniprogram.PickerChange) { this.applyFilters(this.data.clothes, this.data.activeCategory, this.data.activeColor, this.data.styles[Number(e.detail.value)]); },
  toggleSelected(e: WechatMiniprogram.BaseEvent) { const id = e.currentTarget.dataset.id as string; const selected = this.data.selectedIds.includes(id) ? this.data.selectedIds.filter((x) => x !== id) : [...this.data.selectedIds, id]; this.setData({ selectedIds: selected, filteredClothes: this.data.filteredClothes.map((x) => ({ ...x, isSelected: selected.includes(x.id) })) }); },
  toWorkspace() { wx.setStorageSync(PENDING_SELECTION_KEY, this.data.selectedIds); wx.switchTab({ url: '/pages/workspace/workspace' }); },
  addClothing() { wx.navigateTo({ url: '/pages/add-clothing/add-clothing' }); }
});
