# 接口之外 · Sanity 内容后台

1. 在 Sanity 创建免费项目与 `production` 数据集。
2. 将项目 ID 写入本目录的 `SANITY_STUDIO_PROJECT_ID`，并在网站根目录 `.env` 中写入同一个 `NEXT_PUBLIC_SANITY_PROJECT_ID`。
3. 安装本目录依赖后运行 `npm run dev` 编辑内容，确认后运行 `npm run deploy` 发布后台。
4. 网站在没有项目 ID 或接口不可用时自动展示内置首发内容；连接成功且后台已有文章后自动读取已发布文章。
