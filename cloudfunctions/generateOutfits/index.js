const cloud = require('wx-server-sdk');
const { chatJson } = require('./ai');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event) => {
  const input = event || {};
  if (!process.env.AI_API_KEY) return { outfits: [{ clothingIds: input.clothingIds || [], score: 60, explanation: 'AI 尚未配置，先使用你已选的单品。' }] };
  return chatJson({
    system: '你是智能衣橱搭配助手。只输出 JSON，格式为 {"outfits":[{"clothingIds":["id"],"score":0,"explanation":"简短中文理由"}]}。已固定的 clothingIds 必须保留，只能从衣橱中补齐。',
    user: JSON.stringify(input)
  });
};
