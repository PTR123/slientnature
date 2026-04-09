// pages/profile/profile.js
const { authApi, petApi, postApi } = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    userInfo: null,
    stats: {
      petCount: 0,
      postCount: 0,
      likeCount: 0
    },
    loading: true
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4 // 我的第5个tab
      })
    }
    this.loadData()
  },

  async loadData() {
    try {
      const app = getApp()

      if (!app.isLoggedIn()) {
        this.setData({ loading: false, userInfo: null })
        return
      }

      const userInfo = app.globalData.userInfo

      // 获取统计数据
      const [pets, posts] = await Promise.all([
        petApi.getList(),
        postApi.getList({ author: userInfo.id })
      ])

      const stats = {
        petCount: pets.length,
        postCount: posts.length,
        likeCount: posts.reduce((sum, post) => sum + (post.likes || 0), 0)
      }

      this.setData({
        userInfo,
        stats,
        loading: false
      })
    } catch (err) {
      console.error('加载数据失败:', err)
      this.setData({ loading: false })
    }
  },

  // 跳转到登录
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  // 跳转到宠物列表
  goToPets() {
    wx.switchTab({
      url: '/pages/pets/pets'
    })
  },

  // 跳转到帖子列表
  goToPosts() {
    wx.switchTab({
      url: '/pages/community/community'
    })
  },

  // 跳转到地址管理
  goToAddresses() {
    wx.navigateTo({
      url: '/pages/address/list/list'
    })
  },

  // 编辑资料
  editProfile() {
    wx.navigateTo({
      url: '/pages/profile/edit/edit'
    })
  },

  // 设置
  openSettings() {
    wx.navigateTo({
      url: '/pages/profile/settings/settings'
    })
  },

  // 关于我们
  aboutUs() {
    wx.showModal({
      title: '关于自然不语',
      content: '自然不语是一款专注于自然生态与异宠文化的平台，致力于为用户提供专业的饲养管理、物种科普和社区交流服务，让自然之美在静默中诉说。',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 反馈建议
  feedback() {
    wx.showModal({
      title: '反馈建议',
      content: '如有问题或建议，请发送邮件至：feedback@ziranbuyu.com',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 清除缓存
  async clearCache() {
    const confirmed = await util.showConfirm('确定要清除缓存吗？')

    if (confirmed) {
      try {
        const app = getApp()
        await wx.clearStorage()
        app.logout()
        util.showToast('清除成功')

        setTimeout(() => {
          this.setData({ userInfo: null })
        }, 1000)
      } catch (err) {
        console.error('清除缓存失败:', err)
        util.showToast('清除失败')
      }
    }
  },

  // 退出登录
  async logout() {
    const confirmed = await util.showConfirm('确定要退出登录吗？')

    if (confirmed) {
      const app = getApp()
      app.logout()
      util.showToast('已退出登录')

      setTimeout(() => {
        this.setData({ userInfo: null })
      }, 1000)
    }
  },

  onPullDownRefresh() {
    this.loadData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  }
})