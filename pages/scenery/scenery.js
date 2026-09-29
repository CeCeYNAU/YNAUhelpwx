const app = getApp();
const cloudService = require('../../utils/cloudService');

Page({
  data: {
    list: [],
    userInfo: null
  },

  onShow() {
    this.setData({ userInfo: wx.getStorageSync('userInfo') });
    this.loadData();
  },

  async loadData() {
    try {
      const result = await cloudService.dataAPI.list('scenery', null, 50, 1);
      if (result.code === 0) {
        const list = result.data.list.map(item => ({
          ...item,
          _views: item.views || 0
        }));
        this.setData({ list });
      }
    } catch (err) {
      console.error('加载风景失败:', err);
    }
  },

  goPublish() {
    wx.vibrateShort({ type: 'light' });
    wx.navigateTo({ url: '/pages/sceneryPublish/sceneryPublish' });
  },

  goDetail(e) {
    wx.vibrateShort({ type: 'light' });
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/sceneryDetail/sceneryDetail?id=${id}`
    });
  },

  previewImage(e) {
    const index = e.currentTarget.dataset.index;
    const urls = this.data.list.map(item => item.imagePath).filter(Boolean);
    if (urls.length > 0) {
      wx.previewImage({ current: urls[index], urls });
    }
  },

  deleteItem(e) {
    const id = e.currentTarget.dataset.id;
    const { userInfo } = this.data;
    if (!userInfo) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    wx.showModal({
      title: '确认删除',
      content: '确定删除这张照片吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await cloudService.dataAPI.delete('scenery', id);
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
