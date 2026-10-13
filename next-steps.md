# 智能胶囊衣橱：后续开发与试用步骤

## 当前状态

- 小程序源码已上传到 GitHub：<https://github.com/seon1212/mini-closet>
- 已支持本地演示模式：衣橱浏览、筛选、多选加入搭配工作台、本地模拟搭配结果。
- 当前还没有正式接入 CloudBase 云数据库、云存储和 DeepSeek AI。
- 图片自动抠图目前是安全降级接口，未配置服务时会继续使用原图。
- 换季提醒和系统级通知暂不属于当前版本。

## 第一阶段：本地预览

### 需要你完成

1. 安装微信开发者工具。
2. 导入项目目录：

   ```text
   /Users/sharpa/Documents/myproject
   ```

3. 在项目目录执行：

   ```bash
   cp env.example.ts env.ts
   npm ci
   ```

4. 确认 `env.ts` 保持本地演示配置：

   ```ts
   export const ENV_ID = '';
   export const ENABLE_CLOUD = false;
   ```

5. 在微信开发者工具中编译，体验首页、衣橱筛选、衣物选择和搭配工作台。

本地演示数据只保存在当前设备，换电脑后不会自动同步。

## 第二阶段：准备微信小程序和 CloudBase

### 需要你完成

1. 注册或准备一个微信小程序，取得小程序 `AppID`。
2. 在微信开发者工具中开启云开发。
3. 创建 CloudBase 免费体验环境，记录环境 ID。
4. 将本地 `env.ts` 改为：

   ```ts
   export const ENV_ID = '你的 CloudBase 环境 ID';
   export const ENABLE_CLOUD = true;
   ```

5. 在微信开发者工具中关联对应的云环境。

可以提供给开发者的信息：

- 微信小程序 AppID
- CloudBase 环境 ID
- DeepSeek 模型名称
- DeepSeek Base URL

不要通过聊天、GitHub 或前端代码提供 DeepSeek API Key。

## 第三阶段：配置数据库和云函数

### 需要部署的数据库集合

- `clothes`：衣物信息和标签
- `outfits`：保存的搭配方案
- `wear_logs`：穿着记录和反馈

正式试用前，将数据权限设置为“仅创建者可读写”，不要使用公开读写规则。

### 需要部署的云函数

在微信开发者工具中部署 `cloudfunctions/` 下的云函数，包括：

- `createClothing`
- `normalizeTags`
- `generateOutfits`
- `saveOutfitFeedback`
- `getWardrobeInsights`
- `deleteUserData`
- `mattingClothingImage`

## 第四阶段：配置 DeepSeek

在调用 AI 的云函数环境变量中配置：

```text
AI_PROVIDER=deepseek
AI_BASE_URL=https://api.deepseek.com
AI_MODEL=你的模型名称
AI_API_KEY=你的 DeepSeek Key
AI_TIMEOUT_MS=20000
```

API Key 只填写在 CloudBase 云函数环境变量中，不要写入：

- `env.ts`
- 小程序前端代码
- GitHub 仓库
- 聊天消息

接入顺序：

1. 先部署 `normalizeTags`，验证文本标签整理。
2. 再部署 `generateOutfits`，验证根据标签生成搭配。
3. 验证用户手动选择的衣物不会被 AI 静默替换。
4. 最后测试搭配反馈和不常穿衣物分析。

DeepSeek 在当前方案中只处理衣物文字标签、搭配条件和用户反馈，不直接识别图片内容。

## 第五阶段：图片上传和抠图

当前上传流程会保存原图。抠图服务未配置或失败时，应用会回退使用原图，避免影响入库。

如果要启用透明背景图片，需要另外：

1. 开通腾讯云数据万象商品抠图服务。
2. 配置 COS 或 CloudBase 云存储权限。
3. 配置 `mattingClothingImage` 云函数。
4. 使用 5～10 张真实衣物照片进行验收。

## 第六阶段：真机测试

重点验证：

- 拍照和从相册选择照片
- 上传失败和网络较慢时的提示
- 衣物标签编辑和保存
- 按类别、颜色、风格、季节筛选
- 多选衣物进入搭配工作台
- AI 搭配结果和手动选择的衣物保持一致
- 删除衣物和删除个人数据
- 换设备后云端数据是否同步

## 第七阶段：日常更新并同步 GitHub

修改代码后，先查看变更：

```bash
git status
```

提交项目文件：

```bash
git add .
git commit -m "描述本次修改"
```

如果本机的 `git push` 再次出现 `zsh: killed`，使用已经验证可行的 SSH 推送方式：

```bash
git send-pack git@github.com:seon1212/mini-closet.git refs/heads/main:refs/heads/main
git fetch origin main
```

不要提交以下内容：

- `env.ts`
- `.env` 文件
- DeepSeek API Key
- `node_modules/`
- 本机微信开发者工具私有配置
- 与智能衣橱无关的本地草稿

## 目前不属于本阶段的功能

- 换季提醒
- 系统级推送通知
- 自动识别图片中的衣物属性
- 正式生产环境发布和审核

