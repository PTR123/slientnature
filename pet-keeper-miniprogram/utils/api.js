// utils/api.js
// API 请求工具类

const app = getApp()

/**
 * 封装的请求方法
 */
function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    const token = app.globalData.token

    wx.request({
      url: `${app.globalData.apiBaseUrl}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // 未授权，跳转登录
          app.logout()
          wx.navigateTo({ url: '/pages/login/login' })
          reject(new Error('未授权，请登录'))
        } else {
          reject(new Error(res.data.message || '请求失败'))
        }
      },
      fail(err) {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

/**
 * 上传图片
 */
function uploadImage(filePath) {
  return new Promise((resolve, reject) => {
    const token = app.globalData.token

    wx.uploadFile({
      url: `${app.globalData.apiBaseUrl}/upload/image`,
      filePath,
      name: 'image',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success(res) {
        const data = JSON.parse(res.data)
        if (res.statusCode === 200) {
          resolve(data.url)
        } else {
          reject(new Error(data.message || '上传失败'))
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// 认证相关 API
const authApi = {
  // 注册
  register(data) {
    return request('/auth/register', 'POST', data)
  },

  // 登录
  login(data) {
    return request('/auth/login', 'POST', data)
  },

  // 获取当前用户信息
  getCurrentUser() {
    return request('/auth/me')
  }
}

// 宠物相关 API
const petApi = {
  // 获取宠物列表
  getList() {
    return request('/pets')
  },

  // 获取宠物详情
  getDetail(id) {
    return request(`/pets/${id}`)
  },

  // 创建宠物
  create(data) {
    return request('/pets', 'POST', data)
  },

  // 更新宠物
  update(id, data) {
    return request(`/pets/${id}`, 'PUT', data)
  },

  // 删除宠物
  delete(id) {
    return request(`/pets/${id}`, 'DELETE')
  },

  // 添加记录
  addRecord(id, data) {
    return request(`/pets/${id}/records`, 'POST', data)
  },

  // 获取记录
  getRecords(id) {
    return request(`/pets/${id}/records`)
  }
}

// 物种相关 API
const speciesApi = {
  // 获取物种列表
  getList(params = {}) {
    const queryString = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&')
    return request(`/species?${queryString}`)
  },

  // 获取物种详情
  getDetail(id) {
    return request(`/species/${id}`)
  }
}

// 社区相关 API
const postApi = {
  // 获取帖子列表
  getList(params = {}) {
    const queryString = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&')
    return request(`/posts?${queryString}`)
  },

  // 获取帖子详情
  getDetail(id) {
    return request(`/posts/${id}`)
  },

  // 创建帖子
  create(data) {
    return request('/posts', 'POST', data)
  },

  // 删除帖子
  delete(id) {
    return request(`/posts/${id}`, 'DELETE')
  },

  // 点赞/取消点赞
  toggleLike(id) {
    return request(`/posts/${id}/like`, 'POST')
  },

  // 添加评论
  addComment(id, data) {
    return request(`/posts/${id}/comments`, 'POST', data)
  }
}

module.exports = {
  request,
  uploadImage,
  authApi,
  petApi,
  speciesApi,
  postApi
}