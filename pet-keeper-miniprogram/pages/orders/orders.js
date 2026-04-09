// pages/orders/orders.js
const { request } = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    orders: [],
    currentStatus: '',
    loading: true
  },

  onLoad() {
    this.loadOrders()
  },

  async loadOrders() {
    const { currentStatus } = this.data

    try {
      const params = currentStatus ? { status: currentStatus } : {}
      const orders = await request('/orders', 'GET', params)

      this.setData({
        orders: orders || [],
        loading: false
      })
    } catch (err) {
      console.error('加载订单失败:', err)
      this.setData({ loading: false })
    }
  },

  // 切换状态
  onStatusChange(e) {
    const { status } = e.currentTarget.dataset
    this.setData({ currentStatus: status, loading: true })
    this.loadOrders()
  },

  // 跳转订单详情
  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/orders/detail/detail?id=${id}`
    })
  },

  // 取消订单
  async onCancel(e) {
    const { id } = e.currentTarget.dataset

    const confirmed = await util.showConfirm('确定要取消订单吗？')
    if (!confirmed) return

    try {
      await request(`/orders/${id}/cancel`, 'POST')
      util.showToast('订单已取消', 'success')
      await this.loadOrders()
    } catch (err) {
      util.showToast(err.message || '取消失败')
    }
  },

  // 去支付
  async onPay(e) {
    const { id } = e.currentTarget.dataset

    try {
      const result = await request(`/payment/${id}`, 'POST')
      // 发起微信支付
      wx.requestPayment({
        ...result,
        success: () => {
          util.showToast('支付成功', 'success')
          this.loadOrders()
        },
        fail: () => {
          util.showToast('支付取消')
        }
      })
    } catch (err) {
      util.showToast(err.message || '支付失败')
    }
  },

  // 下拉刷新
  async onPullDownRefresh() {
    await this.loadOrders()
    wx.stopPullDownRefresh()
  }
})