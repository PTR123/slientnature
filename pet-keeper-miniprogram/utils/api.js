// utils/api.js
// API 请求工具类

const app = getApp()

/**
 * 封装的请求方法
 */
function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    const token = app.globalData.token

    console.log('🚀 API Request:', {
      url: `${app.globalData.apiBaseUrl}${url}`,
      method,
      data,
      hasToken: !!token
    })

    wx.request({
      url: `${app.globalData.apiBaseUrl}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success(res) {
        console.log('✅ API Response:', res)

        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // 未授权
          console.error('❌ 401 Unauthorized:', res.data)
          const errorMsg = res.data.error || res.data.message || '未授权，请登录'
          reject(new Error(errorMsg))
        } else if (res.statusCode === 400) {
          // 参数错误
          console.error('❌ 400 Bad Request:', res.data)
          const errorMsg = res.data.error || '请求参数错误'
          reject(new Error(errorMsg))
        } else if (res.statusCode === 404) {
          // 资源不存在
          console.error('❌ 404 Not Found:', res.data)
          const errorMsg = res.data.error || '请求的资源不存在'
          reject(new Error(errorMsg))
        } else if (res.statusCode === 500) {
          // 服务器错误
          console.error('❌ 500 Server Error:', res.data)
          const errorMsg = res.data.error || '服务器错误，请稍后重试'
          reject(new Error(errorMsg))
        } else {
          // 其他错误
          console.error('❌ API Error:', res)
          const errorMsg = res.data.error || res.data.message || `请求失败(${res.statusCode})`
          reject(new Error(errorMsg))
        }
      },
      fail(err) {
        console.error('❌ Network Error:', err)
        const errorMsg = err.errMsg || '网络连接失败，请检查网络设置'
        reject(new Error(errorMsg))
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
        try {
          const data = JSON.parse(res.data)
          if (res.statusCode === 200 && data.url) {
            resolve(data.url)
          } else {
            reject(new Error(data.error || data.message || '上传失败'))
          }
        } catch (e) {
          console.error('Parse upload response error:', e)
          reject(new Error('服务器响应格式错误'))
        }
      },
      fail(err) {
        console.error('Upload network error:', err)
        reject(new Error(err.errMsg || '网络连接失败'))
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

  // 邮箱登录
  login(data) {
    return request('/auth/login', 'POST', data)
  },

  // 手机号登录
  loginWithPhone(data) {
    return request('/auth/login/phone', 'POST', data)
  },

  // 微信手机号登录
  wechatLogin(data) {
    return request('/auth/login/wechat', 'POST', data)
  },

  // 发送短信验证码
  sendSmsCode(data) {
    return request('/auth/sms/send', 'POST', data)
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
  },

  // 上传图片
  uploadImage(filePath) {
    return uploadImage(filePath)
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
  },

  // 上传图片
  uploadImage(filePath) {
    return uploadImage(filePath)
  }
}

// 商城相关 API
const shopApi = {
  // 获取商品列表
  getProducts(params = {}) {
    const queryString = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&')
    return request(`/products?${queryString}`)
  },

  // 获取商品详情
  getProduct(id) {
    return request(`/products/${id}`)
  },

  // 获取分类列表
  getCategories() {
    return request('/categories')
  }
}

// 购物车相关 API
const cartApi = {
  // 获取购物车
  getCart() {
    return request('/cart')
  },

  // 添加到购物车
  addToCart(data) {
    return request('/cart', 'POST', data)
  },

  // 更新购物车项
  updateCartItem(id, data) {
    return request(`/cart/${id}`, 'PUT', data)
  },

  // 删除购物车项
  removeFromCart(id) {
    return request(`/cart/${id}`, 'DELETE')
  }
}

// 订单相关 API
const orderApi = {
  // 获取订单列表
  getOrders(params = {}) {
    const queryString = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&')
    return request(`/orders?${queryString}`)
  },

  // 获取订单详情
  getOrder(id) {
    return request(`/orders/${id}`)
  },

  // 创建订单
  createOrder(data) {
    return request('/orders', 'POST', data)
  },

  // 取消订单
  cancelOrder(id) {
    return request(`/orders/${id}/cancel`, 'POST')
  },

  // 确认收货
  confirmOrder(id) {
    return request(`/orders/${id}/complete`, 'POST')
  }
}

// 支付相关 API
const paymentApi = {
  // 发起支付
  createPayment(orderId) {
    return request(`/payment/${orderId}`, 'POST')
  }
}

module.exports = {
  request,
  uploadImage,
  authApi,
  petApi,
  speciesApi,
  postApi,
  shopApi,
  cartApi,
  orderApi,
  paymentApi
}