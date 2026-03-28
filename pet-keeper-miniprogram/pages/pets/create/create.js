// pages/pets/create/create.js
const { petApi, speciesApi } = require('../../../utils/api')
const util = require('../../../utils/util')

Page({
  data: {
    isEdit: false,
    petId: null,
    formData: {
      name: '',
      species: '',
      speciesId: '',
      breed: '',
      gender: 'unknown',
      birthDate: '',
      age: '',
      weight: '',
      color: '',
      image: '',
      notes: ''
    },
    speciesList: [],
    genderOptions: [
      { value: 'male', label: '公' },
      { value: 'female', label: '母' },
      { value: 'unknown', label: '未知' }
    ],
    genderIndex: 2 // 默认选中"未知"
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.setData({ isEdit: true, petId: id })
      this.loadPetData(id)
    }
    this.loadSpeciesList()
  },

  async loadSpeciesList() {
    try {
      const species = await speciesApi.getList()
      this.setData({ speciesList: species })
    } catch (err) {
      console.error('加载物种列表失败:', err)
    }
  },

  async loadPetData(id) {
    try {
      util.showLoading('加载中...')
      const pet = await petApi.getDetail(id)

      this.setData({
        formData: {
          name: pet.name || '',
          species: pet.speciesName || '',
          speciesId: pet.speciesId || pet.species || '',
          breed: pet.breed || '',
          gender: pet.gender || 'unknown',
          birthDate: pet.birthDate ? util.formatDate(pet.birthDate, 'YYYY-MM-DD') : '',
          age: pet.age || '',
          weight: pet.weight || '',
          color: pet.color || '',
          image: pet.image || '',
          notes: pet.notes || ''
        },
        genderIndex: this.data.genderOptions.findIndex(item => item.value === (pet.gender || 'unknown'))
      })

      wx.setNavigationBarTitle({
        title: '编辑宠物'
      })

      util.hideLoading()
    } catch (err) {
      console.error('加载宠物数据失败:', err)
      util.hideLoading()
      util.showToast('加载失败')
    }
  },

  // 选择图片
  async chooseImage() {
    try {
      const tempFiles = await util.chooseImage(1)
      util.showLoading('上传中...')

      const imageUrl = await petApi.uploadImage(tempFiles[0])

      this.setData({
        'formData.image': imageUrl
      })

      util.hideLoading()
      util.showToast('上传成功')
    } catch (err) {
      console.error('上传图片失败:', err)
      util.hideLoading()
      util.showToast('上传失败')
    }
  },

  // 输入框变化
  onInputChange(e) {
    const { field } = e.currentTarget.dataset
    const { value } = e.detail
    this.setData({
      [`formData.${field}`]: value
    })
  },

  // 选择物种
  onSpeciesChange(e) {
    const index = e.detail.value
    const species = this.data.speciesList[index]
    this.setData({
      'formData.species': species.name,
      'formData.speciesId': species.id
    })
  },

  // 选择性别
  onGenderChange(e) {
    const index = e.detail.value
    const gender = this.data.genderOptions[index]
    this.setData({
      'formData.gender': gender.value,
      genderIndex: index
    })
  },

  // 选择出生日期
  onBirthDateChange(e) {
    this.setData({
      'formData.birthDate': e.detail.value
    })
  },

  // 提交表单
  async submitForm() {
    const { formData, isEdit, petId } = this.data

    // 验证必填项
    if (!formData.name) {
      util.showToast('请输入宠物名称')
      return
    }

    if (!formData.speciesId) {
      util.showToast('请选择物种')
      return
    }

    try {
      util.showLoading(isEdit ? '保存中...' : '创建中...')

      const data = {
        name: formData.name,
        species: formData.speciesId,
        breed: formData.breed,
        gender: formData.gender,
        birthDate: formData.birthDate,
        age: formData.age,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        color: formData.color,
        image: formData.image,
        notes: formData.notes
      }

      if (isEdit) {
        await petApi.update(petId, data)
        util.showToast('保存成功')
      } else {
        await petApi.create(data)
        util.showToast('创建成功')
      }

      util.hideLoading()

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (err) {
      console.error('提交失败:', err)
      util.hideLoading()
      util.showToast('提交失败')
    }
  },

  // 重置表单
  resetForm() {
    this.setData({
      formData: {
        name: '',
        species: '',
        speciesId: '',
        breed: '',
        gender: 'unknown',
        birthDate: '',
        age: '',
        weight: '',
        color: '',
        image: '',
        notes: ''
      }
    })
  }
})