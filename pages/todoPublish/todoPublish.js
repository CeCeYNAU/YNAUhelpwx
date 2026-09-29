const app = getApp();
const cloudService = require('../../utils/cloudService');

Page({
  data: { title: '', deadline: '', category: '', categories: ['学习', '生活', '工作', '其他'] },

  onTitle(e) { this.setData({ title: e.detail.value }); },
  onDate(e) { this.setData({ deadline: e.detail.value }); },
  onCat(e) { this.setData({ category: this.data.categories[e.detail.value] }); },

  async submit() {
    if (!this.data.title.trim()) { wx.showToast({ title: '请输入标题', icon: 'none' }); return; }
    const info = wx.getStorageSync('userInfo');
    try {
      const result = await cloudService.dataAPI.create('todo', {
        title: this.data.title.trim(),
        deadline: this.data.deadline,
        category: this.data.category || '其他',
        completed: false,
        authorId: info ? info.studentId : ''
      });
      if (result.code === 0) {
        wx.showToast({ title: '发布成功', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 800);
      } else {
        wx.showToast({ title: result.msg || '发布失败', icon: 'none' });
      }
    } catch (err) {
      console.error('发布待办失败:', err);
      wx.showToast({ title: '网络错误', icon: 'none' });
    }
  }
});
