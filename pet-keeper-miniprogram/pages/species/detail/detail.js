// pages/species/detail/detail.js
const { speciesApi } = require('../../../utils/api')
const util = require('../../../utils/util')

Page({
  data: {
    species: null,
    loading: true
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.loadSpeciesDetail(id)
    }
  },

  async loadSpeciesDetail(id) {
    try {
      util.showLoading('加载中...')

      const species = await speciesApi.getDetail(id)

      this.setData({
        species,
        loading: false
      })

      wx.setNavigationBarTitle({
        title: species.name || '物种详情'
      })

      util.hideLoading()
    } catch (err) {
      console.error('加载物种详情失败:', err)
      util.hideLoading()
      util.showToast('加载失败')
      this.setData({ loading: false })
    }
  },

  // 预览图片
  previewImage(e) {
    const { url } = e.currentTarget.dataset
    const { species } = this.data

    if (species && species.images && species.images.length > 0) {
      wx.previewImage({
        urls: species.images,
        current: url || species.images[0]
      })
    } else if (species && species.image) {
      wx.previewImage({
        urls: [species.image],
        current: species.image
      })
    }
  },

  // 复制文本
  copyText(e) {
    const { text } = e.currentTarget.dataset
    wx.setClipboardData({
      data: text,
      success: () => {
        util.showToast('已复制')
      }
    })
  },

  onPullDownRefresh() {
    const { species } = this.data
    if (species && species.id) {
      this.loadSpeciesDetail(species.id)
    }
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  },

  onShareAppMessage() {
    const { species } = this.data
    if (species) {
      return {
        title: `${species.name} - PetKeeper物种图鉴`,
        path: `/pages/species/detail/detail?id=${species.id}`,
        imageUrl: species.image || ''
      }
    }
  }
})