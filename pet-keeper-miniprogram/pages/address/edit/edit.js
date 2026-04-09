// pages/address/edit/edit.js
const { request } = require('../../../utils/api')
const util = require('../../../utils/util')

Page({
  data: {
    id: null,
    receiverName: '',
    receiverPhone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false,
    saving: false
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.setData({ id })
      this.loadAddress(id)
    }
  },

  async loadAddress(id) {
    try {
      const address = await request(`/addresses/${id}`, 'GET')
      this.setData({
        receiverName: address.receiverName,
        receiverPhone: address.receiverPhone,
        province: address.province,
        city: address.city,
        district: address.district,
        detail: address.detail,
        isDefault: address.isDefault
      })

      wx.setNavigationBarTitle({ title: '编辑地址' })
    } catch (err) {
      console.error('加载地址失败:', err)
      util.showToast('加载失败')
    }
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [field]: e.detail.value
    })
  },

  onSwitch(e) {
    this.setData({
      isDefault: e.detail.value
    })
  },

  async onSave() {
    const { id, receiverName, receiverPhone, province, city, district, detail, isDefault, saving } = this.data

    // 防止重复提交
    if (saving) return

    // 验证
    if (!receiverName) {
      return util.showToast('请输入收货人姓名')
    }
    if (!receiverPhone || receiverPhone.length !== 11) {
      return util.showToast('请输入正确的手机号')
    }
    if (!province || !city || !district) {
      return util.showToast('请输入完整的省市区')
    }
    if (!detail) {
      return util.showToast('请输入详细地址')
    }

    this.setData({ saving: true })

    try {
      const data = {
        receiverName,
        receiverPhone,
        province,
        city,
        district,
        detail,
        isDefault
      }

      if (id) {
        // 编辑
        await request(`/addresses/${id}`, 'PUT', data)
        util.showToast('保存成功', 'success')
      } else {
        // 新增
        await request('/addresses', 'POST', data)
        util.showToast('添加成功', 'success')
      }

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)

    } catch (err) {
      util.showToast(err.message || '保存失败')
      this.setData({ saving: false })
    }
  }
})