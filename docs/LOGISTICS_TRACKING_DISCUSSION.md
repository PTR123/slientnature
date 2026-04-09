# 订单物流跟踪功能讨论方案

## 一、业务需求分析

### 1.1 核心功能
- ✅ 物流信息录入（管理员）
- ✅ 物流轨迹展示（用户）
- ✅ 物流状态更新
- ✅ 物流通知推送

### 1.2 用户故事

#### 买家视角
```
作为买家
我想要查看订单的物流信息
以便知道包裹的实时位置和预计送达时间
```

#### 管理员视角
```
作为管理员
我想要录入和更新物流信息
以便让买家了解订单配送进度
```

### 1.3 物流状态定义
```typescript
enum LogisticsStatus {
  PENDING = 'pending',           // 待发货
  SHIPPED = 'shipped',          // 已发货
  IN_TRANSIT = 'in_transit',    // 运输中
  OUT_FOR_DELIVERY = 'out_for_delivery',  // 派送中
  DELIVERED = 'delivered',      // 已签收
  EXCEPTION = 'exception'       // 异常
}
```

## 二、技术方案对比

### 方案A：自建物流系统（推荐用于MVP）

#### 优点
- ✅ 开发成本低
- ✅ 完全可控
- ✅ 不依赖第三方
- ✅ 适合小规模业务

#### 缺点
- ❌ 需要手动录入
- ❌ 无实时自动更新
- ❌ 运营成本高

#### 实现方式
```
管理员手动录入物流信息 → 存储到数据库 → 用户查看物流轨迹
```

### 方案B：集成第三方物流API

#### 可选服务商
1. **快递100** - 综合性强
2. **菜鸟物流** - 阿里生态
3. **顺丰开放平台** - 顺丰专属
4. **快递鸟** - 接口丰富

#### 优点
- ✅ 实时物流信息
- ✅ 自动更新状态
- ✅ 覆盖主流快递
- ✅ 专业可靠

#### 缺点
- ❌ 需要API费用
- ❌ 依赖第三方服务
- ❌ 有调用频率限制

#### 实现方式
```
用户下单 → 管理员填写快递单号 → 调用API获取物流信息 → 展示实时轨迹
```

### 方案C：混合方案（推荐）

#### 结合两种方式
```
1. 管理员可手动录入物流信息（基础方案）
2. 集成第三方API自动获取（增值服务）
3. 支持手动更新和自动同步
```

## 三、数据库设计

### 3.1 物流信息表（Logistics）

```sql
model Logistics {
  id              String   @id @default(uuid())

  // 关联订单
  orderId         String   @unique
  order           Order    @relation(fields: [orderId], references: [id])

  // 物流基本信息
  company         String              // 物流公司
  trackingNumber  String              // 快递单号
  status          String   @default("pending")  // 物流状态

  // 收发货信息
  senderName      String?             // 发货人
  senderPhone     String?             // 发货人电话
  senderAddress   String?             // 发货地址

  receiverName    String?             // 收货人
  receiverPhone   String?             // 收货人电话
  receiverAddress String?             // 收货地址

  // 时间节点
  shippedAt       DateTime?           // 发货时间
  estimatedTime   DateTime?           // 预计送达时间
  deliveredAt     DateTime?           // 签收时间

  // 备注
  remark          String?             // 备注

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // 物流轨迹
  tracks          LogisticsTrack[]
}

model LogisticsTrack {
  id            String   @id @default(uuid())

  // 关联物流
  logisticsId   String
  logistics     Logistics @relation(fields: [logisticsId], references: [id])

  // 轨迹信息
  status        String              // 状态
  location      String?             // 地点
  description   String              // 描述
  operator      String?             // 操作人/网点

  // 时间
  occurredAt    DateTime            // 发生时间

  createdAt     DateTime @default(now())

  @@index([logisticsId, occurredAt])
}
```

### 3.2 物流轨迹示例数据

```json
[
  {
    "status": "shipped",
    "location": "北京市朝阳区",
    "description": "快件已发出",
    "operator": "北京朝阳分部",
    "occurredAt": "2026-04-07T10:00:00Z"
  },
  {
    "status": "in_transit",
    "location": "北京市海淀区",
    "description": "快件已到达北京转运中心",
    "operator": "北京转运中心",
    "occurredAt": "2026-04-07T14:00:00Z"
  },
  {
    "status": "out_for_delivery",
    "location": "上海市浦东新区",
    "description": "快件正在派送中",
    "operator": "上海浦东派送员：张三",
    "occurredAt": "2026-04-08T09:00:00Z"
  },
  {
    "status": "delivered",
    "location": "上海市浦东新区",
    "description": "快件已签收，签收人：李四",
    "operator": "派送员：张三",
    "occurredAt": "2026-04-08T11:30:00Z"
  }
]
```

## 四、前端实现

### 4.1 物流轨迹展示组件

