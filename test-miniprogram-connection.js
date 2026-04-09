// 在微信开发者工具控制台中运行此代码测试连接

// 测试1: 健康检查
console.log('=== 测试API连接 ===');

wx.request({
  url: 'http://localhost:3001/api/health',
  method: 'GET',
  success: (res) => {
    console.log('✅ 连接成功！');
    console.log('响应数据:', res.data);
  },
  fail: (err) => {
    console.log('❌ 连接失败！');
    console.log('错误信息:', err);

    if (err.errMsg.includes('ERR_CONNECTION_REFUSED')) {
      console.log('\n解决方案:');
      console.log('1. 检查后端是否运行: curl http://localhost:3001/api/health');
      console.log('2. 勾选开发者工具中的"不校验合法域名"');
      console.log('3. 清除缓存后重新编译');
    }
  }
});

// 测试2: 检查配置
console.log('\n=== 当前配置 ===');
const app = getApp();
console.log('API地址:', app.globalData.apiBaseUrl);

// 测试3: 获取本机IP（用于手机预览）
console.log('\n=== 手机预览配置 ===');
console.log('如果需要在手机上预览，需要:');
console.log('1. 修改 app.js 中的 apiBaseUrl');
console.log('2. 改为: http://你的本机IP:3001/api');
console.log('3. 例如: http://10.81.214.231:3001/api');