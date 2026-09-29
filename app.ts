import { ENABLE_CLOUD, ENV_ID } from './env';
import { seedDemoData } from './utils/storage';

App<IAppOption>({
  globalData: {
    cloudEnabled: ENABLE_CLOUD && Boolean(ENV_ID),
    envId: ENV_ID
  },
  onLaunch() {
    seedDemoData();
    if (this.globalData.cloudEnabled) {
      wx.cloud.init({ env: ENV_ID, traceUser: true });
    }
  },
  onShow() {
    // 首页 onShow 会读取最新的低频衣物提示。
  }
});
