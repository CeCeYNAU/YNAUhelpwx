const app = getApp();
const cloudService = require('../../utils/cloudService');

Page({
  data: {
    studyList: [],
    searchKey: '',
    activeTab: 'latest',
    currentStudentId: ''
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({ currentStudentId: userInfo ? userInfo.studentId : '' });
    this.loadStudy();
  },

  async loadStudy() {
    try {
      const result = await cloudService.dataAPI.list('study', null, 50, 1);
      if (result.code === 0) {
        let list = result.data.list;
        list = this.data.activeTab === 'latest'
          ? list.sort((a, b) => b.createdAt - a.createdAt)
          : list.sort((a, b) => (b.views || 0) - (a.views || 0));
        if (this.data.searchKey) {
          const key = this.data.searchKey.toLowerCase();
          list = list.filter(i =>
            (i.title || '').toLowerCase().includes(key) ||
            (i.course || '').toLowerCase().includes(key) ||
            (i.teacher || '').toLowerCase().includes(key)
          );
        }
        const displayList = list.map(i => ({
          ...i,
          _typeTag: i.type === '笔记' ? 'green' : i.type === '资料' ? 'blue' : i.type === '评价' ? 'gold' : 'green',
          _typeText: i.type || '分享',
          _views: i.views || 0,
          _author: i.authorNickName || i.author || '匿名',
          _course: i.course || '',
          _teacher: i.teacher || ''
        }));
        this.setData({ studyList: displayList });
      }
    } catch (err) {
      console.error('加载学习资料失败:', err);
    }
  },

  onSearch(e) {
    this.setData({ searchKey: e.detail.value });
    this.loadStudy();
  },

  onCat(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
    this.loadStudy();
  },

  goPublish() {
    wx.vibrateShort({ type: 'light' });
    wx.navigateTo({ url: '/pages/studyPublish/studyPublish' });
  },

  goDetail(e) {
    wx.vibrateShort({ type: 'light' });
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/studyDetail/studyDetail?id=${id}` });
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这份资料吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await cloudService.dataAPI.delete('study', id);
            if (result.code === 0) {
              this.loadStudy();
              wx.showToast({ title: '已删除', icon: 'success' });
            }
          } catch (err) {
            console.error('删除失败:', err);
          }
        }
      }
    });
  },

  onPullDownRefresh() {
    this.loadStudy().then(() => wx.stopPullDownRefresh());
  }
});
