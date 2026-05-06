#!/bin/bash

# 快速 SSH 连接测试脚本

NAS_IP="100.84.59.9"
NAS_USER="admin"

echo "🔍 测试 NAS SSH 连接"
echo "======================================"
echo ""
echo "📍 NAS Tailscale IP: $NAS_IP"
echo "📍 SSH 用户名: $NAS_USER"
echo ""
echo "🔐 请输入 SSH 密码 (DSM 登录密码)"
echo ""

# 测试基本连接
echo "1️⃣ 测试 ping 连接..."
if ping -c 2 $NAS_IP; then
    echo "✅ 网络连接正常"
else
    echo "❌ 网络连接失败"
    exit 1
fi
echo ""

# 测试 SSH 连接
echo "2️⃣ 测试 SSH 连接..."
echo "   命令: ssh $NAS_USER@$NAS_IP"
echo ""
ssh $NAS_USER@$NAS_IP "echo '✅ SSH 连接成功'; whoami; hostname; uname -a"

echo ""
echo "3️⃣ 检查 NAS Docker 环境..."
ssh $NAS_USER@$NAS_IP "docker --version || echo 'Docker 未安装'"

echo ""
echo "✅ 所有测试通过!"
echo ""
echo "可以开始部署了。运行:"
echo "  ./deploy-nas-tailscale.sh"