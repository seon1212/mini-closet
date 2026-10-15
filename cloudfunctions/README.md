# CloudBase 云函数

部署前需要在每个调用 AI 的函数环境变量中设置：

- `AI_PROVIDER=deepseek`
- `AI_BASE_URL=https://api.deepseek.com`
- `AI_MODEL=你的模型名`
- `AI_API_KEY=你的 DeepSeek Key`
- `AI_TIMEOUT_MS=20000`

不要把 Key 写进小程序前端或 Git。`mattingClothingImage` 会将 CloudBase 原图复制到 COS，调用数据万象商品抠图，再把透明 PNG 回传 CloudBase。启用前需在云函数环境变量配置 `MATTING_ENABLED=true`、`COS_BUCKET`、`COS_REGION`、`COS_SECRET_ID`、`COS_SECRET_KEY`，并在数据万象中绑定存储桶、开通商品抠图。
