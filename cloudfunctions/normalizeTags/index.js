const cloud = require('wx-server-sdk');
const { chatJson } = require('./ai');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event) => {
  if (!process.env.AI_API_KEY) return { ...event.input, keywords: event.input?.keywords || [], _fallback: true };
  return chatJson({
    system: '你是衣橱标签整理器。只输出 JSON，不要输出 Markdown。保留用户事实，不要凭空识别图片。字段包括 category,color,season,style,fit,warmth,formality,occasion,keywords。',
    user: JSON.stringify(event.input || {})
  });
};
