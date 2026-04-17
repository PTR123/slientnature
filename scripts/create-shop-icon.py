#!/usr/bin/env python3
"""
创建新的商城图标 - 购物袋风格
"""

from PIL import Image, ImageDraw

def create_shop_icon():
    # 创建81x81的图标（小程序tabbar标准尺寸）
    size = 81
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # 购物袋设计
    # 中心点
    center_x = size // 2
    center_y = size // 2

    # 购物袋主体（梯形形状）
    bag_width = 40
    bag_height = 35
    bag_top = center_y - 10

    # 绘制购物袋主体
    # 左边：从顶部到底部
    draw.polygon([
        (center_x - bag_width//2, bag_top),  # 左上
        (center_x - bag_width//2 + 5, bag_top + bag_height),  # 左下
        (center_x + bag_width//2 - 5, bag_top + bag_height),  # 右下
        (center_x + bag_width//2, bag_top),  # 右上
    ], outline=(138, 138, 138, 255), fill=None)

    # 绘制购物袋把手（U形）
    handle_width = 20
    handle_height = 15
    # 左把手
    draw.arc(
        [center_x - handle_width//2, bag_top - handle_height,
         center_x + handle_width//2, bag_top + 2],
        start=0, end=180,
        fill=(138, 138, 138, 255),
        width=3
    )

    # 保存normal状态图标（灰色）
    img.save('/Users/mac/zrby/pet-keeper-miniprogram/assets/tabbar/shop-normal.png', 'PNG')

    # 创建selected状态图标（绿色）
    img_selected = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw_selected = ImageDraw.Draw(img_selected)

    # 绘制购物袋主体（绿色）
    draw_selected.polygon([
        (center_x - bag_width//2, bag_top),
        (center_x - bag_width//2 + 5, bag_top + bag_height),
        (center_x + bag_width//2 - 5, bag_top + bag_height),
        (center_x + bag_width//2, bag_top),
    ], outline=(74, 120, 74, 255), fill=None)

    # 绘制把手（绿色）
    draw_selected.arc(
        [center_x - handle_width//2, bag_top - handle_height,
         center_x + handle_width//2, bag_top + 2],
        start=0, end=180,
        fill=(74, 120, 74, 255),
        width=3
    )

    # 保存selected状态图标
    img_selected.save('/Users/mac/zrby/pet-keeper-miniprogram/assets/tabbar/shop-selected.png', 'PNG')

    print("商城图标已创建完成！")
    print("- shop-normal.png: 灰色购物袋")
    print("- shop-selected.png: 绿色购物袋")

if __name__ == '__main__':
    try:
        create_shop_icon()
    except ImportError:
        print("需要安装PIL库: pip install Pillow")
        # 如果没有PIL，使用替代方案
        print("正在使用替代方案...")

        # 创建简单的SVG然后转换（如果PIL不可用）
        import os

        # 直接使用ImageMagick或其他工具
        # 这里我们使用一个简单的纯色块作为临时方案

        # 创建normal图标（灰色）
        os.system("""
convert -size 81x81 xc:transparent \
  -fill '#8a8a8a' -draw "polygon 20,30 25,65 55,65 60,30" \
  -stroke '#8a8a8a' -strokewidth 3 -draw "arc 30,15 50,32 0,180" \
  /Users/mac/zrby/pet-keeper-miniprogram/assets/tabbar/shop-normal.png
        """)

        # 创建selected图标（绿色）
        os.system("""
convert -size 81x81 xc:transparent \
  -fill '#4a784a' -draw "polygon 20,30 25,65 55,65 60,30" \
  -stroke '#4a784a' -strokewidth 3 -draw "arc 30,15 50,32 0,180" \
  /Users/mac/zrby/pet-keeper-miniprogram/assets/tabbar/shop-selected.png
        """)

        print("使用ImageMagick创建了临时图标")