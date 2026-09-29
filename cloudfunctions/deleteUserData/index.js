const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const db = cloud.database();
  for (const collection of ['clothes', 'outfits', 'wear_logs']) {
    const rows = await db.collection(collection).where({ userId: context.OPENID }).get();
    for (const row of rows.data) await db.collection(collection).doc(row._id).remove();
  }
  return { ok: true };
};
