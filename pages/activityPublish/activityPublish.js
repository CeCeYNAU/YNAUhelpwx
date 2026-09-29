const app = getApp();
const cloudService = require('../../utils/cloudService');

const TYPES = ['讲座', '社团', '比赛', '志愿', '其他'];

Page({
  data: {
    title: '',
    content: '',
    type: '讲座',
    types: TYPES,
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    organizer: '',
    maxPeople: 0,
    maxPeopleStr: '',
    canSubmit: false,
    loading: false
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
    this.checkSubmit();
  },

  onTypeChange(e) {
    const idx = parseInt(e.detail.value);
    this.setData({ type: TYPES[idx] });
  },

  onDateChange(e) {
    this.setData({ date: e.detail.value });
  },

  onStartTimeChange(e) {
    this.setData({ startTime: e.detail.value });
  },

  onEndTimeChange(e) {
    this.setData({ endTime: e.detail.value });
  },

  onLocationInput(e) {
    this.setData({ location: e.detail.value });
  },

  onOrganizerInput(e) {
    this.setData({ organizer: e.detail.value });
  },

  onMaxPeopleInput(e) {
    const val = parseInt(e.detail.value) || 0;
    this.setData({ maxPeople: val, maxPeopleStr: e.detail.value });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
    this.checkSubmit();
  },

  checkSubmit() {
    const { title, content, date } = this.data;
    this.setData({ canSubmit: title.trim().length > 0 && content.trim().length >= 10 && date.length > 0 });
  },

  async doSubmit() {
    if (!this.data.canSubmit) return;
    this.setData({ loading: true });

    try {
      const userInfo = wx.getStorageSync('userInfo');
      const title = this.data.title.trim();
      const content = this.data.content.trim();

      const moderateResult = await cloudService.moderateAPI.check(title, content, 'activity');
      if (!moderateResult.pass) {
        this.setData({ loading: false });
        wx.showToast({ title: moderateResult.msg, icon: 'none', duration: 2500 });
        return;
      }

      const result = await cloudService.dataAPI.create('activity', {
        title,
        content,
        type: this.data.type,
        date: this.data.date,
        startTime: this.data.startTime,
        endTime: this.data.endTime,
        location: this.data.location,
        organizer: this.data.organizer,
        maxPeople: this.data.maxPeople,
        participants: [],
        status: 'open',
        author: userInfo ? userInfo.studentId : '匿名',
        authorNickName: userInfo ? userInfo.nickName : '匿名',
        authorId: userInfo ? userInfo.studentId : ''
      });

      if (result.code === 0) {
        this.setData({ loading: false });
        wx.showToast({ title: '发布成功', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 1000);
      } else {
        this.setData({ loading: false });
        wx.showToast({ title: result.msg || '发布失败', icon: 'none' });
      }
    } catch (err) {
      console.error('发布失败:', err);
      this.setData({ loading: false });
      wx.showToast({ title: '网络错误', icon: 'none' });
    }
  }
});
