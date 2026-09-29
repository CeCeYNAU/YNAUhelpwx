const chatBehavior = require('../../utils/chatBehavior');
const defaultNews = require('../../constants/defaultNews');
const cloudService = require('../../utils/cloudService');
const app = getApp();

Page({
  behaviors: [chatBehavior],

  data: {
    // 当前屏幕索引
    currentSwiper: 1,
    greeting: '',
    userInfo: null,
    quickQuestions: ['今天天气怎么样', '图书馆开放时间', '食堂推荐', '校园快递在哪里', '期末考试时间', '校园网怎么用'],
    // 多功能区数据（统一网格，10个功能）
    allFuncs: [
      { id: 1, name: '我的待办', emoji: '📋', desc: '记录日常任务', bg: 'linear-gradient(135deg, #4CAF50, #8BC34A)', url: '/pages/todo/todo' },
      { id: 2, name: '失物招领', emoji: '🔍', desc: '寻找遗失物品', bg: 'linear-gradient(135deg, #2196F3, #64B5F6)', url: '/pages/lostfound/lostfound' },
      { id: 3, name: '我的课表', emoji: '📅', desc: '查看课程安排', bg: 'linear-gradient(135deg, #1565C0, #42A5F5)', url: '/pages/course/course' },
      { id: 4, name: '校园资讯', emoji: '📰', desc: '浏览校园新闻', bg: 'linear-gradient(135deg, #D4A017, #FFD54F)', url: '/pages/newsCategory/newsCategory' },
      { id: 5, name: '留声机', emoji: '🎙️', desc: '校园语音地图', bg: 'linear-gradient(135deg, #9C27B0, #CE93D8)', url: '/pages/voiceMap/voiceMap' },
      { id: 6, name: '校园一角', emoji: '📸', desc: '发现校园美景', bg: 'linear-gradient(135deg, #00BCD4, #80DEEA)', url: '/pages/scenery/scenery' },
      { id: 7, name: '时空交集', emoji: '✨', desc: '发现校园偶遇', bg: 'linear-gradient(135deg, #00B4D8, #00FFCC)', url: '/pages/campusMap/campusMap' },
      { id: 8, name: '校园论坛', emoji: '💬', desc: '交流校园话题', bg: 'linear-gradient(135deg, #E91E63, #F48FB1)', url: '/pages/forum/forum' },
      { id: 9, name: '学业共享', emoji: '📚', desc: '分享学习资料', bg: 'linear-gradient(135deg, #3F51B5, #7986CB)', url: '/pages/study/study' },
      { id: 10, name: '活动通知', emoji: '🔔', desc: '查看活动信息', bg: 'linear-gradient(135deg, #F44336, #EF5350)', url: '/pages/activities/activities' },
    ],
    // 校园日报数据
    newsCategories: ['全部', '通知', '公告', '活动', '学术', '生活'],
    activeCat: 0,
    allNews: [],
    showNewsList: []
  },

  onLoad() {
    this.setGreeting();
    this.loadUserInfo();
    this.addMessage('assistant', '你好！我是云小农\n云南农业大学校园生活助手\n\n你可以问我关于校园生活的问题，比如天气、食堂、图书馆、快递等。');
    this.initChatHistory();
    this.loadNews();
  },

  onShow() {
    if (!app.globalData.isLoggedIn) {
      wx.reLaunch({ url: '/pages/login/login' });
    }
  },

  // Swiper切换
  onSwiperChange(e) {
    this.setData({ currentSwiper: e.detail.current });
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo });
    }
  },

  // 设置问候语
  setGreeting() {
    const h = new Date().getHours();
    let g = '你好';
    if (h < 6) g = '夜深了';
    else if (h < 9) g = '早上好';
    else if (h < 12) g = '上午好';
    else if (h < 14) g = '中午好';
    else if (h < 18) g = '下午好';
    else g = '晚上好';
    this.setData({ greeting: g });
  },

  // ========== 快捷功能跳转 ==========

  goPage(e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.vibrateShort({ type: 'light' });
      wx.navigateTo({ url });
    }
  },

  goFunc(e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.vibrateShort({ type: 'light' });
      wx.navigateTo({ url });
    }
  },

  // 进入个人主页
  goProfile() {
    wx.navigateTo({ url: '/pages/profile/profile' });
  },

  // ========== 校园日报逻辑 ==========

  async loadNews() {
    const builtin = defaultNews.map(item => ({
      id: item.id,
      tag: item.tag,
      title: item.title,
      content: item.content.substring(0, 50) + '...',
      time: item.time
    }));

    let userPostList = [];
    try {
      const result = await cloudService.dataAPI.list('news', null, 50, 1);
      if (result.code === 0) {
        userPostList = result.data.list.map(p => ({ ...p, tag: p.type || '通知' }));
      }
    } catch (err) {
      if (!err.silent) {
        console.error('加载用户资讯失败:', err);
      }
    }

    const all = [...builtin, ...userPostList];
    this.setData({ allNews: all });
    this.filterNews();
  },

  onCat(e) {
    this.setData({ activeCat: e.currentTarget.dataset.index });
    this.filterNews();
  },

  filterNews() {
    let list = [...this.data.allNews];
    if (this.data.activeCat > 0) {
      const cat = this.data.newsCategories[this.data.activeCat];
      list = list.filter(i => i.tag === cat);
    }
    this.setData({ showNewsList: list });
  },

  goNewsDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/newsDetail/newsDetail?id=${id}` });
  },

  async onPullDownRefresh() {
    await this.loadNews();
    wx.stopPullDownRefresh();
  }
});
