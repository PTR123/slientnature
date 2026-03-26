// pages/register/register.js
const { authApi } = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    loading: false
  },

  // 输入邮箱
  onEmailInput(e) {
    this.setData({ email: e.detail.value })
  },

  // 输入用户名
  onUsernameInput(e) {
    this.setData({ username: e.detail.value })
  },

  // 输入密码
  onPasswordInput(e) {
    this.setData({ password: e.detail.value })
  },

  // 确认密码
  onConfirmPasswordInput(e) {
    this.setData({ confirmPassword: e.detail.value })
  },

  // 注册
  async onRegister() {
    const { email, username, password, confirmPassword } = this.data

    // 验证
    if (!email) {
      util.showToast('请输入邮箱')
      return
    }
    if (!username) {
      util.showToast('请输入用户名')
      return
    }
    if (username.length < 3 || username.length > 20) {
      util.showToast('用户名需要3-20个字符')
      return
    }
    if (!password) {
      util.showToast('请输入密码')
      return
    }
    if (password.length < 6) {
      util.showToast('密码至少6个字符')
      return
    }
    if (password !== confirmPassword) {
      util.showToast('两次密码不一致')
      return
    }

    try {
      this.setData({ loading: true })
      util.showLoading('注册中...')

      const res = await authApi.register({ email, username, password })

      // 保存登录状态
      const app = getApp()
      app.login(res.token, res.user)

      util.hideLoading()
      util.showToast('注册成功', 'success')

      // 跳转首页
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' })
      }, 1500)
    } catch (err) {
      util.hideLoading()
      util.showToast(err.message || '注册失败')
    } finally {
      this.setData({ loading: false })
    }
  },

  // 跳转登录
  goToLogin() {
    wx.navigateBack()
  }
})