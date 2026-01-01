# Normal Map Generator - 开发指南

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:3000`

### 3. 构建生产版本
```bash
npm run build
```

## 📁 项目结构

```
normalmapgenerator-nextjs/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 根布局(SEO优化)
│   ├── page.tsx             # 主页
│   ├── globals.css          # 全局样式
│   ├── tutorials/           # 教程页面
│   ├── faq/                 # FAQ页面
│   └── blog/                # 博客页面
├── components/              # React组件
│   ├── ui/                  # UI基础组件
│   ├── generator/           # 生成器组件
│   ├── preview/             # 预览组件
│   └── layout/              # 布局组件
├── lib/                     # 工具函数
├── types/                   # TypeScript类型
└── public/                  # 静态资源
```

## 🎨 设计系统

### 颜色
- Primary: #6366f1 (Indigo)
- Secondary: #8b5cf6 (Purple)
- Accent: #ec4899 (Pink)

### 特效
- Glassmorphism背景
- 渐变网格动画
- 流畅的微动画
- 深色/浅色模式自动切换

## 🔧 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **动画**: Framer Motion
- **3D**: React Three Fiber
- **状态**: Zustand

## 📝 开发计划

### Phase 1: UI基础 ✅
- [x] 项目初始化
- [x] 全局样式系统
- [x] SEO优化布局
- [x] 现代化主页

### Phase 2: 核心功能 (进行中)
- [ ] 文件上传组件
- [ ] 法线贴图生成算法
- [ ] 实时预览
- [ ] 设置面板

### Phase 3: 高级功能
- [ ] 3D预览
- [ ] 批量处理
- [ ] 预设系统
- [ ] 历史记录

### Phase 4: 内容页面
- [ ] 教程页面
- [ ] FAQ页面
- [ ] 博客系统

## 🚀 部署到Vercel

### 自动部署
1. 推送代码到GitHub
2. 在Vercel导入仓库
3. 自动部署完成

### 环境变量
在Vercel项目设置中添加:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_ID`

## 📊 性能目标

- Lighthouse Score: > 95
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Bundle Size: < 200KB

## 🎯 SEO优化

- ✅ 动态Metadata
- ✅ 结构化数据(JSON-LD)
- ✅ Open Graph标签
- ✅ Twitter Card
- ✅ Canonical URL
- ✅ Sitemap自动生成

## 📱 响应式设计

- Mobile First设计
- 断点: 640px, 768px, 1024px, 1280px
- 触摸优化
- 性能优化

## 🔍 下一步

1. 实现文件上传和拖放功能
2. 移植原始法线贴图算法
3. 创建实时预览组件
4. 添加3D预览功能
5. 创建教程和文档页面

---

**开发者**: NormalMapGenerator.io Team
**最后更新**: 2026-01-01
