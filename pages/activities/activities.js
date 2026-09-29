const app = getApp();
const cloudService = require('../../utils/cloudService');

Page({
  data: {
    activities: [],
    activeTab: 'upcoming',
    currentStudentId: ''
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({ currentStudentId: userInfo ? userInfo.studentId : '' });
    this.loadActivities();
  },

  async loadActivities() {
    try {
      const result = await cloudService.dataAPI.list('activity', null, 50, 1);
      if (result.code === 0) {
        let list = result.data.list;
        if (this.data.activeTab === 'upcoming') {
          list = list.filter(a => a.status !== 'ended');
        } else if (this.data.activeTab === 'my') {
          list = list.filter(a => (a.participants || []).includes(this.data.currentStudentId));
        }
        const displayList = list.sort((a, b) => b.createdAt - a.createdAt).map(a => {
          const participants = a.participants || [];
          const count = participants.length;
          const maxPeople = a.maxPeople || 999;
          const isFull = count >= maxPeople;
          const isEnded = a.status === 'ended';
          return {
            ...a,
            _typeText: a.type || '活动',
            _typeTag: a.type === '讲座' ? 'blue' : a.type === '社团' ? 'purple' : a.type === '比赛' ? 'gold' : 'green',
            _statusText: isEnded ? '已结束' : isFull ? '已满' : '报名中',
            _statusTag: isEnded ? 'ended' : isFull ? 'full' : 'open',
            _count: count,
            _maxPeople: a.maxPeople || 999,
            _maxPeopleText: a.maxPeople ? String(a.maxPeople) : '不限',
            _author: a.authorNickName || a.author || '匿名',
            _startTime: a.startTime || ''
          };
        });
        this.setData({ activities: displayList });
      }
    } catch (err) {
      console.error('加载活动失败:', err);
    }
  },

  onCat(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
    this.loadActivities();
  },

  goPublish() {
    wx.vibrateShort({ type: 'light' });
    wx.navigateTo({ url: '/pages/activityPublish/activityPublish' });
  },

  goDetail(e) {
    wx.vibrateShort({ type: 'light' });
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/activityDetail/activityDetail?id=${id}` });
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个活动吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await cloudService.dataAPI.delete('activity', id);
            if (result.code === 0) {
              this.loadActivities();
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
    this.loadActivities().then(() => wx.stopPullDownRefresh());
  }
});
