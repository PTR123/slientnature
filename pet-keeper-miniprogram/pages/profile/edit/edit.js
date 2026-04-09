// pages/profile/edit/edit.js
const { authApi } = require('../../../utils/api')
const util = require('../../../utils/util')

Page({
  data: {
    userInfo: null,
    username: '',
    email: '',
    phone: '',
    avatar: '',
    bio: '',
    loading: false
  },

  onLoad() {
    this.loadUserInfo()
  },

  loadUserInfo() {
    const app = getApp()
    if (!app.isLoggedIn()) {
      wx.navigateBack()
      return
    }

    const userInfo = app.globalData.userInfo
    this.setData({
      userInfo,
      username: userInfo.username || '',
      email: userInfo.email || '',
      phone: userInfo.phone || '',
      avatar: userInfo.avatar || '',
      bio: userInfo.bio || ''
    })
  },

  onUsernameInput(e) {
    this.setData({ username: e.detail.value })
  },

  onEmailInput(e) {
    this.setData({ email: e.detail.value })
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value })
  },

  onBioInput(e) {
    this.setData({ bio: e.detail.value })
  },

  async chooseAvatar() {
    try {
      const res = await wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera']
      })

      const tempFilePath = res.tempFiles[0].tempFilePath
      this.setData({ avatar: tempFilePath })
    } catch (err) {
      console.error('选择图片失败:', err)
    }
  },

  async onSave() {
    const { username, email, phone, bio, avatar } = this.data

    if (!username) {
      util.showToast('请输入用户名')
      return
    }

    try {
      this.setData({ loading: true })
      util.showLoading('保存中...')

      // 上传头像（如果有新头像）
      let avatarUrl = this.data.userInfo.avatar
      if (avatar && avatar !== this.data.userInfo.avatar) {
        avatarUrl = await util.uploadImage(avatar)
      }

      // 更新用户信息（模拟API，实际需要后端支持）
      // const updatedUser = await authApi.updateProfile({
      //   username,
      //   email,
      //   phone,
      //   bio,
      //   avatar: avatarUrl
      // })

      // 模拟更新
      const updatedUser = {
        ...this.data.userInfo,
        username,
        email,
        phone,
        bio,
        avatar: avatarUrl
      }

      // 保存到全局和本地存储
      const app = getApp()
      app.globalData.userInfo = updatedUser
      wx.setStorageSync('userInfo', updatedUser)

      util.hideLoading()
      util.showToast('保存成功', 'success')

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (err) {
      util.hideLoading()
      util.showToast(err.message || '保存失败')
      console.error('保存失败:', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  onPullDownRefresh() {
    this.loadUserInfo()
    wx.stopPullDownRefresh()
  }
})