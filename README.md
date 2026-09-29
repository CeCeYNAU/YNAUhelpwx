# 云小农智慧校园小程序 - 完整界面与UI文档

> 🌾 基于 Material Design 3 设计系统的微信小程序  
> 📱 26个页面 · 100+交互节点 · 完整UI组件库  
> 🎨 Liquid Glass + Material You 创意融合

---

## 📋 目录

- [项目概述](#项目概述)
- [界面清单](#界面清单)
- [设计系统](#设计系统)
- [交互流程](#交互流程)
- [组件库](#组件库)
- [开发指南](#开发指南)
- [上线准备](#上线准备)

---

## 项目概述

### 核心特性
- ✨ **Material Design 3**: 现代化设计语言
- 🎨 **Liquid Glass**: 毛玻璃视觉效果
- 🌈 **Material You**: 动态色彩系统
- ⚡ **流畅动画**: cubic-bezier 缓动曲线
- 📦 **本地存储**: Serverless-like 架构
- 🤖 **AI助手**: 智能关键词问答

### 技术栈
```
微信小程序
├─ 前端框架: 原生WXML/WXSS/JS
├─ 数据存储: LocalStorage (10MB限制)
├─ UI系统: Material Design 3
├─ 动画: CSS3 Transitions & Animations
└─ API: 录音、定位、图片上传
```

---

## 界面清单

### 🏗️ 核心页面 (4个)

| 页面 | 路径 | 功能描述 | UI特色 |
|------|------|----------|--------|
| 🔐 登录页 | `/pages/login/login` | 双模式登录 | 渐变背景、浮动装饰 |
| 🏠 首页 | `/pages/index/index` | 三屏滑动 | Swiper、毛玻璃卡片 |
| 👤 个人中心 | `/pages/profile/profile` | 用户管理 | Material You大卡片 |
| 🌾 校园生活 | `/pages/campus/campus` | 服务聚合 | 网格布局 |

### 📦 六大功能模块 (18个页面)

#### 1️⃣ 待办事项 Todo
- **列表页** `/pages/todo/todo` - 筛选器、FAB按钮
- **发布页** `/pages/todoPublish/todoPublish` - 表单输入

#### 2️⃣ 失物招领 LostFound
- **列表页** `/pages/lostfound/lostfound` - 分类标签
- **详情页** `/pages/lostfoundDetail/lostfoundDetail` - 联系功能
- **发布页** `/pages/lostfoundPublish/lostfoundPublish` - 图片上传

#### 3️⃣ 课程表 Course
- **课表页** `/pages/course/course` - 周视图、时间轴

#### 4️⃣ 校园论坛 Forum
- **列表页** `/pages/forum/forum` - 帖子列表
- **详情页** `/pages/forumDetail/forumDetail` - 评论点赞
- **发帖页** `/pages/forumPublish/forumPublish` - 富文本编辑

#### 5️⃣ 校园活动 Activities
- **列表页** `/pages/activities/activities` - 状态标签
- **详情页** `/pages/activityDetail/activityDetail` - 报名功能
- **发布页** `/pages/activityPublish/activityPublish` - 活动创建

#### 6️⃣ 校园风景 Scenery
- **列表页** `/pages/scenery/scenery` - 瀑布流
- **详情页** `/pages/sceneryDetail/sceneryDetail` - 大图展示
- **发布页** `/pages/sceneryPublish/sceneryPublish` - 照片上传

### 🛠️ 辅助功能 (4个页面)

- 💬 **AI助手** `/pages/chat/chat`
- 📰 **资讯分类** `/pages/newsCategory/newsCategory`
- 📄 **资讯详情** `/pages/newsDetail/newsDetail`
- 🎙️ **语音地图** `/pages/voiceMap/voiceMap`
- 📚 **学习打卡** `/pages/study/study` + `StudyPublish`
- 🗺️ **校园地图** `/pages/campusMap/campusMap`

---

## 设计系统

### 🎨 色彩系统

#### Primary Colors
```css
--md-primary: #2E7D32          /* 农大绿 */
--md-on-primary: #FFFFFF
--md-primary-container: #B8EFC1
--md-on-primary-container: #002106
```

#### Secondary Colors
```css
--md-secondary: #52634F
--md-tertiary: #D4A017         /* 金黄 */
--md-error: #BA1A1A
```

#### Surface Colors
```css
--md-background: #FDFCF5
--md-surface: #FDFCF5
--md-surface-container-low: #F7F8EF
--md-surface-container: #F1F2EA
```

### 📐 圆角系统

```
radius-xs:    4rpx   (微小)
radius-sm:    8rpx   (小)
radius-md:    12rpx  (中)
radius-lg:    16rpx  (大)
radius-xl:    24rpx  (超大)
radius-xxl:   32rpx  (特大)
radius-full:  9999rpx (圆形)
```

### 🌊 阴影层级 (Elevation)

```
elevation-1: 卡片默认      (0 1rpx 3rpx ...)
elevation-2: 卡片悬停/按钮  (0 3rpx 6rpx ...)
elevation-3: FAB按钮        (0 10rpx 20rpx ...)
elevation-4: 下拉菜单       (0 15rpx 25rpx ...)
elevation-5: 模态框         (0 20rpx 40rpx ...)
```

### ✨ 动画系统

#### 进入动画
```css
@keyframes cardEnter {
  from { opacity: 0; transform: translateY(40rpx) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
/* 时长: 400ms, 缓动: cubic-bezier(0.4, 0, 0.2, 1) */
```

#### 交互动画
```css
.button:active {
  transform: scale(0.96);
  transition: all 0.15s ease;
}
```

#### 创意动画
- **float**: 浮动表情粒子 (3s infinite)
- **morphing**: 变形卡片 (8s infinite)
- **glow**: 发光效果 (3s infinite)
- **shimmer**: 闪光加载 (1.5s infinite)

---

## 交互流程

### 🔄 主要用户旅程

```
启动应用
  ↓
检查登录状态
  ├─ 未登录 → 登录页 → 验证 → 保存 → 首页
  └─ 已登录 → 首页
              ↓
        三屏滑动切换
        ├─ 右滑: 校园日报 → 浏览资讯
        ├─ 中屏: AI助手 → 智能问答
        └─ 左滑: 功能大厅 → 选择功能
                        ↓
                  六大模块
                  ├─ 待办事项
                  ├─ 失物招领
                  ├─ 课程表
                  ├─ 校园论坛
                  ├─ 校园活动
                  └─ 校园风景
```

### 📊 数据流向

```
LocalStorage
  ├─ userTodos[] ←→ Todo模块
  ├─ lostList[] ←→ LostFound模块
  ├─ courseList[] ←→ Course模块
  ├─ forumPosts[] ←→ Forum模块
  ├─ activityList[] ←→ Activities模块
  ├─ sceneryList[] ←→ Scenery模块
  ├─ userInfo ←→ Profile/Login
  └─ boundUsers[] ←→ Login验证
```

---

## 组件库

### 🔘 按钮系统

| 类型 | 类名 | 使用场景 |
|------|------|----------|
| Filled Button | `.btn-primary` | 主要操作 |
| Tonal Button | `.btn-secondary` | 次要操作 |
| Outlined Button | `.btn-outlined` | 低优先级 |
| Text Button | `.btn-text` | 文本链接 |
| FAB | `.fab` | 浮动添加 |

### 🃏 卡片系统

| 类型 | 类名 | 特效 |
|------|------|------|
| Elevated Card | `.card` | 阴影凸起 |
| Filled Card | `.filled-card` | 填充背景 |
| Outlined Card | `.outlined-card` | 描边 |
| Glass Card | `.glass-card` | 毛玻璃 |
| Morphing Card | `.morph-card` | 变形动画 |
| Glow Card | `.glow-card` | 发光脉冲 |

### 📝 表单系统

- **Text Field**: `.form-input` - 文本输入
- **Picker**: `.form-picker` - 选择器
- **Select**: `.form-select` - 下拉框
- **Switch**: `<switch>` - 开关

### 🧭 导航系统

- **Tab Bar**: `.custom-tabbar` - 底部导航
- **Chips**: `.news-tag` - 筛选标签
- **Top App Bar**: `.top-app-bar` - 顶部栏

---

## 开发指南

### 🚀 快速开始

1. **克隆项目**
```bash
git clone <repository-url>
cd ynau
```

2. **导入微信开发者工具**
   - 打开微信开发者工具
   - 导入项目目录
   - 填写AppID: `wx89e651adceea8fdf`

3. **运行预览**
   - 点击编译
   - 在模拟器中查看

### 📁 目录结构

```
ynau/
├── pages/              # 页面目录
│   ├── index/         # 首页
│   ├── login/         # 登录页
│   ├── profile/       # 个人中心
│   ├── todo/          # 待办模块
│   ├── lostfound/     # 失物招领
│   ├── course/        # 课程表
│   ├── forum/         # 论坛
│   ├── activities/    # 活动
│   ├── scenery/       # 风景
│   └── ...
├── components/         # 组件
├── utils/             # 工具函数
├── constants/         # 常量数据
├── images/            # 图片资源
├── docs/              # 文档
│   ├── 界面交互图模型.md
│   ├── 界面关系图-Mermaid.md
│   └── UI组件库与交互规范.md
├── app.js             # 应用入口
├── app.json           # 全局配置
├── app.wxss           # 全局样式 (MD3)
└── project.config.json
```

### 🎨 样式开发规范

#### 使用Material Design变量
```css
.my-card {
  background: var(--md-surface-container-low);
  border-radius: var(--radius-lg);
  box-shadow: var(--elevation-1);
  color: var(--md-on-surface);
}
```

#### 添加动画
```css
.my-element {
  animation: cardEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.my-button:active {
  transform: scale(0.96);
  transition: transform 0.15s ease;
}
```

#### 响应式单位
```css
/* 使用rpx */
.container {
  padding: 24rpx;
  font-size: 28rpx;
}
```

### 💾 数据存储规范

#### 读取数据
```javascript
const todos = wx.getStorageSync('userTodos') || [];
```

#### 保存数据
```javascript
wx.setStorageSync('userTodos', todos);
```

#### 安全封装
```javascript
// app.js
safeGet(key, defaultValue) {
  try {
    return wx.getStorageSync(key) || defaultValue;
  } catch (e) {
    console.error('读取失败:', e);
    return defaultValue;
  }
}
```

---

## 上线准备

### ✅ 功能检查清单

#### 核心功能
- [x] 双模式登录（微信授权 + 学号密码）
- [x] 三屏滑动首页
- [x] AI智能问答
- [x] 待办事项CRUD
- [x] 失物招领发布
- [x] 课程表管理
- [x] 论坛发帖评论
- [x] 活动报名参与
- [x] 风景照片上传
- [x] 语音录音播放

#### UI/UX
- [x] Material Design 3 设计系统
- [x] 统一色彩规范
- [x] 流畅动画过渡
- [x] 空状态处理
- [x] 加载状态
- [x] 错误提示
- [x] 下拉刷新

#### 性能优化
- [ ] 图片压缩 (< 200KB)
- [ ] 懒加载实现
- [ ] 存储清理机制
- [ ] 10MB监控警告

### 📋 微信小程序审核要求

#### 必需配置
1. **隐私协议** - 在app.json中添加
2. **用户授权** - 位置、录音、相册
3. **内容审核** - 论坛/活动需接入API
4. **客服联系方式**

#### app.json 配置
```json
{
  "permission": {
    "scope.userLocation": {
      "desc": "用于显示您在校园中的位置"
    },
    "scope.record": {
      "desc": "用于语音打卡功能"
    },
    "scope.writePhotosAlbum": {
      "desc": "用于保存校园风景照片"
    }
  },
  "requiredPrivateInfos": [
    "getLocation",
    "chooseLocation",
    "startRecord",
    "saveImageToPhotosAlbum"
  ]
}
```

### 🚀 发布流程

1. **代码审核**
   - 运行eslint检查
   - 测试所有功能
   - 修复已知bug

2. **上传代码**
   - 微信开发者工具 → 上传
   - 填写版本号
   - 提交审核

3. **审核通过**
   - 等待微信审核 (1-7天)
   - 审核通过后发布

---

## 📚 相关文档

- [📱 界面交互图模型](./docs/界面交互图模型.md) - 完整的页面关系和交互流程
- [🎨 界面关系图-Mermaid](./docs/界面关系图-Mermaid.md) - 可视化图表
- [🧩 UI组件库与交互规范](./docs/UI组件库与交互规范.md) - 详细组件文档

---

## 🎯 后续优化方向

### 短期 (1-2周)
- [ ] 完善所有页面Material Design 3样式
- [ ] 添加更多创意动画效果
- [ ] 优化性能和加载速度
- [ ] 补充单元测试

### 中期 (1个月)
- [ ] 接入云开发 (Cloud Base)
- [ ] 实现实时消息推送
- [ ] 添加深色模式
- [ ] 平板适配

### 长期 (3个月+)
- [ ] AI模型升级 (接入大语言模型)
- [ ] 社交功能增强
- [ ] 数据分析后台
- [ ] 多校区支持

---

## 📞 联系方式

- **项目名称**: 云小农智慧校园小程序
- **版本**: v2.0.0 (Material Design 3)
- **技术栈**: 微信小程序 + LocalStorage
- **设计系统**: Material Design 3
- **总页面数**: 26个
- **开发团队**: 云小农开发组

---

<div align="center">

**🌾 让校园生活更智慧 🌾**

Made with ❤️ using Material Design 3

</div>
