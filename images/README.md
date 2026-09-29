# 图片资源目录

## 用途
本文件夹用于存放微信小程序的图片资源文件。

## 必需图片资源
请确保以下图片已放入此目录：

### 核心图标
- **star_icon.png**: 收藏/星级图标（用于留声机、地图标记等）
- **default_avatar.png**: 默认头像占位图
- **logo.png**: 应用 Logo

### 建议分类存放
```
images/
├── icons/          # 图标资源
│   └── star_icon.png
├── avatars/        # 头像资源
│   └── default_avatar.png
├── logos/          # Logo 图片
│   └── logo.png
└── others/         # 其他图片
```

## 支持格式
- .png（推荐，支持透明背景）
- .jpg/.jpeg
- .svg（部分场景支持）
- .gif（静态展示）

## 命名规范
- 使用小写字母
- 单词间用下划线分隔，例如：`icon_home.png`
- 避免使用中文和特殊字符

## 引用方式
在小程序代码中引用图片：
```javascript
// 在 wxml 中
<image src="/images/star_icon.png" mode="aspectFit" />

// 在 js 中
const avatar = '/images/default_avatar.png';

// 在 wxss 中作为背景图
.background {
  background-image: url('/images/logo.png');
}
```

## 注意事项
1. 单张图片大小建议不超过 200KB
2. 确保图片在小程序包大小限制内（总包 2MB）
3. 大图建议通过CDN 网络链接加载
4. 移除未使用的图片资源
5. 关键 UI 元素请使用可靠的在线资源作为占位符
