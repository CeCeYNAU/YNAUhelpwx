const app = getApp();
const cloudService = require('../../utils/cloudService');

Page({
  data: {
    item: null
  },

  async onLoad(options) {
    if (!options.id) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1000);
      return;
    }

    try {
      const result = await cloudService.dataAPI.detail('study', options.id);
      if (result.code === 0) {
        const item = result.data;
        this.setData({
          item: {
            ...item,
            _typeTag: item.type === '笔记' ? 'green' : item.type === '资料' ? 'blue' : item.type === '评价' ? 'gold' : 'green',
            _typeText: item.type || '分享',
            _views: item.views || 0,
            _author: item.authorNickName || item.author || '匿名',
            _course: item.course || '',
            _teacher: item.teacher || ''
          }
        });
        cloudService.dataAPI.increment('study', options.id, { views: 1 });
      } else {
        wx.showToast({ title: '内容不存在', icon: 'none' });
        setTimeout(() => wx.navigateBack(), 1000);
      }
    } catch (err) {
      console.error('加载详情失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  }
});
