const app = getApp();
const cloudService = require('../../utils/cloudService');

Page({
  data: {
    post: null,
    commentInput: '',
    currentStudentId: '',
    postId: ''
  },

  onLoad(options) {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      currentStudentId: userInfo ? userInfo.studentId : '',
      postId: options.id
    });
    this.loadPost(options.id);
  },

  async loadPost(id) {
    try {
      const result = await cloudService.dataAPI.detail('forum', id);
      if (result.code === 0) {
        const post = result.data;
        const comments = post.comments || [];
        const displayPost = {
          ...post,
          _author: post.authorNickName || post.author || '匿名',
          _categoryTag: post.category === '求助' ? 'blue' : post.category === '吐槽' ? 'red' : post.category === '分享' ? 'green' : 'gold',
          _categoryText: post.category || '综合',
          _likes: post.likes || 0,
          _commentCount: comments.length,
          comments: comments.map(c => ({
            ...c,
            _author: c.authorNickName || c.author || '匿名'
          }))
        };
        this.setData({ post: displayPost, comments: displayPost.comments });
      } else {
        wx.showToast({ title: '帖子不存在', icon: 'none' });
        setTimeout(() => wx.navigateBack(), 1000);
      }
    } catch (err) {
      console.error('加载帖子失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  onCommentInput(e) {
    this.setData({ commentInput: e.detail.value });
  },

  async addComment() {
    if (!this.data.commentInput.trim()) return;
    const userInfo = wx.getStorageSync('userInfo');
    const comment = {
      author: userInfo ? userInfo.studentId : '匿名',
      authorNickName: userInfo ? userInfo.nickName : '匿名',
      content: this.data.commentInput.trim(),
      timestamp: Date.now()
    };

    try {
      const post = this.data.post;
      const comments = post.comments || [];
      comments.push(comment);
      const result = await cloudService.dataAPI.update('forum', post._id, { comments });
      if (result.code === 0) {
        this.setData({ commentInput: '' });
        this.loadPost(this.data.postId);
        wx.showToast({ title: '评论成功', icon: 'success' });
      } else {
        wx.showToast({ title: result.msg || '评论失败', icon: 'none' });
      }
    } catch (err) {
      console.error('评论失败:', err);
      wx.showToast({ title: '网络错误', icon: 'none' });
    }
  },

  async toggleLike() {
    try {
      const post = this.data.post;
      const result = await cloudService.dataAPI.increment('forum', post._id, { likes: 1 });
      if (result.code === 0) {
        this.loadPost(this.data.postId);
        wx.vibrateShort({ type: 'light' });
      }
    } catch (err) {
      console.error('点赞失败:', err);
    }
  }
});
