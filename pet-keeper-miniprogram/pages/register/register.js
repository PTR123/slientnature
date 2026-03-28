// pages/register/register.js
const { authApi } = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    registerType: 'email', // 'email' 或 'phone'
    email: '',
    phone: '',
    code: '',
    username: '',
    password: '',
    confirmPassword: '',
    countdown: 0,
    loading: false
  },

  // 切换注册方式
  switchRegisterType(e) {
    const { type } = e.currentTarget.dataset
    this.setData({ registerType: type })
  },

  // 输入邮箱
  onEmailInput(e) {
    this.setData({ email: e.detail.value })
  },

  // 输入手机号
  onPhoneInput(e) {
    this.setData({ phone: e.detail.value })
  },

  // 输入验证码
  onCodeInput(e) {
    this.setData({ code: e.detail.value })
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

  // 发送验证码
  async sendCode() {
    const { phone } = this.data

    if (!phone || phone.length !== 11) {
      util.showToast('请输入正确的手机号')
      return
    }

    try {
      await authApi.sendSmsCode({ phone })
      util.showToast('验证码已发送', 'success')

      // 开始倒计时
      this.setData({ countdown: 60 })
      const timer = setInterval(() => {
        if (this.data.countdown <= 1) {
          clearInterval(timer)
          this.setData({ countdown: 0 })
        } else {
          this.setData({ countdown: this.data.countdown - 1 })
        }
      }, 1000)
    } catch (err) {
      util.showToast(err.message || '发送失败')
    }
  },

  // 注册
  async onRegister() {
    const { registerType, email, phone, code, username, password, confirmPassword } = this.data

    // 验证用户名
    if (!username) {
      util.showToast('请输入用户名')
      return
    }
    if (username.length < 3 || username.length > 20) {
      util.showToast('用户名需要3-20个字符')
      return
    }

    // 验证密码
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

    // 根据注册方式验证
    let registerData = { username, password }

    if (registerType === 'email') {
      if (!email) {
        util.showToast('请输入邮箱')
        return
      }
      registerData.email = email
    } else {
      if (!phone || phone.length !== 11) {
        util.showToast('请输入正确的手机号')
        return
      }
      if (!code || code.length !== 6) {
        util.showToast('请输入6位验证码')
        return
      }
      registerData.phone = phone
      registerData.code = code
    }

    try {
      this.setData({ loading: true })
      util.showLoading('注册中...')

      const res = await authApi.register(registerData)

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