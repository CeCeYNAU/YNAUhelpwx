const app = getApp();
const cloudService = require('../../utils/cloudService');

Page({
  data: { item: null },

  async onLoad(options) {
    const collection = options.type === 'found' ? 'found' : 'lost';
    try {
      const result = await cloudService.dataAPI.detail(collection, options.id);
      if (result.code === 0) {
        this.setData({ item: result.data });
      } else {
        wx.showToast({ title: '信息不存在', icon: 'none' });
        setTimeout(() => wx.navigateBack(), 1000);
      }
    } catch (err) {
      console.error('加载详情失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  callPhone() {
    if (!this.data.item || !this.data.item.contact) return;
    const match = this.data.item.contact.match(/1[3-9]\d{9}/);
    if (match) {
      wx.makePhoneCall({ phoneNumber: match[0], fail: () => wx.showToast({ title: '拨打失败', icon: 'none' }) });
    } else {
      wx.setClipboardData({ data: this.data.item.contact, success: () => wx.showToast({ title: '已复制', icon: 'success' }) });
    }
  }
});