```tsx
// components/logistics-tracker.tsx
interface LogisticsTrack {
  status: string;
  location: string;
  description: string;
  operator: string;
  occurredAt: string;
}

export function LogisticsTracker({ tracks }: { tracks: LogisticsTrack[] }) {
  return (
    <div className="logistics-tracker">
      <div className="timeline">
        {tracks.map((track, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-marker">
              {getStatusIcon(track.status)}
            </div>
            <div className="timeline-content">
              <div className="time">
                {formatTime(track.occurredAt)}
              </div>
              <div className="status">{track.description}</div>
              {track.location && (
                <div className="location">📍 {track.location}</div>
              )}
              {track.operator && (
                <div className="operator">👤 {track.operator}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 4.2 页面布局设计

```
┌─────────────────────────────────────────┐
│  订单详情                                 │
├─────────────────────────────────────────┤
│  物流信息                                 │
│  ┌───────────────────────────────────┐  │
│  │ 物流公司：顺丰速运                  │  │
│  │ 快递单号：SF1234567890             │  │
│  │ 当前状态：派送中                    │  │
│  │ 预计送达：2026-04-08 18:00        │  │
│  └───────────────────────────────────┘  │
│                                          │
│  物流轨迹                                 │
│  ┌───────────────────────────────────┐  │
│  │ ● 已签收                           │  │
│  │ │  2026-04-08 11:30                │  │
│  │ │  上海浦东 - 签收人：李四          │  │
│  │ │                                  │  │
│  │ ● 派送中                           │  │
│  │ │  2026-04-08 09:00                │  │
│  │ │  上海浦东 - 派送员：张三          │  │
│  │ │                                  │  │
│  │ ● 运输中                           │  │
│  │ │  2026-04-07 14:00                │  │
│  │ │  北京转运中心                     │  │
│  │ │                                  │  │
│  │ ● 已发货                           │  │
│  │    2026-04-07 10:00                │  │
│  │    北京朝阳 - 已发出                │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## 五、后端API设计

### 5.1 物流信息管理

```typescript
// 创建物流信息
POST /api/logistics
Body: {
  orderId: string;
  company: string;          // 顺丰、圆通、中通等
  trackingNumber: string;
  senderName?: string;
  senderPhone?: string;
  senderAddress?: string;
}

// 获取物流信息
GET /api/logistics/:orderId

// 添加物流轨迹
POST /api/logistics/:id/tracks
Body: {
  status: string;
  location?: string;
  description: string;
  operator?: string;
  occurredAt: string;
}

// 更新物流状态
PATCH /api/logistics/:id/status
Body: {
  status: string;
}
```

### 5.2 管理员接口

```typescript
// 批量导入物流单号
POST /api/admin/logistics/import
Body: [
  {
    orderId: string;
    trackingNumber: string;
    company: string;
  }
]

// 物流统计分析
GET /api/admin/logistics/stats
Response: {
  total: number;
  pending: number;
  shipped: number;
  delivered: number;
  exception: number;
}
```

## 六、实现步骤建议

### Phase 1: MVP版本（1-2周）

#### 目标
- ✅ 基础物流信息存储
- ✅ 手动录入物流轨迹
- ✅ 用户查看物流信息

#### 任务清单
```
后端：
□ 创建Logistics和LogisticsTrack数据表
□ 实现物流信息CRUD接口
□ 实现物流轨迹添加接口

前端：
□ 物流信息展示组件
□ 订单详情页集成物流信息
□ 管理员物流录入页面
```

### Phase 2: 增强版（2-3周）

#### 目标
- ✅ 美化物流轨迹展示
- ✅ 物流状态自动更新
- ✅ 物流通知推送

#### 任务清单
```
后端：
□ 实现物流状态自动流转
□ 添加消息通知功能
□ 物流数据统计接口

前端：
□ 优化物流轨迹时间线UI
□ 实现物流地图展示
□ 推送消息提示
```

### Phase 3: 完整版（3-4周）

#### 目标
- ✅ 集成第三方物流API
- ✅ 自动获取物流信息
- ✅ 物流异常处理

#### 任务清单
```
后端：
□ 集成快递100/快递鸟API
□ 实现定时同步物流信息
□ 异常物流告警机制

前端：
□ 实时物流更新
□ 物流订阅功能
□ 物流分享功能
```

## 七、第三方API集成示例

### 7.1 快递100 API

```typescript
// 查询物流信息
async function queryLogistics(company: string, number: string) {
  const response = await fetch('https://poll.kuaidi100.com/poll/query.do', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      customer: process.env.KUAIDI100_CUSTOMER,
      key: process.env.KUAIDI100_KEY,
      num: number,
      com: company
    })
  });

  return await response.json();
}

// 返回数据格式
{
  "state": "3",  // 状态码
  "data": [
    {
      "time": "2026-04-08 11:30:00",
      "context": "快件已签收，签收人：李四",
      "location": "上海市浦东新区"
    },
    {
      "time": "2026-04-08 09:00:00",
      "context": "快件正在派送中",
      "location": "上海市浦东新区"
    }
  ]
}
```

### 7.2 快递鸟API

