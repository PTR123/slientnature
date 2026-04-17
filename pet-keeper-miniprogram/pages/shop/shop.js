// pages/shop/shop.js
const { request } = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    products: [],
    categories: [],
    currentCategory: '',
    keyword: '',
    loading: true,
    page: 1,
    limit: 10,
    hasMore: true,
    cartCount: 0
  },

  onLoad() {
    this.loadData()
    this.loadCartCount()
  },

  onShow() {
    // ✅ 更新tabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3 // 商城是第4个tab（社区在index=2）
      })
    }
    this.loadCartCount() // 每次显示都更新购物车数量
  },

  async loadData() {
    try {
      const [categories, products] = await Promise.all([
        this.loadCategories(),
        this.loadProducts()
      ])

      this.setData({ loading: false })
    } catch (err) {
      console.error('加载数据失败:', err)
      this.setData({ loading: false })
      util.showToast('加载失败')
    }
  },

  async loadCategories() {
    try {
      const categories = await request('/categories', 'GET')
      this.setData({ categories })
    } catch (err) {
      console.error('加载分类失败:', err)
    }
  },

  async loadProducts(append = false) {
    const { currentCategory, keyword, page, limit } = this.data

    try {
      const params = {
        page,
        limit,
        ...(currentCategory && { categoryId: currentCategory }),
        ...(keyword && { keyword })
      }

      const data = await request('/products', 'GET', params)

      const products = append ? [...this.data.products, ...data.products] : data.products
      const hasMore = data.pagination.page < data.pagination.totalPages

      this.setData({
        products,
        hasMore,
        page: data.pagination.page
      })
    } catch (err) {
      console.error('加载商品失败:', err)
      throw err
    }
  },

  // 搜索
  onSearchInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  async onSearch() {
    this.setData({ page: 1, products: [] })
    await this.loadProducts()
  },

  // 分类筛选
  onCategoryTap(e) {
    const { id } = e.currentTarget.dataset
    this.setData({
      currentCategory: id === this.data.currentCategory ? '' : id,
      page: 1,
      products: []
    })
    this.loadProducts()
  },

  // 跳转商品详情
  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/shop/detail/detail?id=${id}`
    })
  },

  // 加入购物车
  async addToCart(e) {
    const { id } = e.currentTarget.dataset

    // ✅ 检查是否登录
    const app = getApp()
    if (!app.isLoggedIn()) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再加入购物车',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
      return
    }

    try {
      await request('/cart', 'POST', { productId: id, quantity: 1 })
      util.showToast('已加入购物车', 'success')
      this.loadCartCount()
    } catch (err) {
      util.showToast(err.message || '添加失败')
    }
  },

  // 立即购买 - 跳转到商品详情页
  buyNow(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/shop/detail/detail?id=${id}`
    })
  },

  // 跳转购物车
  goToCart() {
    // ✅ 检查是否登录
    const app = getApp()
    if (!app.isLoggedIn()) {
      wx.showModal({
        title: '提示',
        content: '请先登录后查看购物车',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
      return
    }

    wx.navigateTo({
      url: '/pages/cart/cart'
    })
  },

  // 加载购物车数量
  async loadCartCount() {
    try {
      const app = getApp()

      // ✅ 先检查是否登录，未登录时不请求购物车
      if (!app.isLoggedIn()) {
        this.setData({ cartCount: 0 })
        return
      }

      const cart = await request('/cart', 'GET')
      const count = cart.items.reduce((sum, item) => sum + item.quantity, 0)
      this.setData({ cartCount: count })
    } catch (err) {
      console.error('加载购物车数量失败:', err)
      this.setData({ cartCount: 0 }) // ✅ 失败时设置为0，避免显示错误
    }
  },

  // 下拉刷新
  async onPullDownRefresh() {
    this.setData({ page: 1, products: [] })
    await this.loadProducts()
    wx.stopPullDownRefresh()
  },

  // 上拉加载更多
  async onReachBottom() {
    if (!this.data.hasMore) return

    this.setData({ page: this.data.page + 1 })
    await this.loadProducts(true)
  }
})