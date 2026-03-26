// pages/community/detail/detail.js
const { postApi } = require('../../../utils/api')
const util = require('../../../utils/util')

Page({
  data: {
    post: null,
    comments: [],
    loading: true,
    commentContent: '',
    replyTo: null
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.setData({ postId: id })
      this.loadPostDetail(id)
    }
  },

  async loadPostDetail(id) {
    try {
      util.showLoading('加载中...')

      const post = await postApi.getDetail(id)

      // 格式化数据
      post.createdAt = util.timeAgo(post.createdAt)

      if (post.comments) {
        post.comments = post.comments.map(comment => ({
          ...comment,
          createdAt: util.timeAgo(comment.createdAt)
        }))
      }

      this.setData({
        post,
        comments: post.comments || [],
        loading: false
      })

      wx.setNavigationBarTitle({
        title: '帖子详情'
      })

      util.hideLoading()
    } catch (err) {
      console.error('加载帖子详情失败:', err)
      util.hideLoading()
      util.showToast('加载失败')
      this.setData({ loading: false })
    }
  },

  // 点赞
  async toggleLike() {
    const { post, postId } = this.data

    try {
      const result = await postApi.toggleLike(postId)

      this.setData({
        'post.isLiked': result.liked,
        'post.likes': result.likes
      })
    } catch (err) {
      console.error('点赞失败:', err)
    }
  },

  // 输入评论
  onCommentInput(e) {
    this.setData({ commentContent: e.detail.value })
  },

  // 回复评论
  replyToComment(e) {
    const { id, username } = e.currentTarget.dataset
    this.setData({
      replyTo: { id, username },
      commentContent: `@${username} `
    })
  },

  // 取消回复
  cancelReply() {
    this.setData({
      replyTo: null,
      commentContent: ''
    })
  },

  // 提交评论
  async submitComment() {
    const { postId, commentContent, replyTo } = this.data

    if (!commentContent.trim()) {
      util.showToast('请输入评论内容')
      return
    }

    try {
      util.showLoading('发表中...')

      await postApi.addComment(postId, {
        content: commentContent,
        replyTo: replyTo ? replyTo.id : null
      })

      util.hideLoading()
      util.showToast('发表成功')

      // 重新加载帖子
      this.setData({
        commentContent: '',
        replyTo: null
      })
      this.loadPostDetail(postId)
    } catch (err) {
      console.error('发表评论失败:', err)
      util.hideLoading()
      util.showToast('发表失败')
    }
  },

  // 删除帖子
  async deletePost() {
    const confirmed = await util.showConfirm('确定要删除这篇帖子吗？')

    if (!confirmed) return

    try {
      util.showLoading('删除中...')

      await postApi.delete(this.data.postId)

      util.hideLoading()
      util.showToast('删除成功')

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (err) {
      console.error('删除帖子失败:', err)
      util.hideLoading()
      util.showToast('删除失败')
    }
  },

  // 预览图片
  previewImage(e) {
    const { urls, current } = e.currentTarget.dataset
    wx.previewImage({
      urls,
      current
    })
  },

  // 复制文本
  copyContent() {
    const { post } = this.data
    if (post) {
      wx.setClipboardData({
        data: `${post.title}\n\n${post.content}`,
        success: () => {
          util.showToast('已复制')
        }
      })
    }
  },

  onPullDownRefresh() {
    const { postId } = this.data
    this.loadPostDetail(postId)
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  },

  onShareAppMessage() {
    const { post } = this.data
    if (post) {
      return {
        title: post.title,
        path: `/pages/community/detail/detail?id=${post.id}`,
        imageUrl: post.images ? post.images[0] : ''
      }
    }
  }
})