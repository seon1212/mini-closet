import { getWardrobeInsights, getClothes } from '../../utils/storage';

Page({
  data: { clothesCount: 0, rarelyWornCount: 0, hardToMatchCount: 0 },
  onShow() {
    const insight = getWardrobeInsights();
    this.setData({ clothesCount: getClothes().length, rarelyWornCount: insight.rarelyWorn.length, hardToMatchCount: insight.hardToMatch.length });
  },
  openWorkspace() { wx.switchTab({ url: '/pages/workspace/workspace' }); },
  openWardrobe() { wx.switchTab({ url: '/pages/wardrobe/wardrobe' }); },
  addClothing() { wx.navigateTo({ url: '/pages/add-clothing/add-clothing' }); }
});
