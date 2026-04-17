#!/bin/bash

# 清理多余的backend进程，只保留一个

echo "清理多余的Backend进程..."
echo ""

# 显示当前运行的backend进程
echo "当前运行的backend进程:"
ps aux | grep "node.*pet-keeper-backend" | grep -v grep | awk '{print $2, $11, $12, $13}'
echo ""

# 统计进程数量
process_count=$(ps aux | grep "node.*pet-keeper-backend" | grep -v grep | wc -l)
echo "发现 $process_count 个backend进程"

if [ "$process_count" -gt 1 ]; then
    echo ""
    echo "⚠️  多个backend进程可能导致端口冲突"
    echo ""

    # 找出监听3001端口的主进程
    main_process=$(lsof -i :3001 -t | head -1)

    if [ -n "$main_process" ]; then
        echo "主进程 (监听3001端口): PID $main_process"
        echo ""

        # 获取所有backend进程PID
        all_pids=$(ps aux | grep "node.*pet-keeper-backend" | grep -v grep | awk '{print $2}')

        echo "停止其他backend进程..."
        for pid in $all_pids; do
            if [ "$pid" != "$main_process" ]; then
                echo "停止进程 $pid"
                kill $pid 2>/dev/null
            fi
        done

        sleep 2

        # 再次检查
        remaining=$(ps aux | grep "node.*pet-keeper-backend" | grep -v grep | wc -l)
        echo ""
        echo "清理完成，剩余进程: $remaining"

        if [ "$remaining" -eq 1 ]; then
            echo "✅ 成功！只保留一个backend进程"
            echo ""
            echo "验证端口3001:"
            lsof -i :3001 | head -5
        else
            echo "⚠️  清理可能不完整，请手动检查"
        fi
    else
        echo "❌ 未找到监听3001端口的主进程"
        echo "建议手动停止所有backend进程后重启"
    fi
else
    echo ""
    echo "✅ 只有一个backend进程运行，无需清理"
fi

echo ""
echo "建议:"
echo "1. 在微信开发者工具中重新编译小程序"
echo "2. 重新尝试登录"