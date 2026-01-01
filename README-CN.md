# Normal Map Generator - 本地运行指南

## 🚀 快速启动

### 方法1: 使用批处理文件(推荐)
1. 双击运行 `start-server.bat`
2. 在浏览器中访问 `http://localhost:8000`

### 方法2: 手动启动服务器
在项目目录下打开命令行,运行以下命令之一:

**使用Python:**
```bash
python -m http.server 8000
```

**使用Node.js (需要先安装http-server):**
```bash
npx http-server -p 8000
```

然后在浏览器访问: `http://localhost:8000`

## ❓ 为什么需要本地服务器?

直接双击打开 `index.html` 会导致浏览器使用 `file://` 协议,这会触发CORS安全限制,导致:
- ❌ 3D预览区域无法加载环境贴图(显示黑屏)
- ❌ JavaScript控制台出现CORS错误

使用本地HTTP服务器可以完美解决这个问题!

## 📋 功能说明

### 主要功能
1. **Normal Map生成** - 从高度图生成法线贴图
2. **Displacement Map** - 位移贴图生成
3. **Ambient Occlusion** - 环境光遮蔽贴图
4. **Specular Map** - 高光贴图
5. **批处理模式** - 一次处理多个文件
6. **从照片生成** - 使用4张不同光照角度的照片生成法线贴图

### 三个预览区域
1. **左侧** - HeightMap输入区(拖放高度图)
2. **中间** - 生成的贴图预览(Normal/Displacement/AO/Specular)
3. **右侧** - 3D实时预览(需要HTTP服务器才能正常工作)

## 🎯 商业化建议

你提到购买了 `NormalMapGenerator.io` 域名,以下是超越竞争对手的建议:

### 1. SEO优化
- ✅ 添加更多长尾关键词页面
- ✅ 创建教程和使用指南
- ✅ 添加博客内容(如"如何为Unity创建法线贴图")
- ✅ 优化页面加载速度
- ✅ 添加Schema.org结构化数据

### 2. 功能增强
- 🔥 添加更多预设模板
- 🔥 支持更多文件格式
- 🔥 添加历史记录功能
- 🔥 云端保存功能(可选)
- 🔥 AI增强的法线贴图生成

### 3. 用户体验
- 💡 更现代化的UI设计
- 💡 添加中文等多语言支持
- 💡 移动端优化
- 💡 添加视频教程
- 💡 社区分享功能

### 4. 盈利策略
- 💰 Google AdSense广告位优化
- 💰 高级功能付费订阅
- 💰 API服务
- 💰 联盟营销(推荐相关工具)

## 🔗 相关资源

- 原项目: https://github.com/cpetry/NormalMap-Online
- 在线演示: https://cpetry.github.io/NormalMap-Online/
- 竞争对手: https://normalmaponline.com

## 📝 许可证

MIT License - 可商用
