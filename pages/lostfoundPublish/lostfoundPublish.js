const app = getApp();
const cloudService = require('../../utils/cloudService');

Page({
  data: { type: 'lost', title: '', desc: '', location: '', contact: '' },

  setType(e) { this.setData({ type: e.currentTarget.dataset.t }); },
  onTitle(e) { this.setData({ title: e.detail.value }); },
  onDesc(e) { this.setData({ desc: e.detail.value }); },
  onLocation(e) { this.setData({ location: e.detail.value }); },
  onContact(e) { this.setData({ contact: e.detail.value }); },

  async submit() {
    if (!this.data.title.trim() || !this.data.desc.trim() || !this.data.contact.trim()) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' }); return;
    }
    const info = wx.getStorageSync('userInfo');
    try {
      const collection = this.data.type === 'lost' ? 'lost' : 'found';
      const result = await cloudService.dataAPI.create(collection, {
        title: this.data.title.trim(),
        description: this.data.desc.trim(),
        location: this.data.location || '未指定',
        contact: this.data.contact.trim(),
        authorId: info ? info.studentId : ''
      });
      if (result.code === 0) {
        wx.showToast({ title: '发布成功', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 800);
      } else {
        wx.showToast({ title: result.msg || '发布失败', icon: 'none' });
      }
    } catch (err) {
      console.error('发布失败:', err);
      wx.showToast({ title: '网络错误', icon: 'none' });
    }
  }
});
