# 云小农智慧校园小程序 - UI组件库与交互规范

## 📦 Material Design 3 组件库

### 1. 按钮系统 (Buttons)

#### Filled Button (主要按钮)
```html
<button class="btn-primary">确认</button>
```
- **使用场景**: 主要操作、表单提交
- **样式**: 
  - 背景: `var(--md-primary)`
  - 文字: `var(--md-on-primary)`
  - 圆角: `var(--radius-full)`
  - 阴影: `var(--elevation-2)`
- **交互**: 
  - 点击缩放: `scale(0.96)`
  - 阴影降低: `elevation-1`

#### Tonal Button (次要按钮)
```html
<button class="btn-secondary">取消</button>
```
- **使用场景**: 次要操作、辅助功能
- **样式**:
  - 背景: `var(--md-secondary-container)`
  - 文字: `var(--md-on-secondary-container)`

#### Outlined Button (描边按钮)
```html
<button class="btn-outlined">查看详情</button>
```
- **使用场景**: 低优先级操作
- **样式**:
  - 边框: `2rpx solid var(--md-outline)`
  - 背景: `transparent`

#### FAB (浮动操作按钮)
```html
<view class="fab" bindtap="goPublish">
  <text class="fab-icon">+</text>
</view>
```
- **使用场景**: 页面主要操作（发布、添加）
- **位置**: 右下角固定
- **样式**:
  - 尺寸: `112rpx × 112rpx`
  - 背景: `var(--md-primary-container)`
  - 圆角: `var(--radius-xl)`
  - 阴影: `var(--elevation-3)`
- **动画**:
  - 进入: `spring` 弹跳
  - 点击: `scale(0.9) rotate(90deg)`

---

### 2. 卡片系统 (Cards)

#### Elevated Card (标准卡片)
```html
<view class="card">
  <text>卡片内容</text>
</view>
```
- **使用场景**: 列表项、信息展示
- **样式**:
  - 背景: `var(--md-surface-container-low)`
  - 圆角: `var(--radius-lg)`
  - 阴影: `var(--elevation-1)`
- **交互**: 
  - 点击上浮: `translateY(-2rpx)`
  - 顶部渐变线显示

#### Glass Card (毛玻璃卡片)
```html
<view class="glass-card">
  <text>创意内容</text>
</view>
```
- **使用场景**: 首页、个人中心等高颜值页面
- **样式**:
  - 背景: `rgba(255,255,255,0.75)`
  - 模糊: `backdrop-filter: blur(24px)`
  - 边框: `1rpx solid rgba(255,255,255,0.5)`
- **特效**:
  - 悬停光扫过效果
  - 点击缩放反馈

#### Morphing Card (变形卡片)
```html
<view class="morph-card">
  <text>创意展示</text>
</view>
```
- **使用场景**: 特色功能、推荐内容
- **动画**: 
  - `morphing` 8s 无限循环
  - border-radius 动态变化
- **装饰**: 旋转渐变背景

#### Glow Card (发光卡片)
```html
<view class="glow-card">
  <text>重要提示</text>
</view>
```
- **使用场景**: 公告、提醒
- **动画**: `glow` 3s 脉冲发光
- **特效**: 渐变边框

---

### 3. 表单系统 (Inputs)

#### Text Field (文本输入框)
```html
<input class="form-input" placeholder="请输入内容" />
```
- **样式**:
  - 背景: `var(--md-surface-container-low)`
  - 圆角: `var(--radius-md)`
  - 内边距: `24rpx 28rpx`
- **焦点状态**:
  - 边框变色: `var(--md-primary)`
  - 外发光: `0 0 0 6rpx rgba(46,125,50,0.1)`

#### Picker (选择器)
```html
<picker mode="selector" range="{{categories}}" bindchange="onSelect">
  <view class="form-picker">{{selected}}</view>
</picker>
```
- **使用场景**: 分类选择、日期选择

#### Switch (开关)
```html
<switch checked="{{enabled}}" color="{{primaryColor}}" />
```

---

### 4. 导航系统 (Navigation)

#### Tab Bar (标签栏)
```html
<view class="custom-tabbar">
  <view class="tab-item {{active===0?'active':''}}" data-index="0">
    <text class="tab-icon">🏠</text>
    <text class="tab-label">首页</text>
  </view>
  <!-- 更多tab... -->
</view>
```
- **样式**:
  - 高度: `120rpx`
  - 背景: `var(--md-surface-container-low)`
  - 模糊: `backdrop-filter: blur(20px)`
- **激活态**:
  - 图标放大+上移
  - 文字变色加粗
  - 涟漪扩散效果

#### Chips (筛选标签)
```html
<scroll-view class="tag-scroll" scroll-x>
  <view class="news-tag {{active?'active':''}}">
    <text>全部</text>
  </view>
</scroll-view>
```
- **样式**:
  - 圆角: `var(--radius-full)`
  - 边框: `1rpx solid var(--md-outline-variant)`
- **激活态**: 背景主色，文字白色

---

### 5. 反馈组件 (Feedback)

#### Toast (轻提示)
```javascript
wx.showToast({
  title: '操作成功',
  icon: 'success',
  duration: 2000
})
```

#### Dialog (对话框)
```html
<view class="modal" wx:if="{{showDialog}}">
  <view class="modal-box">
    <text class="modal-title">确认删除？</text>
    <view class="modal-btns">
      <button class="modal-cancel">取消</button>
      <button class="modal-confirm">确定</button>
    </view>
  </view>
</view>
```
- **动画**: 
  - 背景淡入: `fadeIn`
  - 盒子缩放: `scaleIn` cubic-bezier(0.34, 1.56, 0.64, 1)

