# CloudBase 接入清单

## 你需要完成

1. 创建微信小程序并取得 AppID。
2. 创建 CloudBase 环境，记下环境 ID。
3. 在微信开发者工具中开启云开发并关联环境。
4. 把 `env.ts` 中的 `ENV_ID` 改成你的环境 ID，并将 `ENABLE_CLOUD` 改为 `true`。
5. 部署 `cloudfunctions/` 下的云函数。
6. 创建以下数据库集合：`clothes`、`outfits`、`wear_logs`。
7. 在云函数环境变量里设置 DeepSeek 配置。

## 数据权限建议

衣物、搭配和穿着记录均属于个人数据，正式试用前设置为“仅创建者可读写”，并通过云函数写入关键字段。不要使用公开读写规则。

## AI 环境变量

```text
AI_PROVIDER=deepseek
AI_BASE_URL=https://api.deepseek.com
AI_MODEL=你的模型名称
AI_API_KEY=只在云函数环境变量配置
AI_TIMEOUT_MS=20000
```

前端没有 API Key，也不接受前端传入任意模型地址。

## 图片抠图

入库流程会保存原图到 CloudBase 云存储，再由 `mattingClothingImage` 云函数复制原图到 COS，调用数据万象商品抠图，最后把透明 PNG 回传至 CloudBase 云存储。衣物记录会写入 `processedImageFileId`，页面会优先展示该透明图。

在 `mattingClothingImage` 云函数中设置以下环境变量。密钥只保存在云端，不要写入 `env.ts` 或 Git：

```text
MATTING_ENABLED=true
COS_BUCKET=你的存储桶名称-APPID
COS_REGION=存储桶地域，例如 ap-guangzhou
COS_SECRET_ID=子账号密钥 ID
COS_SECRET_KEY=子账号密钥 Key
```

创建 COS 存储桶后，在数据万象控制台绑定该存储桶并开通商品抠图。为该子账号授予该存储桶的 `cos:PutObject`、`cos:GetObject` 权限；商品抠图上传处理使用 `cos:PutObject` 权限。部署云函数前需在其目录执行 `npm install`，以安装 COS SDK。

## 验证顺序

1. 先只接通云数据库和云存储。
2. 再部署 `normalizeTags`，用一条文本标签验证 DeepSeek 网络连通性。
3. 再部署 `generateOutfits`，验证固定衣物不会被 AI 替换。
4. 最后接入商品抠图，验证失败回退原图。
