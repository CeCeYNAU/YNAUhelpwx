const app = getApp();

Page({
  data: {
    coreServices: [
      { id: 1, name: '我的待办', emoji: '📋', desc: '管理与学习任务', gradient: 'linear-gradient(135deg, #4CAF50, #8BC34A)', url: '/pages/todo/todo' },
      { id: 2, name: '失物招领', emoji: '🔍', desc: '寻找或发布失物', gradient: 'linear-gradient(135deg, #2196F3, #64B5F6)', url: '/pages/lostfound/lostfound' },
      { id: 3, name: '我的课表', emoji: '📅', desc: '查看课程安排', gradient: 'linear-gradient(135deg, #1565C0, #42A5F5)', url: '/pages/course/course' },
      { id: 4, name: '校园资讯', emoji: '📰', desc: '新闻与公告', gradient: 'linear-gradient(135deg, #D4A017, #FFD54F)', url: '/pages/newsCategory/newsCategory' },
    ],
    moreServices: [
      { id: 5, name: '校园地图', emoji: '🗺️', desc: '校园导航与热点', gradient: 'linear-gradient(135deg, #E64A19, #FF8A65)', url: '/pages/campusMap/campusMap' },
      { id: 6, name: '校园一角', emoji: '📸', desc: '发现校园美景', gradient: 'linear-gradient(135deg, #00796B, #4DB6AC)', url: '/pages/scenery/scenery' },
      { id: 7, name: '时空留言', emoji: '🎙️', desc: '地点语音留言', gradient: 'linear-gradient(135deg, #7B1FA2, #BA68C8)', url: '/pages/voiceMap/voiceMap' },
      { id: 8, name: '校园论坛', emoji: '💬', desc: '交流校园话题', gradient: 'linear-gradient(135deg, #E91E63, #F48FB1)', url: '/pages/forum/forum' },
      { id: 9, name: '学业共享', emoji: '📚', desc: '分享学习资料', gradient: 'linear-gradient(135deg, #3F51B5, #7986CB)', url: '/pages/study/study' },
      { id: 10, name: '活动通知', emoji: '🔔', desc: '查看活动信息', gradient: 'linear-gradient(135deg, #F44336, #EF5350)', url: '/pages/activities/activities' },
    ]
  },

  goPage(e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.vibrateShort({ type: 'light' });
      wx.navigateTo({ url });
    } else {
      wx.showToast({ title: '功能开发中', icon: 'none' });
    }
  }
});
