import { ENABLE_CLOUD, ENV_ID } from '../../env';

Page({
  data: { cloudEnabled: ENABLE_CLOUD && Boolean(ENV_ID) },
  showPrivacy() { wx.showModal({ title: '隐私与数据', content: '衣物照片和衣橱记录仅用于本产品功能。正式接入云端前，请完善小程序隐私说明和数据删除入口。', showCancel: false }); },
  clearLocal() { wx.showModal({ title: '清空本地数据？', content: '这会删除当前设备上的演示衣橱数据。', success: (res) => { if (res.confirm) { wx.clearStorageSync(); wx.showToast({ title: '已清空', icon: 'success' }); } } }); }
});
