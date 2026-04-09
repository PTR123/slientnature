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

      // 后端已经解析了JSON数组，检查是否需要再次解析
      const parsedSpecies = {
        ...species,
        dietList: Array.isArray(species.diet) ? species.diet : this.parseJsonArray(species.diet),
        substrateList: Array.isArray(species.substrate) ? species.substrate : this.parseJsonArray(species.substrate),
        decorList: Array.isArray(species.decor) ? species.decor : this.parseJsonArray(species.decor),
        lifecycleList: Array.isArray(species.lifecycle) ? species.lifecycle : this.parseJsonArray(species.lifecycle),
        diseasesList: Array.isArray(species.diseases) ? species.diseases : this.parseJsonArray(species.diseases)
      }

      this.setData({
        species: parsedSpecies,
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

  // 解析JSON数组字符串
  parseJsonArray(jsonStr) {
    if (!jsonStr) return []
    try {
      const parsed = JSON.parse(jsonStr)
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.error('解析JSON数组失败:', e)
      return []
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

  // 图片加载错误处理
  onImageError(e) {
    console.error('图片加载失败:', e.detail)
    // 设置默认图片
    this.setData({
      species: {
        ...this.data.species,
        image: '/images/default-species.png'
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