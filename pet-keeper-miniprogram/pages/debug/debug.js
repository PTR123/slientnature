// pages/debug/debug.js
const app = getApp()

Page({
  data: {
    apiBaseUrl: '',
    token: '',
    testing: false,
    result: null,
    logs: []
  },

  onLoad() {
    this.loadConfig()
  },

  onShow() {
    this.loadConfig()
  },

  loadConfig() {
    this.setData({
      apiBaseUrl: app.globalData.apiBaseUrl || '未配置',
      token: app.globalData.token || ''
    })
    this.addLog('配置加载完成: ' + app.globalData.apiBaseUrl)
  },

  addLog(message) {
    const time = new Date().toLocaleTimeString()
    const logs = this.data.logs
    logs.unshift(`[${time}] ${message}`)
    if (logs.length > 20) logs.pop()
    this.setData({ logs })
  },

  async testHealth() {
    this.setData({ testing: true, result: null })
    this.addLog('开始测试健康检查...')

    const url = `${app.globalData.apiBaseUrl}/health`
    this.addLog(`请求地址: ${url}`)

    try {
      const res = await new Promise((resolve, reject) => {
        wx.request({
          url: url,
          method: 'GET',
          success: resolve,
          fail: reject
        })
      })

      this.addLog(`响应状态: ${res.statusCode}`)
      this.addLog(`响应数据: ${JSON.stringify(res.data)}`)

      this.setData({
        result: {
          success: true,
          message: '✅ 连接成功！',
          detail: JSON.stringify(res.data, null, 2)
        }
      })
    } catch (err) {
      this.addLog(`请求失败: ${err.errMsg}`)

      this.setData({
        result: {
          success: false,
          message: '❌ 连接失败',
          detail: `错误: ${err.errMsg}\n\n请检查:\n1. 后端服务是否运行\n2. 是否勾选"不校验合法域名"`
        }
      })
    } finally {
      this.setData({ testing: false })
    }
  },

  async testLogin() {
    this.setData({ testing: true, result: null })
    this.addLog('测试登录接口...')

    const url = `${app.globalData.apiBaseUrl}/auth/login`
    this.addLog(`请求地址: ${url}`)

    try {
      const res = await new Promise((resolve, reject) => {
        wx.request({
          url: url,
          method: 'POST',
          data: {
            email: 'test@test.com',
            password: '123456'
          },
          header: {
            'Content-Type': 'application/json'
          },
          success: resolve,
          fail: reject
        })
      })

      this.addLog(`响应状态: ${res.statusCode}`)
      this.setData({
        result: {
          success: res.statusCode !== 401,
          message: res.statusCode === 200 ? '✅ 登录接口正常' : '接口可访问',
          detail: JSON.stringify(res.data, null, 2)
        }
      })
    } catch (err) {
      this.addLog(`请求失败: ${err.errMsg}`)
      this.setData({
        result: {
          success: false,
          message: '❌ 连接失败',
          detail: `错误: ${err.errMsg}`
        }
      })
    } finally {
      this.setData({ testing: false })
    }
  },

  clearCache() {
    wx.showModal({
      title: '确认清除',
      content: '将清除所有缓存并重启小程序',
      success: (res) => {
        if (res.confirm) {
          this.addLog('清除缓存...')

          // 清除storage
          wx.clearStorageSync()

          // 清除全局数据
          app.globalData.token = null
          app.globalData.userInfo = null

          // 重新加载配置
          this.loadConfig()

          wx.showToast({
            title: '已清除',
            icon: 'success'
          })

          // 延迟重启
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }, 1500)
        }
      }
    })
  }
})