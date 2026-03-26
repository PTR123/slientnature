#!/bin/bash

# PetKeeper 停止所有服务

echo "🛑 停止所有 PetKeeper 服务..."

# 停止所有 Node.js 进程（pet-keeper相关）
pkill -f "pet-keeper" && echo "✅ 已停止服务"

echo "完成！所有服务已停止。"