#### Skeleton (骨架屏)
```html
<view class="shimmer-card">
  <view class="skeleton-line"></view>
  <view class="skeleton-line short"></view>
</view>
```
- **动画**: `shimmer` 1.5s 无限循环

---

## 🎯 交互设计规范

### 1. 手势交互

#### 点击 (Tap)
- **反馈**: `scale(0.96)` 或 `scale(0.95)`
- **时长**: 150ms
- **缓动**: `cubic-bezier(0.4, 0, 0.2, 1)`

#### 长按 (Long Press)
- **触发**: 500ms
- **反馈**: 震动 + 菜单弹出
- **应用**: 消息复制、卡片操作

#### 滑动 (Swipe)
- **首页**: 三屏左右滑动
- **列表**: 左滑删除/右滑完成
- **阈值**: 50rpx

#### 下拉刷新 (Pull Down)
- **触发**: 下拉 > 80rpx
- **动画**: 加载图标旋转
- **回调**: `onPullDownRefresh()`

---

### 2. 转场动画

#### 页面进入
```css
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30rpx); }
  to { opacity: 1; transform: translateY(0); }
}
```
- **时长**: 300ms
- **缓动**: `cubic-bezier(0.4, 0, 0.2, 1)`

#### 卡片进入
```css
@keyframes cardEnter {
  from { opacity: 0; transform: translateY(40rpx) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
```
- **时长**: 400ms
- **交错延迟**: 每项50ms

#### 模态框弹出
```css
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9) translateY(20rpx); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
```
- **时长**: 300ms
- **弹性**: `cubic-bezier(0.34, 1.56, 0.64, 1)`

---

### 3. 微交互细节

#### 按钮涟漪
```css
.tab-item::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(46,125,50,0.1) 0%, transparent 70%);
  transition: all 0.4s ease;
}
.tab-item:active::before {
  width: 120rpx;
  height: 120rpx;
}
```

#### 图标旋转
```css
.menu-item:active .menu-icon {
  transform: scale(1.1) rotate(-5deg);
}
```

#### 箭头位移
```css
.news-card:active .news-card-arrow {
  transform: translateX(4rpx);
}
```

#### 数字跳动
```css
.stat:active .stat-num {
  transform: scale(1.15);
  color: var(--md-tertiary);
}
```

---

## 📐 布局规范

### 1. 页面结构
```
┌─────────────────────┐
│   Top App Bar       │ ← 64-88rpx
├─────────────────────┤
│                     │
│   Content Area      │ ← flex: 1
│                     │
├─────────────────────┤
│   Bottom Nav        │ ← 120rpx + safe-area
└─────────────────────┘
```

### 2. 卡片间距
- **左右边距**: `24rpx` (标准页边距)
- **上下间距**: `16rpx` (卡片间)
- **内边距**: `28rpx` (卡片内容)

### 3. 网格布局
```css
.func-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  padding: 24rpx;
}
```

---

## 🎨 色彩应用场景

### Primary (#2E7D32) 使用
✅ 主要按钮  
✅ 激活Tab  
✅ 链接文字  
✅ 图标高亮  
✅ 进度条  

### Primary Container (#B8EFC1) 使用
✅ FAB背景  
✅ 卡片强调  
✅ 标签背景  
✅ 悬浮层  

### Error (#BA1A1A) 使用
✅ 错误提示  
✅ 删除按钮  
✅ 危险操作  
✅ 表单验证失败  

### Surface 层级
```
Surface Container Lowest: #FFFFFF (最高层)
Surface Container Low: #F7F8EF (卡片)
Surface Container: #F1F2EA (标准)
Surface Container High: #EBECE4 (输入框)
Surface Container Highest: #E5E7DE (分隔)
```

---

## ⚡ 性能优化建议

### 1. 图片优化
- **格式**: WebP优先
- **尺寸**: 不超过200KB
- **懒加载**: `lazy-load` 属性
- **占位**: 骨架屏

### 2. 列表优化
- **虚拟滚动**: 超过50项启用
- **分页加载**: 每页20条
- **防抖搜索**: 300ms延迟

### 3. 存储优化
- **定期清理**: 过期数据删除
- **压缩存储**: JSON.stringify前压缩
- **监控容量**: 超过8MB警告

### 4. 动画优化
- **使用transform**: 避免top/left
- **will-change**: 提前声明
- **减少重绘**: 合并样式变更

---

## ♿ 无障碍设计

### 1. 对比度
- **正文**: 至少4.5:1
- **大字**: 至少3:1
- **图标**: 至少3:1

### 2. 触摸目标
- **最小尺寸**: 88rpx × 88rpx
- **间距**: 至少16rpx

### 3. 语音朗读
```html
<view aria-label="删除待办事项" role="button">
  <text>🗑️</text>
</view>
```

---

## 📱 响应式断点

### 手机 (< 750rpx)
- 单列布局
- 全宽卡片
- 底部导航

### 平板 (≥ 750rpx) - 未来扩展
- 双列布局
- 侧边导航
- 更大字体

---

## 🧪 测试清单

### UI测试
- [ ] 所有按钮点击有反馈
- [ ] 卡片阴影正确显示
- [ ] 文字无截断
- [ ] 图片无变形
- [ ] 弹窗居中显示

### 交互测试
- [ ] 滑屏流畅无卡顿
- [ ] 表单验证准确
- [ ] 跳转逻辑正确
- [ ] 返回键正常
- [ ] 下拉刷新有效

### 兼容性测试
- [ ] iOS正常显示
- [ ] Android正常显示
- [ ] 刘海屏适配
- [ ] 深色模式(未来)

---

**版本**: v2.0  
**设计系统**: Material Design 3  
**更新时间**: 2026-06-01  
**维护者**: 云小农开发团队
