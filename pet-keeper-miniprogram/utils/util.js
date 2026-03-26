// utils/util.js
// 工具函数

/**
 * 格式化日期
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')

  if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`
  } else if (format === 'YYYY-MM-DD HH:mm') {
    return `${year}-${month}-${day} ${hour}:${minute}`
  } else if (format === 'YYYY-MM-DD HH:mm:ss') {
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
  return `${year}-${month}-${day}`
}

/**
 * 相对时间
 */
function timeAgo(date) {
  if (!date) return ''
  const now = new Date()
  const d = new Date(date)
  const diff = (now - d) / 1000

  if (diff < 60) {
    return '刚刚'
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}分钟前`
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)}小时前`
  } else if (diff < 2592000) {
    return `${Math.floor(diff / 86400)}天前`
  } else {
    return formatDate(date, 'YYYY-MM-DD')
  }
}

/**
 * 显示加载
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载
 */
function hideLoading() {
  wx.hideLoading()
}

/**
 * 显示提示
 */
function showToast(title, icon = 'none') {
  wx.showToast({
    title,
    icon,
    duration: 2000
  })
}

/**
 * 显示确认对话框
 */
function showConfirm(content, title = '提示') {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      success(res) {
        if (res.confirm) {
          resolve(true)
        } else {
          resolve(false)
        }
      },
      fail: reject
    })
  })
}

/**
 * 选择图片
 */
function chooseImage(count = 1) {
  return new Promise((resolve, reject) => {
    wx.chooseMedia({
      count,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFiles = res.tempFiles.map(file => file.tempFilePath)
        resolve(tempFiles)
      },
      fail: reject
    })
  })
}

/**
 * 预览图片
 */
function previewImage(urls, current = '') {
  wx.previewImage({
    urls,
    current
  })
}

/**
 * 检查是否登录
 */
function checkLogin() {
  const app = getApp()
  if (!app.isLoggedIn()) {
    wx.navigateTo({
      url: '/pages/login/login'
    })
    return false
  }
  return true
}

/**
 * 需要登录的操作
 */
function requireLogin(callback) {
  if (checkLogin()) {
    callback()
  }
}

module.exports = {
  formatDate,
  timeAgo,
  showLoading,
  hideLoading,
  showToast,
  showConfirm,
  chooseImage,
  previewImage,
  checkLogin,
  requireLogin
}