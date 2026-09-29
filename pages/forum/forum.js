const app = getApp();
const cloudService = require('../../utils/cloudService');

Page({
  data: {
    posts: [],
    activeTab: 'latest',
    loading: false,
    currentStudentId: ''
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({ currentStudentId: userInfo ? userInfo.studentId : '' });
    this.loadPosts();
  },

  async loadPosts() {
    this.setData({ loading: true });
    try {
      const result = await cloudService.dataAPI.list('forum', null, 50, 1);
      if (result.code === 0) {
        const posts = result.data.list;
        const sorted = this.data.activeTab === 'latest'
          ? posts.sort((a, b) => b.createdAt - a.createdAt)
          : posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        const displayList = sorted.map(p => ({
          ...p,
          _author: p.authorNickName || p.author || '匿名',
          _categoryTag: p.category === '求助' ? 'blue' : p.category === '吐槽' ? 'red' : p.category === '分享' ? 'green' : 'gold',
          _categoryText: p.category || '综合',
          _likes: p.likes || 0,
          _commentCount: (p.comments || []).length
        }));
        this.setData({ posts: displayList });
      }
    } catch (err) {
      console.error('加载帖子失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onCat(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
    this.loadPosts();
  },

  goPublish() {
    wx.vibrateShort({ type: 'light' });
    wx.navigateTo({ url: '/pages/forumPublish/forumPublish' });
  },

  goDetail(e) {
    wx.vibrateShort({ type: 'light' });
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/forumDetail/forumDetail?id=${id}` });
  },

  async onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条帖子吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await cloudService.dataAPI.delete('forum', id);
            if (result.code === 0) {
              this.loadPosts();
              wx.showToast({ title: '已删除', icon: 'success' });
            } else {
              wx.showToast({ title: result.msg || '删除失败', icon: 'none' });
            }
          } catch (err) {
            console.error('删除失败:', err);
            wx.showToast({ title: '网络错误', icon: 'none' });
          }
        }
      }
    });
  },

  onPullDownRefresh() {
    this.loadPosts().then(() => wx.stopPullDownRefresh());
  }
});
