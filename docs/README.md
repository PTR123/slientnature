# PetKeeper 项目文档

欢迎来到 PetKeeper 项目文档中心！

## 📚 文档导航

### 🚀 快速开始
- [开始指南](guides/START_GUIDE.md) - 项目启动和基础配置
- [Android安装](guides/ANDROID_INSTALL.md) - Android应用安装指南
- [Android快速开始](guides/ANDROID_QUICK_START.md) - Android开发快速指南

### 📐 架构设计
- [业务结构](architecture/BUSINESS_STRUCTURE.md) - 业务模块和功能设计
- [后端API需求](architecture/BACKEND_API_REQUIREMENTS.md) - API设计规范
- [功能特性](architecture/FEATURES.md) - 项目功能列表
- [商城设计](architecture/SHOP_DESIGN.md) - 商城功能设计文档
- [项目Review](architecture/PROJECT_REVIEW.md) - 项目架构与代码审查报告

### 🚢 部署指南
- [部署指南](guides/DEPLOYMENT_GUIDE.md) - 完整部署流程
- [快速部署](guides/QUICK_DEPLOY_GUIDE.md) - 快速部署步骤
- [部署检查清单](guides/DEPLOYMENT_CHECKLIST.md) - 部署前检查项
- [云部署步骤](guides/CLOUD_DEPLOY_STEPS.md) - 云服务器部署
- [私有服务器部署](guides/PRIVATE_SERVER_DEPLOYMENT.md) - 私有服务器详细指南
- [私有服务器快速指南](guides/PRIVATE_SERVER_QUICK_GUIDE.md) - 私有服务器快速部署
- [Web部署指南](guides/DEPLOY_WEB_GUIDE.md) - Web应用部署
- [部署到新仓库](guides/DEPLOY_TO_NEW_REPO.md) - 仓库迁移指南

### 🧪 测试与调试
- [登录调试](guides/DEBUG_LOGIN.md) - 登录问题排查
- [支付测试指南](guides/PAYMENT_TEST_GUIDE.md) - 支付功能测试
- [测试脚本](guides/test-payment.sh) - 支付测试脚本
- [全功能测试脚本](guides/test-all-features.sh) - 自动化测试脚本

### 👨‍💼 管理员指南
- [管理员指南](guides/ADMIN_GUIDE.md) - 管理后台使用
- [管理员订单管理](reports/ADMIN_ORDER_MANAGEMENT_REPORT.md) - 订单管理功能

### 💳 支付功能
- [支付集成指南](guides/PAYMENT_INTEGRATION_GUIDE.md) - 支付功能实现
- [支付沙箱完成报告](reports/PAYMENT_SANDBOX_COMPLETION_REPORT.md) - 沙箱测试报告

### 📊 测试报告
- [测试报告](reports/TEST_REPORT.md) - 功能测试详细报告
- [最终测试总结](reports/FINAL_TEST_SUMMARY.md) - 项目完整测试总结
- [商城测试报告](reports/SHOP_TEST_REPORT.md) - 商城功能测试
- [代码审查](reports/CODE_REVIEW.md) - 代码质量审查
- [执行总结](reports/EXECUTION_SUMMARY.md) - 项目执行总结
- [任务完成报告](reports/TASK_COMPLETION_REPORT.md) - 任务完成情况
- [商城实现总结](reports/SHOP_IMPLEMENTATION_SUMMARY.md) - 商城实现报告
- [当前状态](reports/CURRENT_STATUS.md) - 项目当前状态

### 📝 其他
- [更新日志](UPDATE_LOG.md) - 项目更新记录
- [已开始](STARTED.md) - 项目启动记录

---

## 🗂️ 目录结构

```
docs/
├── README.md              # 本文档
├── guides/                # 使用指南
│   ├── START_GUIDE.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── PAYMENT_TEST_GUIDE.md
│   └── ...
├── architecture/          # 架构设计
│   ├── BUSINESS_STRUCTURE.md
│   ├── PROJECT_REVIEW.md
│   └── ...
└── reports/              # 测试报告
    ├── TEST_REPORT.md
    ├── FINAL_TEST_SUMMARY.md
    └── ...
```

---

## 🔗 快速链接

### 开发环境
- 前端: http://localhost:3003
- 后端: http://localhost:3001
- 管理后台: http://localhost:3003/admin

### 测试账号
- 管理员: admin@test.com / admin123
- 普通用户: user@test.com / user123

### 主要功能
- ✅ 用户认证 (JWT)
- ✅ 宠物管理
- ✅ 商城购物
- ✅ 订单系统
- ✅ 支付功能 (沙箱测试)
- ✅ 管理后台

---

**最后更新**: 2026-03-31