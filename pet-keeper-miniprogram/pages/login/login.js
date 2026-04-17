// pages/login/login.js
const { authApi } = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    loginType: 'email', // 'email' 或 'phone'
    email: '',
    password: '',
    phone: '',
    code: '',
    countdown: 0,
    loading: false
  },

  // 切换登录方式
  switchLoginType(e) {
    const { type } = e.currentTarget.dataset
    this.setData({ loginType: type })
  },

  // 输入邮箱
  onEmailInput(e) {
    this.setData({ email: e.detail.value })
  },

  // 输入密码
  onPasswordInput(e) {
    this.setData({ password: e.detail.value })
  },

  // 输入手机号
  onPhoneInput(e) {
    this.setData({ phone: e.detail.value })
  },

  // 输入验证码
  onCodeInput(e) {
    this.setData({ code: e.detail.value })
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

  // 邮箱登录
  async onLogin() {
    const { email, password } = this.data

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
      this.handleLoginSuccess(res)
    } catch (err) {
      util.hideLoading()

      // 显示详细错误信息
      const errorMsg = err.message || '登录失败，请稍后重试'

      // 如果是网络错误，给出具体提示
      if (err.errMsg && err.errMsg.includes('request:fail')) {
        util.showToast('网络连接失败，请检查网络或服务器地址')
      } else {
        util.showToast(errorMsg)
      }

      console.error('登录失败详情:', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  // 手机号登录
  async onPhoneLogin() {
    const { phone, code } = this.data

    if (!phone || phone.length !== 11) {
      util.showToast('请输入正确的手机号')
      return
    }
    if (!code || code.length !== 6) {
      util.showToast('请输入6位验证码')
      return
    }

    try {
      this.setData({ loading: true })
      util.showLoading('登录中...')

      const res = await authApi.loginWithPhone({ phone, code })
      this.handleLoginSuccess(res)
    } catch (err) {
      util.hideLoading()

      const errorMsg = err.message || '登录失败，请稍后重试'
      if (err.errMsg && err.errMsg.includes('request:fail')) {
        util.showToast('网络连接失败，请检查网络或服务器地址')
      } else {
        util.showToast(errorMsg)
      }

      console.error('手机号登录失败详情:', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  // 微信手机号一键登录
  async onWechatLogin(e) {
    console.log('微信登录回调:', e)

    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      console.log('用户拒绝授权')
      util.showToast('已取消授权')
      return
    }

    try {
      this.setData({ loading: true })
      util.showLoading('登录中...')

      // 先登录获取 code
      const loginRes = await new Promise((resolve, reject) => {
        wx.login({
          success: resolve,
          fail: reject
        })
      })

      // 调用后端接口
      const res = await authApi.wechatLogin({
        code: loginRes.code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      })

      this.handleLoginSuccess(res)
    } catch (err) {
      util.hideLoading()

      const errorMsg = err.message || '微信登录失败，请稍后重试'
      if (err.errMsg && err.errMsg.includes('request:fail')) {
        util.showToast('网络连接失败，请检查网络或服务器地址')
      } else {
        util.showToast(errorMsg)
      }

      console.error('微信登录失败详情:', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  // 处理登录成功
  handleLoginSuccess(res) {
    // 保存登录状态
    const app = getApp()
    app.login(res.token, res.user)

    util.hideLoading()
    util.showToast('登录成功', 'success')

    // 返回上一页或跳转首页（减少延迟时间）
    setTimeout(() => {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        wx.navigateBack()
      } else {
        wx.switchTab({ url: '/pages/index/index' })
      }
    }, 300) // 优化：从1500ms减少到300ms，提升用户体验
  },

  // 跳转注册
  goToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  }
})