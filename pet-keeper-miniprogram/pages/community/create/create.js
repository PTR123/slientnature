// pages/community/create/create.js
const { postApi } = require('../../../utils/api')
const util = require('../../../utils/util')

Page({
  data: {
    title: '',
    content: '',
    images: [],
    tags: [],
    tagInput: '',
    submitting: false
  },

  // 输入标题
  onTitleInput(e) {
    this.setData({ title: e.detail.value })
  },

  // 输入内容
  onContentInput(e) {
    this.setData({ content: e.detail.value })
  },

  // 选择图片
  async chooseImage() {
    try {
      const { images } = this.data
      if (images.length >= 9) {
        util.showToast('最多上传9张图片')
        return
      }

      const tempFiles = await util.chooseImage(9 - images.length)
      util.showLoading('上传中...')

      // 上传图片
      const uploadPromises = tempFiles.map(filePath => postApi.uploadImage(filePath))
      const urls = await Promise.all(uploadPromises)

      this.setData({
        images: [...images, ...urls]
      })

      util.hideLoading()
      util.showToast('上传成功')
    } catch (err) {
      console.error('上传图片失败:', err)
      util.hideLoading()
      util.showToast('上传失败')
    }
  },

  // 删除图片
  deleteImage(e) {
    const { index } = e.currentTarget.dataset
    const images = this.data.images
    images.splice(index, 1)
    this.setData({ images })
  },

  // 预览图片
  previewImage(e) {
    const { url } = e.currentTarget.dataset
    wx.previewImage({
      urls: this.data.images,
      current: url
    })
  },

  // 输入标签
  onTagInput(e) {
    this.setData({ tagInput: e.detail.value })
  },

  // 添加标签
  addTag() {
    const { tagInput, tags } = this.data
    const tag = tagInput.trim()

    if (!tag) {
      return
    }

    if (tags.includes(tag)) {
      util.showToast('标签已存在')
      return
    }

    if (tags.length >= 5) {
      util.showToast('最多添加5个标签')
      return
    }

    this.setData({
      tags: [...tags, tag],
      tagInput: ''
    })
  },

  // 删除标签
  deleteTag(e) {
    const { index } = e.currentTarget.dataset
    const tags = this.data.tags
    tags.splice(index, 1)
    this.setData({ tags })
  },

  // 提交帖子
  async submitPost() {
    const { title, content, images, tags, submitting } = this.data

    if (submitting) return

    // 验证
    if (!title.trim()) {
      util.showToast('请输入标题')
      return
    }

    if (!content.trim()) {
      util.showToast('请输入内容')
      return
    }

    try {
      this.setData({ submitting: true })
      util.showLoading('发布中...')

      await postApi.create({
        title: title.trim(),
        content: content.trim(),
        images,
        tags
      })

      util.hideLoading()
      util.showToast('发布成功')

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (err) {
      console.error('发布失败:', err)
      util.hideLoading()
      util.showToast('发布失败')
      this.setData({ submitting: false })
    }
  }
})