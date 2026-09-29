const app = getApp();
const cloudService = require('../../utils/cloudService');

const TYPES = ['笔记', '资料', '评价', '经验'];

Page({
  data: {
    title: '',
    content: '',
    course: '',
    teacher: '',
    type: '笔记',
    types: TYPES,
    canSubmit: false,
    loading: false
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
    this.checkSubmit();
  },

  onCourseInput(e) {
    this.setData({ course: e.detail.value });
  },

  onTeacherInput(e) {
    this.setData({ teacher: e.detail.value });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
    this.checkSubmit();
  },

  onTypeChange(e) {
    const idx = parseInt(e.detail.value);
    this.setData({ type: TYPES[idx] });
  },

  checkSubmit() {
    const { title, content } = this.data;
    this.setData({ canSubmit: title.trim().length > 0 && content.trim().length >= 10 });
  },

  async doSubmit() {
    if (!this.data.canSubmit) return;
    this.setData({ loading: true });

    try {
      const userInfo = wx.getStorageSync('userInfo');
      const title = this.data.title.trim();
      const content = this.data.content.trim();

      const moderateResult = await cloudService.moderateAPI.check(title, content, 'study');
      if (!moderateResult.pass) {
        this.setData({ loading: false });
        wx.showToast({ title: moderateResult.msg, icon: 'none', duration: 2500 });
        return;
      }

      const result = await cloudService.dataAPI.create('study', {
        title,
        content,
        course: this.data.course.trim(),
        teacher: this.data.teacher.trim(),
        type: this.data.type,
        author: userInfo ? userInfo.studentId : '匿名',
        authorNickName: userInfo ? userInfo.nickName : '匿名',
        authorId: userInfo ? userInfo.studentId : '',
        views: 0
      });

      if (result.code === 0) {
        this.setData({ loading: false });
        wx.showToast({ title: '分享成功', icon: 'success' });
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
