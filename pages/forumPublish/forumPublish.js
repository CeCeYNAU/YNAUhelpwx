const app = getApp();
const cloudService = require('../../utils/cloudService');

const CATEGORIES = ['综合', '求助', '吐槽', '分享', '提问', '讨论'];

Page({
  data: {
    title: '',
    content: '',
    category: '综合',
    categories: CATEGORIES,
    canSubmit: false,
    loading: false
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
    this.checkSubmit();
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
    this.checkSubmit();
  },

  onCategoryChange(e) {
    const idx = parseInt(e.detail.value);
    this.setData({ category: CATEGORIES[idx] });
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

      const moderateResult = await cloudService.moderateAPI.check(title, content, 'forum');
      if (!moderateResult.pass) {
        this.setData({ loading: false });
        wx.showToast({ title: moderateResult.msg, icon: 'none', duration: 2500 });
        return;
      }

      const result = await cloudService.dataAPI.create('forum', {
        title,
        content,
        category: this.data.category,
        author: userInfo ? userInfo.studentId : '匿名',
        authorNickName: userInfo ? userInfo.nickName : '匿名',
        authorId: userInfo ? userInfo.studentId : '',
        likes: 0,
        comments: []
      });

      if (result.code === 0) {
        this.setData({ loading: false });
        wx.showToast({ title: '发帖成功', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 1000);
      } else {
        this.setData({ loading: false });
        wx.showToast({ title: result.msg || '发帖失败', icon: 'none' });
      }
    } catch (err) {
      console.error('发帖失败:', err);
      this.setData({ loading: false });
      wx.showToast({ title: '网络错误', icon: 'none' });
    }
  }
});
