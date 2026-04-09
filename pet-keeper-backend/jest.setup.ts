// Jest Setup
import { beforeAll, afterAll } from '@jest/globals';

// 设置测试环境变量
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DATABASE_URL = 'file:./test.db';

// 全局超时时间
jest.setTimeout(30000);

// 清理函数
afterAll(async () => {
  // 清理测试数据
});

// Mock console.error 以减少测试输出噪音
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn()
};