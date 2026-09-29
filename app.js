// app.js
App({
  onLaunch() {
    this.initCloud();
    this.checkLogin();
  },

  initCloud() {
    this.globalData.cloudAvailable = false;
    // 云开发未开通，使用本地存储模式
    // 开通云开发后，取消下方注释即可启用：
    // wx.cloud.init({ env: 'ynau-campus', traceUser: true });
    // this.globalData.cloudAvailable = true;
  },

  globalData: {
    userInfo: null,
    isLoggedIn: false
  },

  checkLogin() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.studentId) {
      this.globalData.userInfo = userInfo;
      this.globalData.isLoggedIn = true;
    } else {
      this.globalData.isLoggedIn = false;
    }
  },

  validateStudentId(id) {
    return /^20\d{8}$/.test(id);
  },

  safeSet(key, data) {
    try {
      wx.setStorageSync(key, data);
      return true;
    } catch (e) {
      console.error('safeSet error:', key, e);
      return false;
    }
  },

  safeGet(key, def = []) {
    try {
      const v = wx.getStorageSync(key);
      return v || def;
    } catch (e) {
      return def;
    }
  }
});
