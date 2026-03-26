// pages/pets/detail/detail.js
const { petApi } = require('../../../utils/api')
const util = require('../../../utils/util')

Page({
  data: {
    pet: null,
    records: [],
    loading: true,
    showRecordModal: false,
    recordType: 'feed',
    recordContent: '',
    recordNotes: ''
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.setData({ petId: id })
      this.loadPetDetail(id)
    }
  },

  async loadPetDetail(id) {
    try {
      util.showLoading('加载中...')

      const [pet, records] = await Promise.all([
        petApi.getDetail(id),
        petApi.getRecords(id)
      ])

      // 格式化数据
      pet.createdAt = util.formatDate(pet.createdAt, 'YYYY-MM-DD')
      pet.birthDate = pet.birthDate ? util.formatDate(pet.birthDate, 'YYYY-MM-DD') : ''

      const formattedRecords = records.map(record => ({
        ...record,
        createdAt: util.formatDate(record.createdAt, 'YYYY-MM-DD HH:mm')
      }))

      this.setData({
        pet,
        records: formattedRecords,
        loading: false
      })

      wx.setNavigationBarTitle({
        title: pet.name || '宠物详情'
      })

      util.hideLoading()
    } catch (err) {
      console.error('加载宠物详情失败:', err)
      util.hideLoading()
      util.showToast('加载失败')
      this.setData({ loading: false })
    }
  },

  // 显示添加记录弹窗
  showAddRecord() {
    this.setData({ showRecordModal: true })
  },

  // 隐藏添加记录弹窗
  hideAddRecord() {
    this.setData({
      showRecordModal: false,
      recordType: 'feed',
      recordContent: '',
      recordNotes: ''
    })
  },

  // 选择记录类型
  onRecordTypeChange(e) {
    this.setData({ recordType: e.detail.value })
  },

  // 输入记录内容
  onRecordContentInput(e) {
    this.setData({ recordContent: e.detail.value })
  },

  // 输入记录备注
  onRecordNotesInput(e) {
    this.setData({ recordNotes: e.detail.value })
  },

  // 提交记录
  async submitRecord() {
    const { petId, recordType, recordContent, recordNotes } = this.data

    if (!recordContent) {
      util.showToast('请输入记录内容')
      return
    }

    try {
      util.showLoading('提交中...')

      await petApi.addRecord(petId, {
        type: recordType,
        content: recordContent,
        notes: recordNotes
      })

      util.hideLoading()
      util.showToast('添加成功')

      // 重新加载记录
      this.hideAddRecord()
      this.loadPetDetail(petId)
    } catch (err) {
      console.error('添加记录失败:', err)
      util.hideLoading()
      util.showToast('添加失败')
    }
  },

  // 编辑宠物
  editPet() {
    const { petId } = this.data
    wx.navigateTo({
      url: `/pages/pets/create/create?id=${petId}`
    })
  },

  // 删除宠物
  async deletePet() {
    const confirmed = await util.showConfirm('确定要删除这只宠物吗？此操作不可恢复')

    if (!confirmed) return

    try {
      util.showLoading('删除中...')

      await petApi.delete(this.data.petId)

      util.hideLoading()
      util.showToast('删除成功')

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (err) {
      console.error('删除宠物失败:', err)
      util.hideLoading()
      util.showToast('删除失败')
    }
  },

  // 预览图片
  previewImage() {
    const { pet } = this.data
    if (pet && pet.image) {
      wx.previewImage({
        urls: [pet.image],
        current: pet.image
      })
    }
  },

  onPullDownRefresh() {
    const { petId } = this.data
    this.loadPetDetail(petId)
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  }
})