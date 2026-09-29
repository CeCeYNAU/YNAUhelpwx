const app = getApp();
const cloudService = require('../../utils/cloudService');

Page({
  data: {
    activity: null,
    currentStudentId: '',
    isParticipant: false,
    activityId: ''
  },

  onLoad(options) {
    const userInfo = wx.getStorageSync('userInfo');
    const studentId = userInfo ? userInfo.studentId : '';
    this.setData({
      currentStudentId: studentId,
      activityId: options.id
    });
    this.loadActivity(options.id);
  },

  async loadActivity(id) {
    try {
      const result = await cloudService.dataAPI.detail('activity', id);
      if (result.code === 0) {
        const activity = result.data;
        const participants = activity.participants || [];
        const isParticipant = participants.includes(this.data.currentStudentId);
        const count = participants.length;
        const maxPeople = activity.maxPeople || 999;
        const isFull = count >= maxPeople;
        const isEnded = activity.status === 'ended';
        const displayActivity = {
          ...activity,
          _typeText: activity.type || '活动',
          _typeTag: activity.type === '讲座' ? 'blue' : activity.type === '社团' ? 'purple' : activity.type === '比赛' ? 'gold' : 'green',
          _statusText: isEnded ? '已结束' : isFull ? '已满' : '报名中',
          _statusTag: isEnded ? 'ended' : isFull ? 'full' : 'open',
          _count: count,
          _maxPeopleText: activity.maxPeople ? String(activity.maxPeople) : '不限',
          _author: activity.authorNickName || activity.author || '匿名',
          _startTime: activity.startTime || '',
          _endTime: activity.endTime || ''
        };
        this.setData({ activity: displayActivity, isParticipant });
      } else {
        wx.showToast({ title: '活动不存在', icon: 'none' });
        setTimeout(() => wx.navigateBack(), 1000);
      }
    } catch (err) {
      console.error('加载活动失败:', err);
    }
  },

  async toggleSignup() {
    const activity = this.data.activity;
    if (!activity) return;

    if (this.data.isParticipant) {
      try {
        const participants = (activity.participants || []).filter(id => id !== this.data.currentStudentId);
        const result = await cloudService.dataAPI.update('activity', activity._id, { participants });
        if (result.code === 0) {
          this.setData({ isParticipant: false });
          this.loadActivity(this.data.activityId);
          wx.showToast({ title: '已取消报名', icon: 'none' });
        }
      } catch (err) {
        console.error('取消报名失败:', err);
      }
    } else {
      const participants = activity.participants || [];
      if (participants.length >= (activity.maxPeople || 999)) {
        wx.showToast({ title: '活动已满员', icon: 'none' });
        return;
      }
      try {
        participants.push(this.data.currentStudentId);
        const result = await cloudService.dataAPI.update('activity', activity._id, { participants });
        if (result.code === 0) {
          this.setData({ isParticipant: true });
          this.loadActivity(this.data.activityId);
          wx.vibrateShort({ type: 'light' });
          wx.showToast({ title: '报名成功', icon: 'success' });
        }
      } catch (err) {
        console.error('报名失败:', err);
      }
    }
  }
});
