// pages/shop/detail/detail.js
const { request } = require('../../../utils/api')
const util = require('../../../utils/util')

Page({
  data: {
    product: null,
    quantity: 1,
    loading: true
  },

  onLoad(options) {
    const { id } = options
    this.loadProduct(id)
  },

  async loadProduct(id) {
    try {
      const product = await request(`/products/${id}`, 'GET')
      this.setData({
        product,
        loading: false
      })
    } catch (err) {
      console.error('加载商品失败:', err)
      util.showToast('加载失败')
      this.setData({ loading: false })
    }
  },

  // 数量调整
  onQuantityChange(e) {
    const { type } = e.currentTarget.dataset
    let { quantity } = this.data

    if (type === 'minus' && quantity > 1) {
      quantity--
    } else if (type === 'plus') {
      quantity++
    }

    this.setData({ quantity })
  },

  // 加入购物车
  async addToCart() {
    const { product, quantity } = this.data

    try {
      await request('/cart', 'POST', {
        productId: product.id,
        quantity
      })
      util.showToast('已加入购物车', 'success')
    } catch (err) {
      util.showToast(err.message || '添加失败')
    }
  },

  // 立即购买
  async buyNow() {
    const { product, quantity } = this.data

    try {
      // 准备商品信息
      const items = [{
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity
      }]

      const totalAmount = product.price * quantity

      // 跳转到订单确认页
      wx.navigateTo({
        url: `/pages/orders/checkout/checkout?items=${encodeURIComponent(JSON.stringify(items))}&totalAmount=${totalAmount}`
      })
    } catch (err) {
      util.showToast(err.message || '操作失败')
    }
  },

  // 预览图片
  onImageTap(e) {
    const { src } = e.currentTarget.dataset
    wx.previewImage({
      urls: this.data.product.images,
      current: src
    })
  }
})