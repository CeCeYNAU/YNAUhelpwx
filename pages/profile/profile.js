const app = getApp();
const cloudService = require('../../utils/cloudService');

Page({
  data: {
    userInfo: null,
    isLoggedIn: false,
    todoCount: 0,
    lfCount: 0,
    sceneryCount: 0,
    showEdit: false,
    editName: '',
    editCollege: ''
  },

  onShow() {
    this.loadData();
  },

  async loadData() {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo,
      isLoggedIn: !!userInfo,
      _avatarUrl: userInfo && userInfo.avatarUrl ? userInfo.avatarUrl : '/images/default-avatar.png'
    });

    if (!userInfo) return;

    try {
      const [todoResult, lostResult, foundResult, sceneryResult] = await Promise.all([
        cloudService.dataAPI.myList('todo', 1, 1),
        cloudService.dataAPI.myList('lost', 1, 1),
        cloudService.dataAPI.myList('found', 1, 1),
        cloudService.dataAPI.myList('scenery', 1, 1)
      ]);

      this.setData({
        todoCount: todoResult.code === 0 ? todoResult.data.total : 0,
        lfCount: (lostResult.code === 0 ? lostResult.data.total : 0) + (foundResult.code === 0 ? foundResult.data.total : 0),
        sceneryCount: sceneryResult.code === 0 ? sceneryResult.data.total : 0
      });
    } catch (err) {
      console.error('加载统计数据失败:', err);
    }
  },

  goLogin() { wx.reLaunch({ url: '/pages/login/login' }); },
  goTodo() { wx.navigateTo({ url: '/pages/todo/todo' }); },
  goLostFound() { wx.navigateTo({ url: '/pages/lostfound/lostfound' }); },
  goCourse() { wx.navigateTo({ url: '/pages/course/course' }); },
  goNews() { wx.navigateTo({ url: '/pages/newsCategory/newsCategory' }); },
  goPrivacy() { wx.navigateTo({ url: '/pages/privacy/privacy' }); },

  showEditModal() {
    this.setData({
      showEdit: true,
      editName: this.data.userInfo ? this.data.userInfo.nickName || '' : '',
      editCollege: this.data.userInfo ? this.data.userInfo.college || '' : ''
    });
  },

  hideEditModal() { this.setData({ showEdit: false }); },
  stop() {},
  onNameInput(e) { this.setData({ editName: e.detail.value }); },
  onCollegeInput(e) { this.setData({ editCollege: e.detail.value }); },

  async saveProfile() {
    if (!this.data.editName.trim()) {
      wx.showToast({ title: '昵称不能为空', icon: 'none' });
      return;
    }

    const nickName = this.data.editName.trim();
    const college = this.data.editCollege.trim();

    try {
      await cloudService.userAPI.updateProfile({ nickName, college });

      const info = {
        ...this.data.userInfo,
        nickName,
        college
      };
      wx.setStorageSync('userInfo', info);
      app.globalData.userInfo = info;
      this.setData({ userInfo: info, showEdit: false });
      wx.showToast({ title: '保存成功', icon: 'success' });
    } catch (err) {
      console.error('保存资料失败:', err);
      wx.showToast({ title: '网络错误', icon: 'none' });
    }
  },

  logout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          app.globalData.userInfo = null;
          app.globalData.isLoggedIn = false;
          wx.reLaunch({ url: '/pages/login/login' });
        }
      }
    });
  }
});
