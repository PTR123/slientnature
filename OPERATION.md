# 自然不语项目 - 快速运维命令手册

## 🚀 快速启动

### 启动所有服务
```bash
docker-compose up -d
```

### 停止所有服务
```bash
docker-compose down
```

### 重启所有服务
```bash
docker-compose restart
```

---

## 📊 查看状态

### 查看容器状态
```bash
docker-compose ps
```

### 查看资源使用
```bash
docker stats
```

### 查看日志
```bash
# 所有日志
docker-compose logs -f

# 特定服务日志
docker-compose logs -f backend
docker-compose logs -f postgres
```

---

## 🔧 服务管理

### 重启单个服务
```bash
docker-compose restart backend
docker-compose restart postgres
docker-compose restart redis
```

### 进入容器
```bash
# 进入后端容器
docker-compose exec backend sh

# 进入数据库容器
docker-compose exec postgres bash

# 进入Redis容器
docker-compose exec redis sh
```

---

## 💾 数据库操作

### 连接数据库
```bash
docker-compose exec postgres psql -U ziranbuyu -d ziranbuyu
```

### 备份数据库
```bash
./scripts/backup.sh
```

### 恢复数据库
```bash
gunzip < backups/backup_20240101_120000.sql.gz | docker-compose exec -T postgres psql -U ziranbuyu
```

### 查看数据库大小
```bash
docker-compose exec postgres psql -U ziranbuyu -c "SELECT pg_size_pretty(pg_database_size('ziranbuyu'));"
```

---

## 🔄 更新部署

### OTA更新
```bash
./scripts/ota-update.sh
```

### 手动更新步骤
```bash
git pull
docker-compose build
docker-compose down
docker-compose up -d
```

---

## 🏥 健康检查

### 完整健康检查
```bash
./scripts/health-check.sh
```

### 快速检查
```bash
# API健康
curl http://localhost:3001/api/health

# 数据库健康
docker-compose exec postgres pg_isready

# Redis健康
docker-compose exec redis redis-cli ping
```

---

## 📝 日志管理

### 查看实时日志
```bash
docker-compose logs -f --tail=100
```

### 清理旧日志
```bash
./scripts/log-manage.sh
```

### 查看错误日志
```bash
docker-compose exec backend grep "ERROR" /app/logs/error.log
```

---

## 🔐 安全操作

### 更改数据库密码
```bash
docker-compose exec postgres psql -U ziranbuyu -c "ALTER USER ziranbuyu PASSWORD 'new_password';"
```

### 更新SSL证书
```bash
certbot renew
docker-compose restart nginx
```

---

## 🐛 故障排查

### 服务无法启动
```bash
# 查看详细日志
docker-compose logs backend

# 检查端口占用
netstat -tunlp | grep 3001

# 重建容器
docker-compose up -d --force-recreate
```

### 数据库连接失败
```bash
# 检查数据库状态
docker-compose exec postgres pg_isready

# 检查连接数
docker-compose exec postgres psql -U ziranbuyu -c "SELECT count(*) FROM pg_stat_activity;"

# 重启数据库
docker-compose restart postgres
```

### 性能问题
```bash
# 查看慢查询
docker-compose exec postgres psql -U ziranbuyu -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"

# 查看连接数
docker-compose exec postgres psql -U ziranbuyu -c "SELECT count(*) FROM pg_stat_activity;"

# 清理缓存
docker-compose exec redis redis-cli FLUSHALL
```

---

## 🧹 清理操作

### 清理Docker资源
```bash
# 清理未使用的镜像
docker image prune -a

# 清理未使用的容器
docker container prune

# 清理未使用的卷
docker volume prune

# 完全清理
docker system prune -a --volumes
```

### 清理日志
```bash
./scripts/log-manage.sh
```

---

## 📦 备份恢复

### 完整备份
```bash
./scripts/backup.sh
```

### 恢复备份
```bash
# 停止服务
docker-compose down

# 恢复数据库
gunzip < backups/backup_20240101_120000.sql.gz | docker-compose exec -T postgres psql -U ziranbuyu

# 恢复文件
tar -xzf backups/uploads_20240101_120000.tar.gz -C /

# 启动服务
docker-compose up -d
```

---

## 📊 监控

### 启动监控
```bash
./scripts/monitor.sh
```

### 查看监控日志
```bash
tail -f logs/monitor.log
```

### 查看告警日志
```bash
tail -f logs/alerts.log
```

---

## 🎯 性能优化

### 数据库优化
```bash
# 分析表
docker-compose exec postgres psql -U ziranbuyu -c "ANALYZE;"

# 重建索引
docker-compose exec postgres psql -U ziranbuyu -c "REINDEX DATABASE ziranbuyu;"
```

### 清理Redis
```bash
docker-compose exec redis redis-cli FLUSHALL
```

---

## 🆘 紧急操作

### 紧急重启所有服务
```bash
docker-compose restart
```

### 紧急停止所有服务
```bash
docker-compose down
```

### 回滚到上一个版本
```bash
git reset --hard HEAD~1
docker-compose up -d --build
```

---

## 📞 获取帮助

查看详细文档:
```bash
cat DEPLOYMENT.md
```

查看配置:
```bash
docker-compose config
```