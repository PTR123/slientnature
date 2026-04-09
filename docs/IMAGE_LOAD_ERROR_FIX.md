# 小程序图片加载错误修复

## 错误信息
```
Failed to load local image resource /images/logo.png
500 Internal Server Error
```

## 问题原因
小程序中引用了 `/images/logo.png`，但该文件不存在。

## 已修复的文件

### 1. pages/login/login.wxml
```xml
修改前: <image src="/images/logo.png" />
修改后: <image src="/images/default-product.png" />
```

### 2. pages/index/index.wxml
```xml
修改前: <image src="/images/logo.png" />
修改后: <image src="/images/default-product.png" />
```

### 3. pages/profile/profile.wxml
```xml
修改前: <image src="/images/logo.png" />
修改后: <image src="/images/default-product.png" />
```

## 可用的图片资源

当前 `/images/` 目录下的文件：
- ✅ default-product.png (默认产品图片)
- ✅ cart-icon.png (购物车图标)
- ✅ tabbar/ (标签栏图标目录)

## 后续优化建议

### 方案1: 创建正式的Logo图片
建议设计一个正式的应用Logo，规格：
- 尺寸：200x200px
- 格式：PNG (支持透明背景)
- 文件大小：< 50KB

### 方案2: 使用文字Logo
可以修改WXML，使用文字代替图片：
```xml
<view class="text-logo">自然不语</view>
```

### 方案3: 使用SVG
小程序支持SVG格式，可以创建矢量Logo：
```xml
<image src="/images/logo.svg" />
```

## 测试验证

修复后请：
1. 清除小程序缓存
2. 重新编译项目
3. 检查页面是否正常显示

## 注意事项

- 小程序图片路径以 `/` 开头表示项目根目录
- 图片文件要放在项目目录下，不能引用网络图片（除非配置域名）
- 建议图片使用相对路径或绝对路径

## 相关错误

如果还有其他图片加载失败，检查：
1. 图片文件是否存在
2. 图片路径是否正确
3. 图片格式是否支持（PNG, JPG, GIF, SVG）
4. 文件大小是否超过限制