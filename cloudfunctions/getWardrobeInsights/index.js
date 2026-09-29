const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const db = cloud.database();
  const res = await db.collection('clothes').where({ userId: context.OPENID }).get();
  const cutoff = Date.now() - 60 * 24 * 3600 * 1000;
  return { rarelyWorn: res.data.filter((x) => !x.lastWornAt || new Date(x.lastWornAt).getTime() < cutoff), hardToMatch: res.data.filter((x) => (x.feedbacks || []).filter((f) => f === '难搭配').length >= 2) };
};
