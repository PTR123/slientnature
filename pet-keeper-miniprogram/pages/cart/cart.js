// pages/cart/cart.js
const { request } = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    cartItems: [],
    selectedItems: [],
    totalPrice: 0,
    loading: true
  },

  onLoad() {
    this.loadCart()
  },

  onShow() {
    this.loadCart()
  },

  async loadCart() {
    try {
      const cart = await request('/cart', 'GET')

      this.setData({
        cartItems: cart.items || [],
        loading: false
      })

      this.calculateTotal()
    } catch (err) {
      console.error('加载购物车失败:', err)
      this.setData({ loading: false })
    }
  },

  // 选择商品
  onItemSelect(e) {
    const { id } = e.currentTarget.dataset
    const { selectedItems } = this.data

    const index = selectedItems.indexOf(id)
    if (index > -1) {
      selectedItems.splice(index, 1)
    } else {
      selectedItems.push(id)
    }

    this.setData({ selectedItems })
    this.calculateTotal()
  },

  // 全选
  onSelectAll() {
    const { cartItems, selectedItems } = this.data

    if (selectedItems.length === cartItems.length) {
      this.setData({ selectedItems: [] })
    } else {
      this.setData({ selectedItems: cartItems.map(item => item.id) })
    }

    this.calculateTotal()
  },

  // 计算总价
  calculateTotal() {
    const { cartItems, selectedItems } = this.data

    const total = cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    this.setData({ totalPrice: total })
  },

  // 修改数量
  async onQuantityChange(e) {
    const { id, type } = e.currentTarget.dataset
    const item = this.data.cartItems.find(i => i.id === id)

    let quantity = item.quantity
    if (type === 'minus' && quantity > 1) {
      quantity--
    } else if (type === 'plus') {
      quantity++
    }

    try {
      await request(`/cart/${id}`, 'PUT', { quantity })
      await this.loadCart()
    } catch (err) {
      util.showToast(err.message || '修改失败')
    }
  },

  // 删除商品
  async onDelete(e) {
    const { id } = e.currentTarget.dataset

    const confirmed = await util.showConfirm('确定要删除吗？')
    if (!confirmed) return

    try {
      await request(`/cart/${id}`, 'DELETE')
      util.showToast('已删除', 'success')
      await this.loadCart()
    } catch (err) {
      util.showToast(err.message || '删除失败')
    }
  },

  // 去结算
  async onCheckout() {
    const { selectedItems, totalPrice, cartItems } = this.data

    if (selectedItems.length === 0) {
      util.showToast('请选择商品')
      return
    }

    try {
      // 准备商品信息
      const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id))
      const items = selectedCartItems.map(item => ({
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        image: item.product.images[0],
        quantity: item.quantity,
        cartItemId: item.id
      }))

      // 跳转到订单确认页
      wx.navigateTo({
        url: `/pages/orders/checkout/checkout?items=${encodeURIComponent(JSON.stringify(items))}&totalAmount=${totalPrice}`
      })
    } catch (err) {
      util.showToast(err.message || '操作失败')
    }
  },

  // 跳转商品详情
  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/shop/detail/detail?id=${id}`
    })
  },

  // 跳转商城
  goToShop() {
    wx.switchTab({
      url: '/pages/shop/shop'
    })
  }
})