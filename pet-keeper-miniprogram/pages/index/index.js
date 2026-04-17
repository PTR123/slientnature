// pages/index/index.js
const { petApi, speciesApi, postApi } = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    userInfo: null,
    pets: [],
    recentPosts: [],
    categories: [
      { id: 'insect', name: '昆虫', icon: '🐜' },
      { id: 'reptile', name: '爬宠', icon: '🦎' },
      { id: 'aquatic', name: '水族', icon: '🐠' },
      { id: 'bird', name: '鸟类', icon: '🦜' },
      { id: 'exotic', name: '异宠', icon: '🦔' }
    ],
    loading: false,
    dataLoading: false  // 新增：数据加载状态
  },

  onLoad() {
    // 立即显示页面，不等待数据加载完成
    this.setData({ loading: false })
    this.loadData()
  },

  onShow() {
    // 刷新数据
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },

  async loadData() {
    try {
      const app = getApp()

      // 检查登录状态
      if (app.isLoggedIn()) {
        // 立即显示用户信息，不等待其他数据
        this.setData({ userInfo: app.globalData.userInfo })

        // 并行加载数据，使用加载状态指示器
        this.setData({ dataLoading: true })

        const [pets, posts] = await Promise.all([
          petApi.getList().catch(err => {
            console.error('获取宠物列表失败:', err)
            return []
          }),
          postApi.getList({ limit: 3, sort: 'hot' }).catch(err => {
            console.error('获取帖子列表失败:', err)
            return []
          })
        ])

        this.setData({
          pets: pets.slice(0, 3),
          recentPosts: posts,
          dataLoading: false  // 数据加载完成
        })
      } else {
        // 未登录也要正常显示页面
        this.setData({
          userInfo: null,
          pets: [],
          recentPosts: []
        })
      }
    } catch (err) {
      console.error('加载数据失败:', err)
      this.setData({
        userInfo: null,
        pets: [],
        recentPosts: [],
        dataLoading: false
      })
    }
  },

  // 跳转到登录
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  // 跳转到宠物详情
  goToPetDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/pets/detail/detail?id=${id}`
    })
  },

  // 跳转到添加宠物
  goToAddPet() {
    util.requireLogin(() => {
      wx.navigateTo({
        url: '/pages/pets/create/create'
      })
    })
  },

  // 跳转到物种分类
  goToCategory(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/species/species?category=${id}`
    })
  },

  // 跳转到帖子详情
  goToPostDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/community/detail/detail?id=${id}`
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh()
    })
  }
})