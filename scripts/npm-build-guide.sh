#!/bin/bash

# 微信小程序 npm 依赖安装和构建指南

echo "========================================="
echo "   微信小程序 NPM 配置完成"
echo "========================================="
echo ""

echo "✅ 已完成的操作:"
echo "1. 创建 package.json"
echo "2. 安装 @babel/runtime 依赖"
echo ""

echo "📁 当前项目结构:"
ls -la | grep -E "package|node_modules|miniprogram_npm"
echo ""

echo "📦 已安装的依赖:"
if [ -d "node_modules/@babel/runtime" ]; then
    echo "✅ @babel/runtime 已安装"
    echo "   位置: node_modules/@babel/runtime"
else
    echo "❌ @babel/runtime 未安装"
    echo "   请运行: npm install"
fi
echo ""

echo "========================================="
echo "   重要：需要在微信开发者工具中操作"
echo "========================================="
echo ""

echo "🔧 下一步操作:"
echo ""
echo "步骤1: 构建npm（必须！）"
echo "  1. 在微信开发者工具中，点击菜单栏「工具」"
echo "  2. 选择「构建 npm」"
echo "  3. 等待构建完成"
echo "  4. 应该会看到成功提示"
echo ""

echo "步骤2: 检查构建结果"
echo "  项目目录下应该会生成 miniprogram_npm/ 文件夹"
echo "  结构如下:"
echo "  miniprogram_npm/"
echo "  └── @babel/"
echo "      └── runtime/"
echo ""

echo "步骤3: 重新编译项目"
echo "  1. 点击「编译」按钮"
echo "  2. 或按 Cmd+B 快捷键"
echo "  3. 查看页面是否正常显示"
echo ""

echo "步骤4: 验证修复"
echo "  在Console中执行:"
echo "  const app = getApp()"
echo "  console.log('App初始化成功')"
echo ""

echo "========================================="
echo "   故障排查"
echo "========================================="
echo ""

echo "如果构建npm失败:"
echo "  1. 确保package.json在项目根目录"
echo "  2. 确保node_modules文件夹存在"
echo "  3. 尝试：详情 → 本地设置 → 勾选「使用npm模块」"
echo "  4. 重启微信开发者工具"
echo ""

echo "如果仍然报错:"
echo "  1. 删除 miniprogram_npm 文件夹"
echo "  2. 重新执行「工具 → 构建 npm」"
echo "  3. 清除缓存并重新编译"
echo ""

echo "查看详细文档:"
echo "  docs/BABEL_RUNTIME_ERROR_FIX.md"
echo ""

echo "========================================="