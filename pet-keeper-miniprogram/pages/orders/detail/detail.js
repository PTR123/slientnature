// pages/orders/detail/detail.js
const { request } = require('../../../utils/api')
const util = require('../../../utils/util')

Page({
  data: {
    order: null,
    loading: true
  },

  onLoad(options) {
    const { id } = options
    this.loadOrder(id)
  },

  async loadOrder(id) {
    try {
      const order = await request(`/orders/${id}`, 'GET')
      this.setData({
        order,
        loading: false
      })
    } catch (err) {
      console.error('加载订单失败:', err)
      util.showToast('加载失败')
      this.setData({ loading: false })
    }
  },

  // 取消订单
  async onCancel() {
    const confirmed = await util.showConfirm('确定要取消订单吗？')
    if (!confirmed) return

    try {
      await request(`/orders/${this.data.order.id}/cancel`, 'POST')
      util.showToast('订单已取消', 'success')
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (err) {
      util.showToast(err.message || '取消失败')
    }
  },

  // 去支付
  async onPay() {
    try {
      // 调用创建支付接口
      const result = await request('/payment/create', 'POST', {
        orderId: this.data.order.id
      })

      // 模拟支付成功
      const payResult = await request('/payment/mock/pay', 'POST', {
        orderId: this.data.order.id
      })

      if (payResult.success) {
        util.showToast('支付成功', 'success')
        // 刷新订单详情
        this.loadOrder(this.data.order.id)
      }
    } catch (err) {
      util.showToast(err.message || '支付失败')
    }
  },

  // 确认收货
  async onConfirm() {
    const confirmed = await util.showConfirm('确认收货吗？')
    if (!confirmed) return

    try {
      await request(`/orders/${this.data.order.id}/complete`, 'POST')
      util.showToast('已确认收货', 'success')
      this.loadOrder(this.data.order.id)
    } catch (err) {
      util.showToast(err.message || '操作失败')
    }
  },

  // 复制订单号
  copyOrderId() {
    wx.setClipboardData({
      data: this.data.order.id,
      success: () => {
        util.showToast('已复制', 'success')
      }
    })
  }
})