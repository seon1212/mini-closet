# 智能胶囊衣橱微信小程序

当前是开发中的微信小程序源码，已具备本地演示模式的基础页面。真实 CloudBase 数据同步、商品抠图和完整 AI 搭配仍需接入与真机验证；不要把它当作已可上线的安装包。

## 立即预览（本地演示模式）

1. 安装微信开发者工具。
2. 导入本目录，AppID 暂时选择测试号或使用你的小程序 AppID。
3. 将 `env.example.ts` 复制为 `env.ts`，保持 `ENABLE_CLOUD=false`。
4. 在项目目录执行 `npm ci`，然后在开发者工具中编译预览。首次启动会生成 3 件演示衣物。

## 在另一台电脑试用

1. 用 Git 克隆仓库，或解压源码包。
2. 安装 Node.js 与微信开发者工具。
3. 在项目目录运行 `npm ci`。
4. 复制 `env.example.ts` 为 `env.ts`。若只体验界面，保持本地演示模式。
5. 在微信开发者工具导入项目目录；使用测试号或自己的 AppID。

本地演示模式的数据只存在当前微信/设备中，换电脑不会自动同步。要跨设备使用同一衣橱，需要完成 CloudBase 接入。

## 发布源码到 GitHub

本项目提供 `.gitignore`，会排除 `node_modules/`、本机微信开发者工具配置、`env.ts`、`.env` 和压缩包。发布前仍需检查待提交文件，不要提交 DeepSeek API Key 或其他密钥。

```sh
git init
git add .
git status --short
git commit -m "Initial smart wardrobe miniapp"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

先在 GitHub 创建空仓库，再替换上面的远程地址。个人项目建议先建私有仓库。`git push` 上传的是源码；微信小程序试用版仍需通过微信开发者工具预览或上传。

## 接入 CloudBase

1. 创建 CloudBase 环境。
2. 将 `env.example.ts` 复制为 `env.ts`，填写 `ENV_ID` 并设置 `ENABLE_CLOUD=true`。
3. 在微信开发者工具中部署 `cloudfunctions/` 下的云函数。
4. 创建 `clothes`、`outfits`、`wear_logs` 集合，并为用户数据配置仅创建者可读写规则。
5. 按 `cloudfunctions/README.md` 配置 DeepSeek 环境变量。
6. 真机测试上传、标签整理、搭配和删除流程。

## 当前需要你提供

- 微信小程序 AppID（接入云端和真机试用时需要）。
- CloudBase 环境 ID。
- DeepSeek 模型名和确认可访问的 Base URL。API Key 只在云函数环境变量中填写，不要发到聊天或提交到仓库。
- 5～10 张抠图验收照片（启用商品抠图前）。

## 说明

图片抠图接口目前是降级安全接口：没有配置腾讯云数据万象时仍可正常保存原图。正式启用抠图前，需要单独开通数据万象商品抠图并设置 COS 权限。
