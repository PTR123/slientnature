// pages/address/list/list.js
const { request } = require('../../../utils/api')
const util = require('../../../utils/util')

Page({
  data: {
    addresses: [],
    selectMode: false // 是否为选择模式
  },

  onLoad(options) {
    const { select } = options
    this.setData({ selectMode: select === '1' })
  },

  onShow() {
    this.loadAddresses()
  },

  async loadAddresses() {
    try {
      const addresses = await request('/addresses', 'GET')
      this.setData({ addresses })
    } catch (err) {
      console.error('加载地址失败:', err)
      util.showToast('加载失败')
    }
  },

  // 选择地址
  onSelect(e) {
    if (!this.data.selectMode) return

    const { address } = e.currentTarget.dataset
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]

    if (prevPage) {
      prevPage.setSelectedAddress(address)
      wx.navigateBack()
    }
  },

  // 添加地址
  onAdd() {
    wx.navigateTo({
      url: '/pages/address/edit/edit'
    })
  },

  // 编辑地址
  onEdit(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/address/edit/edit?id=${id}`
    })
  },

  // 设为默认
  async onSetDefault(e) {
    const { id } = e.currentTarget.dataset

    try {
      await request(`/addresses/${id}/default`, 'PATCH')
      util.showToast('设置成功', 'success')
      this.loadAddresses()
    } catch (err) {
      util.showToast(err.message || '设置失败')
    }
  },

  // 删除地址
  async onDelete(e) {
    const { id } = e.currentTarget.dataset

    const confirmed = await util.showConfirm('确定要删除这个地址吗？')
    if (!confirmed) return

    try {
      await request(`/addresses/${id}`, 'DELETE')
      util.showToast('删除成功', 'success')
      this.loadAddresses()
    } catch (err) {
      util.showToast(err.message || '删除失败')
    }
  }
})