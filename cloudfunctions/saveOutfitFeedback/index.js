const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const db = cloud.database();
  if (event.action === 'save') {
    const outfit = { ...event.outfit, userId: context.OPENID, createdAt: new Date().toISOString() };
    delete outfit.id;
    const result = await db.collection('outfits').add({ data: outfit });
    return { ok: true, id: result._id };
  }
  return { ok: false, message: 'unknown action' };
};
