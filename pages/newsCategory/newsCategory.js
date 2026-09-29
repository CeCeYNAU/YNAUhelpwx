const defaultNews = require('../../constants/defaultNews');
const cloudService = require('../../utils/cloudService');
const app = getApp();

Page({
  data: {
    categories: ['全部', '通知', '公告', '活动', '学术', '生活'],
    activeCat: 0,
    searchKey: '',
    allNews: [],
    showList: []
  },

  onShow() { this.loadData(); },

  async loadData() {
    const builtin = defaultNews.map(item => ({
      id: item.id,
      tag: item.tag,
      title: item.title,
      content: item.content.substring(0, 50) + '...',
      time: item.time,
      _isBuiltin: true
    }));

    let posts = [];
    try {
      const res = await cloudService.dataAPI.list('news', null, 50);
      if (res.code === 0 && res.data && res.data.list) {
        posts = res.data.list.map(p => ({
          id: p._id,
          _id: p._id,
          tag: p.type || '通知',
          title: p.title,
          content: (p.content || '').substring(0, 50) + '...',
          time: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '',
          _isBuiltin: false
        }));
      }
    } catch (e) {
      console.error('loadData news error:', e);
    }

    const all = [...builtin, ...posts];
    this.setData({ allNews: all });
    this.filterList();
  },

  onCat(e) { this.setData({ activeCat: e.currentTarget.dataset.index }); this.filterList(); },

  onSearch(e) { this.setData({ searchKey: e.detail.value }); this.filterList(); },

  filterList() {
    let list = [...this.data.allNews];
    if (this.data.activeCat > 0) {
      const cat = this.data.categories[this.data.activeCat];
      list = list.filter(i => i.tag === cat);
    }
    if (this.data.searchKey.trim()) {
      const kw = this.data.searchKey.trim().toLowerCase();
      list = list.filter(i => (i.title && i.title.toLowerCase().includes(kw)) || (i.content && i.content.toLowerCase().includes(kw)));
    }
    this.setData({ showList: list });
  },

  goDetail(e) {
    wx.vibrateShort({ type: 'light' });
    const id = e.currentTarget.dataset.id;
    const item = this.data.showList.find(i => i.id === id);
    if (item) {
      if (item._isBuiltin) {
        wx.navigateTo({ url: `/pages/newsDetail/newsDetail?id=${id}` });
      } else {
        wx.navigateTo({ url: `/pages/newsDetail/newsDetail?id=${id}&type=cloud` });
      }
    }
  },

  onPullDownRefresh() {
    this.loadData().then(() => wx.stopPullDownRefresh());
  }
});
