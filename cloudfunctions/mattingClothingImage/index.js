const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 腾讯云数据万象商品抠图需要在 CloudBase/COS 中配置对应权限后接入。
// 先提供稳定的降级接口：未配置时返回原图，入库流程不会被阻塞。
exports.main = async (event) => ({ status: process.env.MATTING_ENABLED === 'true' ? 'provider_pending' : 'fallback_original', originalFileId: event.originalFileId || '' });
