const cloud = require('wx-server-sdk');
const COS = require('cos-nodejs-sdk-v5');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`缺少云函数环境变量：${name}`);
  return value;
}

function cosCall(client, method, params) {
  return new Promise((resolve, reject) => {
    client[method](params, (error, data) => error ? reject(error) : resolve(data));
  });
}

function normalizeExtension(fileName = '') {
  const match = /\.(jpe?g|png|webp)$/i.exec(fileName);
  return match ? match[0].toLowerCase().replace('jpeg', 'jpg') : '.jpg';
}

// Store both versions in COS, then copy the transparent PNG back into
// CloudBase storage so the mini-program can render it through a cloud:// ID.
exports.main = async (event) => {
  const originalFileId = String(event.originalFileId || '');
  const clothingId = String(event.clothingId || '');
  if (!originalFileId || !clothingId) throw new Error('originalFileId 和 clothingId 为必填项');

  if (process.env.MATTING_ENABLED !== 'true') {
    return { status: 'fallback_original', originalFileId };
  }

  const Bucket = required('COS_BUCKET');
  const Region = required('COS_REGION');
  const SecretId = required('COS_SECRET_ID');
  const SecretKey = required('COS_SECRET_KEY');
  const original = await cloud.downloadFile({ fileID: originalFileId });
  const extension = normalizeExtension(originalFileId);
  const originalKey = `smart-wardrobe/original/${clothingId}${extension}`;
  const processedKey = `smart-wardrobe/cutouts/${clothingId}.png`;
  const cos = new COS({ SecretId, SecretKey });

  await cosCall(cos, 'putObject', {
    Bucket,
    Region,
    Key: originalKey,
    Body: original.fileContent,
    ContentType: `image/${extension.slice(1)}`,
    PicOperations: JSON.stringify({
      is_pic_info: 0,
      rules: [{
        fileid: processedKey,
        rule: 'ci-process=GoodsMatting&center-layout=1&padding-layout=40x40'
      }]
    })
  });

  const processed = await cosCall(cos, 'getObject', { Bucket, Region, Key: processedKey });
  const uploaded = await cloud.uploadFile({
    cloudPath: `clothes/processed/${clothingId}.png`,
    fileContent: processed.Body
  });

  return {
    status: 'processed',
    originalFileId,
    processedImageFileId: uploaded.fileID,
    originalCosKey: originalKey,
    processedCosKey: processedKey
  };
};
