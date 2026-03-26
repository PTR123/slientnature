const { petApi } = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    pets: [],
    loading: true,
    isLoggedIn: false
  },

  onLoad() {
    this.checkLoginAndLoad()
  },

  onShow() {
    this.checkLoginAndLoad()
  },

  checkLoginAndLoad() {
    const app = getApp()
    const isLoggedIn = app.isLoggedIn()
    this.setData({ isLoggedIn, loading: true })

    if (isLoggedIn) {
      this.loadPets()
    } else {
      this.setData({ loading: false, pets: [] })
    }
  },

  async loadPets() {
    try {
      const pets = await petApi.getList()

      // 格式化数据
      const formattedPets = pets.map(pet => ({
        ...pet,
        createdAt: util.formatDate(pet.createdAt, 'YYYY-MM-DD'),
        birthDate: pet.birthDate ? util.formatDate(pet.birthDate, 'YYYY-MM-DD') : ''
      }))

      this.setData({
        pets: formattedPets,
        loading: false
      })
    } catch (err) {
      console.error('加载宠物列表失败:', err)
      util.showToast('加载失败')
      this.setData({ loading: false })
    }
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/pets/detail/detail?id=${id}`
    })
  },

  goToCreate() {
    util.requireLogin(() => {
      wx.navigateTo({
        url: '/pages/pets/create/create'
      })
    })
  },

  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  onPullDownRefresh() {
    this.checkLoginAndLoad()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  }
})
