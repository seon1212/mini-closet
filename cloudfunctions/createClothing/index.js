const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const db = cloud.database();
  const item = { ...event.item, userId: event.item?.userId || context.OPENID, imageFileId: event.imageFileId, updatedAt: new Date().toISOString() };
  delete item.id;
  const result = await db.collection('clothes').add({ data: item });
  return { item: { ...item, id: result._id } };
};
