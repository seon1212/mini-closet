# CloudBase 云函数

部署前需要在每个调用 AI 的函数环境变量中设置：

- `AI_PROVIDER=deepseek`
- `AI_BASE_URL=https://api.deepseek.com`
- `AI_MODEL=你的模型名`
- `AI_API_KEY=你的 DeepSeek Key`
- `AI_TIMEOUT_MS=20000`

不要把 Key 写进小程序前端或 Git。`mattingClothingImage` 当前提供安全降级接口；启用腾讯云数据万象商品抠图前，需要在 COS/CloudBase 中开通服务并配置权限。
