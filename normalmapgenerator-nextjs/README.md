# Normal Map Generator - Next.js

超级现代化的在线法线贴图生成器,使用Next.js + TypeScript + Tailwind CSS构建。

## 🚀 特性

### 核心功能
- ✅ 法线贴图生成 (Normal Map)
- ✅ 位移贴图生成 (Displacement Map)
- ✅ 环境光遮蔽 (Ambient Occlusion)
- ✅ 高光贴图 (Specular Map)
- ✅ 批量处理模式
- ✅ 从照片生成法线贴图
- ✅ 实时3D预览

### UI/UX优势
- 🎨 现代化Glassmorphism设计
- 🎨 深色/浅色模式切换
- 🎨 流畅的Framer Motion动画
- 🎨 完全响应式设计
- 🎨 拖放交互增强
- 🎨 实时预览反馈

### 性能优化
- ⚡ 完全静态导出 (SSG)
- ⚡ Next.js Image优化
- ⚡ 代码分割和懒加载
- ⚡ WebGL GPU加速
- ⚡ Service Worker缓存
- ⚡ PageSpeed Score > 95

### SEO优化
- 📊 动态Metadata
- 📊 结构化数据 (JSON-LD)
- 📊 自动生成Sitemap
- 📊 Robots.txt配置
- 📊 Open Graph优化
- 📊 Canonical URL管理

## 🛠️ 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **动画**: Framer Motion
- **3D渲染**: React Three Fiber + Three.js
- **状态管理**: Zustand
- **表单**: React Hook Form
- **部署**: Vercel (免费)

## 📦 安装

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run start
```

## 🌐 部署到Vercel

### 方法1: 通过Vercel CLI
```bash
npm install -g vercel
vercel
```

### 方法2: 通过GitHub集成
1. 推送代码到GitHub
2. 在Vercel中导入仓库
3. 自动部署完成

## 📁 项目结构

```
normalmapgenerator-nextjs/
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 主页
│   ├── globals.css             # 全局样式
│   ├── tutorials/              # 教程页面
│   ├── faq/                    # FAQ页面
│   └── blog/                   # 博客页面
├── components/
│   ├── ui/                     # UI组件
│   ├── generator/              # 生成器组件
│   ├── preview/                # 预览组件
│   └── layout/                 # 布局组件
├── lib/
│   ├── utils.ts                # 工具函数
│   ├── normalmap.ts            # 法线贴图算法
│   └── store.ts                # 状态管理
├── public/
│   ├── images/                 # 静态图片
│   └── cubemaps/               # 环境贴图
└── types/
    └── index.ts                # TypeScript类型定义
```

## 🎯 开发计划

### Phase 1: 核心功能 (Week 1-2)
- [x] Next.js项目初始化
- [ ] 基础UI布局
- [ ] 法线贴图生成核心算法
- [ ] 文件上传和拖放
- [ ] 基础预览功能

### Phase 2: 高级功能 (Week 3-4)
- [ ] 3D实时预览
- [ ] 批量处理模式
- [ ] 从照片生成
- [ ] 预设系统
- [ ] 历史记录

### Phase 3: UI/UX优化 (Week 5-6)
- [ ] 深色模式
- [ ] 动画效果
- [ ] 响应式优化
- [ ] 性能优化
- [ ] 无障碍访问

### Phase 4: SEO和内容 (Week 7-8)
- [ ] SEO优化
- [ ] 教程页面
- [ ] FAQ页面
- [ ] 博客内容
- [ ] 多语言支持

## 📝 环境变量

创建 `.env.local` 文件:

```env
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# 网站URL
NEXT_PUBLIC_SITE_URL=https://normalmapgenerator.io
```

## 🔧 配置

### Vercel配置
项目已配置为静态导出,可直接部署到Vercel免费计划。

### 自定义域名
在Vercel项目设置中添加自定义域名 `normalmapgenerator.io`

## 📊 性能目标

- Lighthouse Performance: > 95
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

## 🤝 贡献

欢迎提交Issue和Pull Request!

## 📄 许可证

MIT License - 基于原始项目 [NormalMap-Online](https://github.com/cpetry/NormalMap-Online)

## 🔗 相关链接

- [在线演示](https://normalmapgenerator.io)
- [文档](https://normalmapgenerator.io/docs)
- [教程](https://normalmapgenerator.io/tutorials)
- [博客](https://normalmapgenerator.io/blog)

---

**开发者**: NormalMapGenerator.io Team  
**最后更新**: 2026-01-01
