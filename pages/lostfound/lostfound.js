const app = getApp();
const cloudService = require('../../utils/cloudService');

Page({
  data: {
    lostList: [],
    foundList: [],
    activeTab: 'lost',
    searchKey: '',
    filteredList: [],
    userInfo: null,
    currentStudentId: ''
  },

  onShow() {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo,
      currentStudentId: (userInfo && userInfo.studentId) ? userInfo.studentId : ''
    });
    this.loadData();
  },

  async loadData() {
    try {
      const [lostResult, foundResult] = await Promise.all([
        cloudService.dataAPI.list('lost', null, 50, 1),
        cloudService.dataAPI.list('found', null, 50, 1)
      ]);
      const lostList = lostResult.code === 0 ? lostResult.data.list : [];
      const foundList = foundResult.code === 0 ? foundResult.data.list : [];
      this.setData({ lostList, foundList });
      this.filterList();
    } catch (err) {
      console.error('加载失物招领失败:', err);
    }
  },

  onSearch(e) {
    this.setData({ searchKey: e.detail.value });
    this.filterList();
  },

  filterList() {
    const key = this.data.searchKey.toLowerCase().trim();
    const list = this.data.activeTab === 'lost' ? this.data.lostList : this.data.foundList;
    if (!key) { this.setData({ filteredList: list }); return; }
    const filtered = list.filter(item =>
      (item.title && item.title.toLowerCase().includes(key)) ||
      (item.description && item.description.toLowerCase().includes(key)) ||
      (item.location && item.location.toLowerCase().includes(key))
    );
    this.setData({ filteredList: filtered });
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.type, searchKey: '' });
    this.filterList();
  },

  goDetail(e) {
    wx.vibrateShort({ type: 'light' });
    const { id, type } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/lostfoundDetail/lostfoundDetail?id=${id}&type=${type}` });
  },

  goPublish() { wx.navigateTo({ url: '/pages/lostfoundPublish/lostfoundPublish' }); },

  deleteItem(e) {
    const { id, type } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除', content: '确定删除吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const collection = type === 'lost' ? 'lost' : 'found';
            const result = await cloudService.dataAPI.delete(collection, id);
            if (result.code === 0) {
              this.loadData();
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
    this.loadData().then(() => wx.stopPullDownRefresh());
  }
});
