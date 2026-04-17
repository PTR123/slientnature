// pages/orders/checkout/checkout.js
const { request } = require('../../../utils/api')
const util = require('../../../utils/util')

Page({
  data: {
    items: [],
    totalAmount: 0,
    selectedAddress: null,
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    remark: '',
    submitting: false
  },

  onLoad(options) {
    // ✅ 检查登录状态
    const app = getApp()
    if (!app.isLoggedIn()) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再结算',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          } else {
            wx.switchTab({
              url: '/pages/shop/shop'
            })
          }
        }
      })
      return
    }

    // 接收商品信息
    const { items, totalAmount } = options
    if (items) {
      const parsedItems = JSON.parse(decodeURIComponent(items))
      this.setData({
        items: parsedItems,
        totalAmount: totalAmount || parsedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      })
    }

    // 加载默认地址
    this.loadDefaultAddress()
  },

  async loadDefaultAddress() {
    try {
      const addresses = await request('/addresses', 'GET')
      const defaultAddress = addresses.find(addr => addr.isDefault)

      if (defaultAddress) {
        this.setData({ selectedAddress: defaultAddress })
      }
    } catch (err) {
      console.error('加载默认地址失败:', err)
    }
  },

  // 选择地址
  onSelectAddress() {
    wx.navigateTo({
      url: '/pages/address/list/list?select=1'
    })
  },

  // 设置选中的地址（从地址列表页返回时调用）
  setSelectedAddress(address) {
    this.setData({
      selectedAddress: address,
      receiverName: '',
      receiverPhone: '',
      receiverAddress: ''
    })
  },

  // 输入处理
  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [field]: e.detail.value
    })
  },

  // 提交订单
  async submitOrder() {
    const { items, selectedAddress, receiverName, receiverPhone, receiverAddress, remark, totalAmount, submitting } = this.data

    // 防止重复提交
    if (submitting) return

    // 确定收货信息
    let finalReceiverName, finalReceiverPhone, finalReceiverAddress

    if (selectedAddress) {
      // 使用选择的地址
      finalReceiverName = selectedAddress.receiverName
      finalReceiverPhone = selectedAddress.receiverPhone
      finalReceiverAddress = `${selectedAddress.province} ${selectedAddress.city} ${selectedAddress.district} ${selectedAddress.detail}`
    } else {
      // 使用手动输入的地址
      finalReceiverName = receiverName
      finalReceiverPhone = receiverPhone
      finalReceiverAddress = receiverAddress

      // 验证
      if (!finalReceiverName) {
        return util.showToast('请输入收货人姓名')
      }
      if (!finalReceiverPhone || finalReceiverPhone.length !== 11) {
        return util.showToast('请输入正确的手机号')
      }
      if (!finalReceiverAddress) {
        return util.showToast('请输入收货地址')
      }
    }

    this.setData({ submitting: true })

    try {
      let cartItemIds = []

      // 如果是从立即购买来的（没有cartItemId），需要先加入购物车
      const needAddToCart = items.some(item => !item.cartItemId)

      if (needAddToCart) {
        // 将商品加入购物车
        for (const item of items) {
          await request('/cart', 'POST', {
            productId: item.productId,
            quantity: item.quantity
          })
        }

        // 获取购物车项ID
        const cart = await request('/cart', 'GET')
        cartItemIds = cart.items
          .filter(cartItem => items.some(item => item.productId === cartItem.productId))
          .map(item => item.id)
      } else {
        // 从购物车来的，直接使用cartItemId
        cartItemIds = items.map(item => item.cartItemId)
      }

      // 创建订单
      const order = await request('/orders', 'POST', {
        cartItemIds,
        receiverName: finalReceiverName,
        receiverPhone: finalReceiverPhone,
        receiverAddress: finalReceiverAddress,
        remark
      })

      util.showToast('订单创建成功', 'success')

      // 跳转到订单详情
      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/orders/detail/detail?id=${order.id}`
        })
      }, 1500)

    } catch (err) {
      util.showToast(err.message || '订单创建失败')
      this.setData({ submitting: false })
    }
  }
})