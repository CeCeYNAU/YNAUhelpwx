const defaultNews = require('../../constants/defaultNews');
const cloudService = require('../../utils/cloudService');

const builtinNews = {};
defaultNews.forEach(item => {
  builtinNews[String(item.id)] = item;
});

Page({
  data: { item: null },

  async onLoad(options) {
    if (!options.id) {
      this.setFallback(options);
      return;
    }

    if (builtinNews[options.id]) {
      this.setData({ item: builtinNews[options.id] });
      return;
    }

    if (options.type === 'cloud') {
      try {
        const res = await cloudService.dataAPI.detail('news', options.id);
        if (res.code === 0 && res.data) {
          const d = res.data;
          this.setData({
            item: {
              id: d._id,
              title: d.title,
              content: d.content,
              time: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '',
              tag: d.type || '通知',
              author: d.authorNickName || d.author || ''
            }
          });
          return;
        }
      } catch (e) {
        console.error('load newsDetail error:', e);
      }
      wx.showToast({ title: '内容不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1000);
      return;
    }

    this.setFallback(options);
  },

  setFallback(options) {
    this.setData({
      item: {
        title: decodeURIComponent(options.title || '详情'),
        content: decodeURIComponent(options.content || '暂无内容'),
        time: options.time || ''
      }
    });
  }
});
