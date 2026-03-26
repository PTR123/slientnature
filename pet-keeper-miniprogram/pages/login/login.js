// pages/login/login.js
const { authApi } = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    email: '',
    password: '',
    loading: false
  },

  // 输入邮箱
  onEmailInput(e) {
    this.setData({ email: e.detail.value })
  },

  // 输入密码
  onPasswordInput(e) {
    this.setData({ password: e.detail.value })
  },

  // 登录
  async onLogin() {
    const { email, password } = this.data

    // 验证
    if (!email) {
      util.showToast('请输入邮箱')
      return
    }
    if (!password) {
      util.showToast('请输入密码')
      return
    }

    try {
      this.setData({ loading: true })
      util.showLoading('登录中...')

      const res = await authApi.login({ email, password })

      // 保存登录状态
      const app = getApp()
      app.login(res.token, res.user)

      util.hideLoading()
      util.showToast('登录成功', 'success')

      // 返回上一页或跳转首页
      setTimeout(() => {
        const pages = getCurrentPages()
        if (pages.length > 1) {
          wx.navigateBack()
        } else {
          wx.switchTab({ url: '/pages/index/index' })
        }
      }, 1500)
    } catch (err) {
      util.hideLoading()
      util.showToast(err.message || '登录失败')
    } finally {
      this.setData({ loading: false })
    }
  },

  // 跳转注册
  goToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  }
})