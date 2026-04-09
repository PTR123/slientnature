// pages/profile/settings/settings.js
const util = require('../../../utils/util')

Page({
  data: {
    settings: {
      notification: true,
      sound: true,
      vibration: false,
      autoPlayVideo: false,
      language: 'zh-CN',
      theme: 'light'
    },
    languages: [
      { value: 'zh-CN', label: '简体中文' },
      { value: 'zh-TW', label: '繁体中文' },
      { value: 'en', label: '英文' }
    ],
    themes: [
      { value: 'light', label: '浅色模式' },
      { value: 'dark', label: '深色模式' },
      { value: 'auto', label: '跟随系统' }
    ]
  },

  onLoad() {
    this.loadSettings()
  },

  loadSettings() {
    const settings = wx.getStorageSync('appSettings')
    if (settings) {
      this.setData({ settings })
    }
  },

  saveSettings(settings) {
    wx.setStorageSync('appSettings', settings)
  },

  // 通知设置
  onNotificationChange(e) {
    const settings = { ...this.data.settings, notification: e.detail.value }
    this.setData({ settings })
    this.saveSettings(settings)
    util.showToast(e.detail.value ? '已开启通知' : '已关闭通知')
  },

  // 音效设置
  onSoundChange(e) {
    const settings = { ...this.data.settings, sound: e.detail.value }
    this.setData({ settings })
    this.saveSettings(settings)
    util.showToast(e.detail.value ? '已开启音效' : '已关闭音效')
  },

  // 振动设置
  onVibrationChange(e) {
    const settings = { ...this.data.settings, vibration: e.detail.value }
    this.setData({ settings })
    this.saveSettings(settings)
    util.showToast(e.detail.value ? '已开启振动' : '已关闭振动')
  },

  // 自动播放视频
  onAutoPlayChange(e) {
    const settings = { ...this.data.settings, autoPlayVideo: e.detail.value }
    this.setData({ settings })
    this.saveSettings(settings)
    util.showToast(e.detail.value ? '已开启自动播放' : '已关闭自动播放')
  },

  // 语言选择
  onLanguageChange(e) {
    const index = e.detail.value
    const language = this.data.languages[index].value
    const settings = { ...this.data.settings, language }
    this.setData({ settings })
    this.saveSettings(settings)
    util.showToast('语言已更改')
  },

  // 主题选择
  onThemeChange(e) {
    const index = e.detail.value
    const theme = this.data.themes[index].value
    const settings = { ...this.data.settings, theme }
    this.setData({ settings })
    this.saveSettings(settings)

    // TODO: 应用主题更改
    util.showToast('主题已更改')
  },

  // 检查更新
  checkUpdate() {
    util.showLoading('检查中...')

    setTimeout(() => {
      util.hideLoading()
      wx.showModal({
        title: '检查更新',
        content: '当前已是最新版本',
        showCancel: false,
        confirmText: '知道了'
      })
    }, 1000)
  },

  // 用户协议
  showUserAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '欢迎使用自然不语！\n\n我们致力于为您提供优质的异宠饲养管理服务。使用本应用即表示您同意遵守我们的服务条款和隐私政策。',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 隐私政策
  showPrivacyPolicy() {
    wx.showModal({
      title: '隐私政策',
      content: '我们重视您的隐私保护。\n\n自然不语仅收集必要的用户信息用于提供服务，我们不会泄露或出售您的个人数据。',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 关于小程序
  showAbout() {
    wx.showModal({
      title: '关于自然不语',
      content: '自然不语 v1.0.0\n\n专注于自然生态与异宠文化的平台，让自然之美在静默中诉说。\n\n© 2026 自然不语',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 反馈建议
  feedback() {
    wx.showModal({
      title: '反馈建议',
      content: '如有问题或建议，请发送邮件至：\nfeedback@ziranbuyu.com',
      showCancel: false,
      confirmText: '知道了'
    })
  }
})