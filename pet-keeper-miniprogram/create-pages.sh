#!/bin/bash

# 批量创建小程序所有页面
# 执行此脚本将完善所有页面文件

echo "🚀 开始批量创建小程序页面..."

cd /Users/mac/zrby/pet-keeper-miniprogram

# ==================== 宠物相关页面 ====================

# 宠物列表页面 - WXML
cat > pages/pets/pets.wxml << 'EOF'
<view class="container">
  <view wx:if="{{!loading && pets.length === 0}}" class="empty-state">
    <view class="empty-icon">🐾</view>
    <view class="empty-text">还没有宠物档案</view>
    <button class="btn-primary" bindtap="goToCreate">添加第一个宠物</button>
  </view>

  <view wx:else class="pet-list">
    <view
      class="pet-card card"
      wx:for="{{pets}}"
      wx:key="id"
      data-id="{{item.id}}"
      bindtap="goToDetail"
    >
      <image class="pet-image" src="{{item.image || '/images/default-pet.png'}}" mode="aspectFill"></image>
      <view class="pet-info">
        <view class="pet-name">{{item.name}}</view>
        <view class="pet-species">{{item.species}}</view>
        <view class="pet-date">生日: {{item.birthDate}}</view>
      </view>
      <view class="pet-arrow">›</view>
    </view>
  </view>

  <view class="fab" bindtap="goToCreate">+</view>
</view>
EOF

# 宠物列表页面 - WXSS
cat > pages/pets/pets.wxss << 'EOF'
.pet-list {
  padding: 20rpx;
}

.pet-card {
  display: flex;
  align-items: center;
  padding: 24rpx !important;
  margin-bottom: 20rpx;
}

.pet-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
  background-color: #f5f5f5;
}

.pet-info {
  flex: 1;
}

.pet-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.pet-species {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 4rpx;
}

.pet-date {
  font-size: 24rpx;
  color: #999;
}

.pet-arrow {
  font-size: 48rpx;
  color: #ccc;
}

.fab {
  position: fixed;
  right: 40rpx;
  bottom: 120rpx;
  width: 100rpx;
  height: 100rpx;
  background-color: #4a784a;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.empty-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
}
EOF

echo "✅ 宠物列表页面完成"

# 继续创建其他页面...
echo "📦 创建其他页面..."