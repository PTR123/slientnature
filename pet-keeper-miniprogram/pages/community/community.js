// pages/community/community.js
const { postApi } = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    posts: [],
    loading: true,
    page: 1,
    pageSize: 10,
    hasMore: true,
    sortBy: 'latest' // latest | hot
  },

  onLoad() {
    this.loadPosts()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
  },

  async loadPosts(append = false) {
    try {
      if (!append) {
        this.setData({ loading: true, page: 1 })
      }

      const { page, pageSize, sortBy } = this.data
      const posts = await postApi.getList({
        page,
        limit: pageSize,
        sort: sortBy
      })

      // 格式化数据
      const formattedPosts = posts.map(post => ({
        ...post,
        createdAt: util.timeAgo(post.createdAt)
      }))

      this.setData({
        posts: append ? [...this.data.posts, ...formattedPosts] : formattedPosts,
        loading: false,
        hasMore: posts.length === pageSize
      })
    } catch (err) {
      console.error('加载帖子列表失败:', err)
      util.showToast('加载失败')
      this.setData({ loading: false })
    }
  },

  // 切换排序
  switchSort(e) {
    const { sort } = e.currentTarget.dataset
    this.setData({ sortBy: sort })
    this.loadPosts()
  },

  // 跳转到详情
  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/community/detail/detail?id=${id}`
    })
  },

  // 跳转到发布
  goToCreate() {
    util.requireLogin(() => {
      wx.navigateTo({
        url: '/pages/community/create/create'
      })
    })
  },

  // 点赞
  async toggleLike(e) {
    const { id, index } = e.currentTarget.dataset

    try {
      const result = await postApi.toggleLike(id)

      const posts = this.data.posts
      posts[index].isLiked = result.liked
      posts[index].likes = result.likes

      this.setData({ posts })
    } catch (err) {
      console.error('点赞失败:', err)
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadPosts()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  },

  // 上拉加载更多
  onReachBottom() {
    if (this.data.hasMore) {
      this.setData({ page: this.data.page + 1 })
      this.loadPosts(true)
    }
  },

  // 预览图片
  previewImage(e) {
    const { urls, current } = e.currentTarget.dataset
    wx.previewImage({
      urls,
      current
    })
  }
})