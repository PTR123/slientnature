# 后端Dockerfile - 多阶段构建
FROM node:20-slim AS builder

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 安装全部依赖（包括dev）
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# 复制源代码并构建
COPY . .
RUN npx prisma generate && npm run build

# 生产镜像 - 只保留运行时依赖
FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production

# 从builder复制编译产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://localhost:3001/api/health').then(r=>{process.exit(r.ok?0:1)}).catch(()=>process.exit(1))"

CMD ["npm", "run", "start:prod"]