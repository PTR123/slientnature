// pages/species/species.js
const { speciesApi } = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    speciesList: [],
    categories: [
      { id: '', name: '全部', icon: '🐾' },
      { id: 'insect', name: '昆虫', icon: '🐜' },
      { id: 'reptile', name: '爬宠', icon: '🦎' },
      { id: 'aquatic', name: '水族', icon: '🐠' },
      { id: 'bird', name: '鸟类', icon: '🦜' },
      { id: 'exotic', name: '异宠', icon: '🦔' }
    ],
    currentCategory: '',
    loading: true,
    searchKeyword: ''
  },

  onLoad(options) {
    const { category } = options
    if (category) {
      this.setData({ currentCategory: category })
    }
    this.loadSpecies()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  async loadSpecies() {
    try {
      this.setData({ loading: true })

      const params = {}
      if (this.data.currentCategory) {
        params.category = this.data.currentCategory
      }

      const speciesList = await speciesApi.getList(params)

      this.setData({
        speciesList,
        loading: false
      })
    } catch (err) {
      console.error('加载物种列表失败:', err)
      util.showToast('加载失败')
      this.setData({ loading: false })
    }
  },

  // 切换分类
  switchCategory(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ currentCategory: id })
    this.loadSpecies()
  },

  // 搜索
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value })
  },

  onSearch() {
    const { searchKeyword } = this.data
    if (!searchKeyword.trim()) {
      this.loadSpecies()
      return
    }

    // 本地搜索过滤
    const filtered = this.data.speciesList.filter(item =>
      item.name.includes(searchKeyword) ||
      (item.scientificName && item.scientificName.includes(searchKeyword))
    )

    this.setData({ speciesList: filtered })
  },

  clearSearch() {
    this.setData({ searchKeyword: '' })
    this.loadSpecies()
  },

  // 跳转到详情
  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/species/detail/detail?id=${id}`
    })
  },

  onPullDownRefresh() {
    this.loadSpecies()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  }
})