// app.js
App({
  globalData: {
    userInfo: null,
    token: null,
    // ⚠️ 修复：使用正确的局域网IP地址
    apiBaseUrl: 'http://10.81.214.231:3001/api' // 本地测试地址（已修复IP地址）
  },

  onLaunch() {
    // 检查登录状态
    this.checkLoginStatus()
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')

    if (token && userInfo) {
      this.globalData.token = token
      this.globalData.userInfo = userInfo
    }
  },

  // 检查是否登录
  isLoggedIn() {
    return !!this.globalData.token
  },

  // 登录
  login(token, userInfo) {
    this.globalData.token = token
    this.globalData.userInfo = userInfo
    wx.setStorageSync('token', token)
    wx.setStorageSync('userInfo', userInfo)
  },

  // 登出
  logout() {
    this.globalData.token = null
    this.globalData.userInfo = null
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
  }
})