```typescript
// 即时查询物流信息
async function queryLogistics(shipperCode: string, logisticCode: string) {
  const requestData = {
    ShipperCode: shipperCode,
    LogisticCode: logisticCode
  };

  const response = await fetch('https://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      RequestData: JSON.stringify(requestData),
      EBusinessID: process.env.KDNIAO_EBUSINESS_ID,
      RequestType: '1002',
      DataSign: generateSignature(requestData)
    })
  });

  return await response.json();
}
```

## 八、关键技术点

### 8.1 数据同步策略

```typescript
// 定时任务：每4小时同步一次物流信息
import cron from 'node-cron';

cron.schedule('0 */4 * * *', async () => {
  const pendingOrders = await prisma.logistics.findMany({
    where: { status: { in: ['shipped', 'in_transit'] } }
  });

  for (const logistics of pendingOrders) {
    const tracks = await queryLogisticsAPI(logistics.company, logistics.trackingNumber);
    await updateLogisticsTracks(logistics.id, tracks);
  }
});
```

### 8.2 状态映射

```typescript
const statusMap = {
  // 快递100状态码
  '0': 'in_transit',      // 在途
  '1': 'pending',         // 揽收
  '2': 'exception',       // 异常
  '3': 'delivered',       // 签收
  '4': 'pending',         // 退回
  '5': 'pending',         // 派件
  '6': 'exception',       // 退回签收

  // 快递鸟状态码
  '1': 'pending',         // 已揽收
  '2': 'in_transit',      // 在途中
  '3': 'signed',          // 已签收
  '4': 'exception',       // 问题件
  '5': 'pending',         // 转投
  '6': 'delivered'        // 清关
};
```

### 8.3 异常处理

```typescript
// 物流异常告警
async function checkLogisticsException(logisticsId: string) {
  const logistics = await prisma.logistics.findUnique({
    where: { id: logisticsId },
    include: { tracks: { orderBy: { occurredAt: 'desc' }, take: 1 } }
  });

  // 超过7天未更新
  const lastUpdate = logistics.tracks[0]?.occurredAt;
  const daysSinceUpdate = differenceInDays(new Date(), lastUpdate);

  if (daysSinceUpdate > 7 && logistics.status !== 'delivered') {
    await sendAlertNotification({
      type: 'logistics_exception',
      orderId: logistics.orderId,
      message: '物流信息长时间未更新'
    });
  }
}
```

## 九、用户体验优化

### 9.1 实时更新
```typescript
// WebSocket 实时推送
io.on('connection', (socket) => {
  socket.on('subscribe_logistics', (orderId) => {
    socket.join(`logistics_${orderId}`);
  });
});

// 物流更新时推送
async function notifyLogisticsUpdate(orderId: string, track: LogisticsTrack) {
  io.to(`logistics_${orderId}`).emit('logistics_update', track);
}
```

### 9.2 消息通知
```typescript
// 物流状态变更时发送通知
async function sendLogisticsNotification(orderId: string, status: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true }
  });

  // 站内消息
  await createNotification({
    userId: order.userId,
    type: 'logistics',
    title: '物流更新',
    content: `您的订单物流状态已更新为：${getStatusText(status)}`
  });

  // 微信/短信通知（可选）
  if (order.user.phone) {
    await sendSMS(order.user.phone, `您的订单物流状态：${getStatusText(status)}`);
  }
}
```

## 十、成本估算

### 10.1 开发成本

| 阶段 | 工作量 | 人力成本 |
|------|--------|----------|
| Phase 1 | 1-2周 | 1后端 + 1前端 |
| Phase 2 | 2-3周 | 1后端 + 1前端 |
| Phase 3 | 3-4周 | 1后端 + 1前端 |

### 10.2 第三方服务成本

| 服务商 | 价格 | 说明 |
|--------|------|------|
| 快递100 | 0.05元/次 | 查询接口 |
| 快递鸟 | 0.04元/次 | 查询接口 |
| 阿里云物流 | 0.03元/次 | 查询接口 |

**月度预算**：
- 100单/天 × 30天 × 4次查询 = 12,000次
- 费用：12,000 × 0.05 = 600元/月

## 十一、讨论问题

让我们讨论以下几个问题：

### 1. 方案选择
❓ 你倾向于哪种实现方案？
- A. 先做手动录入的MVP版本
- B. 直接集成第三方API
- C. 混合方案（手动+API）

### 2. 预算考虑
❓ 是否有预算接入第三方物流API？
- 如果有，建议选择哪个服务商？
- 如果没有，先做手动录入版本

### 3. 业务场景
❓ 主要的业务场景是什么？
- 需要支持哪些物流公司？
- 日均订单量大概多少？
- 是否需要国际物流？

### 4. 时间要求
❓ 期望的上线时间？
- 1-2周快速上线MVP
- 1个月完整版
- 逐步迭代

### 5. 特殊需求
❓ 是否有特殊需求？
- 需要地图展示轨迹吗？
- 需要物流时效分析吗？
- 需要退货物流吗？

请告诉我你的想法，我们可以针对性地制定实现方案！