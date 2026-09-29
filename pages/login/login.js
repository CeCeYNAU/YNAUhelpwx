const app = getApp();

Page({
  data: {
    step: 1,
    avatarUrl: '',
    nickName: '',
    studentId: '',
    password: '',
    canSubmit: false,
    agreed: false,
    loading: false,
    hasAvatar: false,
    _focusId: false,
    _focusPwd: false,
    _showPwd: false,
    validateId: false
  },

  // 微信头像授权回调（真机）
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    if (!avatarUrl || avatarUrl === '') {
      wx.showToast({ title: '未获取到头像', icon: 'none' });
      return;
    }

    this.setData({
      avatarUrl,
      hasAvatar: true,
      nickName: '同学',
      _canNext: this.data.agreed
    });

    wx.vibrateShort({ type: 'light' });
  },

  // 按钮点击事件（模拟器降级方案）
  onAuthBtnTap() {
    // 如果已经有头像，说明 chooseAvatar 生效了，不需要降级
    if (this.data.hasAvatar) {
      return;
    }

    // 在模拟器中 chooseAvatar 不会触发，使用 chooseImage 作为备选
    console.log('使用降级方案：wx.chooseImage');
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        if (res.tempFilePaths && res.tempFilePaths.length > 0) {
          this.setData({
            avatarUrl: res.tempFilePaths[0],
            hasAvatar: true,
            nickName: '同学',
            _canNext: this.data.agreed
          });
          wx.vibrateShort({ type: 'light' });
        }
      },
      fail: (err) => {
        console.error('选择头像失败:', err);
        wx.showToast({ title: '选择头像失败', icon: 'none' });
      }
    });
  },

  toggleAgree() {
    const agreed = !this.data.agreed;
    this.setData({ agreed, _canNext: agreed && !!this.data.avatarUrl });
    if (agreed) {
      wx.vibrateShort({ type: 'light' });
    }
  },

  onChooseAvatarComplete() {
    if (!this.data.avatarUrl) {
      wx.showToast({ title: '请先授权微信头像', icon: 'none' });
      return;
    }
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }

    wx.vibrateShort({ type: 'medium' });
    this.setData({ step: 2 });
  },

  goBack() {
    wx.vibrateShort({ type: 'light' });
    this.setData({ step: 1 });
  },

  goPrivacy() {
    wx.navigateTo({ url: '/pages/privacy/privacy' });
  },

  onStudentIdInput(e) {
    const studentId = e.detail.value.replace(/\D/g, '');
    const validateId = app.validateStudentId(studentId);
    this.setData({ studentId, validateId });
    this.checkSubmit();
  },

  onPasswordInput(e) {
    const password = e.detail.value;
    this.setData({ password });
    this.checkSubmit();
  },

  onIdFocus() {
    this.setData({ _focusId: true });
  },

  onIdBlur() {
    this.setData({ _focusId: false });
  },

  onPwdFocus() {
    this.setData({ _focusPwd: true });
  },

  onPwdBlur() {
    this.setData({ _focusPwd: false });
  },

  togglePwd() {
    this.setData({ _showPwd: !this.data._showPwd });
    wx.vibrateShort({ type: 'light' });
  },

  checkSubmit() {
    const { studentId, password, avatarUrl, agreed } = this.data;
    const validId = app.validateStudentId(studentId);
    const validPwd = password.length >= 6;
    this.setData({
      canSubmit: validId && validPwd,
      _canNext: !!avatarUrl && !!agreed
    });
  },

  async doBind() {
    const { avatarUrl, nickName, studentId, password, agreed } = this.data;

    if (!avatarUrl) {
      wx.showToast({ title: '请先授权微信头像', icon: 'none' });
      this.setData({ step: 1 });
      return;
    }

    if (!agreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' });
      this.setData({ step: 1 });
      return;
    }

    if (!app.validateStudentId(studentId)) {
      wx.showToast({ title: '学号格式不正确\n请输入10位数字（如2026313573）', icon: 'none', duration: 2500 });
      return;
    }

    if (password.length < 6) {
      wx.showToast({ title: '密码至少6位', icon: 'none' });
      return;
    }

    this.setData({ loading: true });

    if (!app.globalData.cloudAvailable) {
      const userInfo = {
        studentId,
        nickName: nickName || '同学',
        avatarUrl,
        college: '',
        loginTime: Date.now()
      };
      this.loginSuccess(userInfo);
      return;
    }

    try {
      const cloudService = require('../../utils/cloudService');

      let result = await cloudService.userAPI.login(studentId, password, nickName, avatarUrl);

      if (result.code === -1 && result.msg === '学号未注册') {
        result = await cloudService.userAPI.register(studentId, password, nickName, avatarUrl, '');
      }

      if (result.code === 0) {
        const userInfo = {
          studentId: result.data.studentId,
          nickName: result.data.nickName,
          avatarUrl: result.data.avatarUrl,
          college: result.data.college || '',
          loginTime: Date.now()
        };
        this.loginSuccess(userInfo);
      } else {
        this.setData({ loading: false });
        wx.showToast({ title: result.msg || '登录失败', icon: 'none' });
      }
    } catch (err) {
      if (err.silent) return;
      console.error('登录失败:', err);
      this.setData({ loading: false });
      wx.showToast({ title: '网络错误，请重试', icon: 'none' });
    }
  },

  loginSuccess(userInfo) {
    wx.setStorageSync('userInfo', userInfo);
    app.globalData.userInfo = userInfo;
    app.globalData.isLoggedIn = true;

    this.setData({ loading: false });
    wx.showToast({ title: '登录成功', icon: 'success' });
    this._loginTimer = setTimeout(() => {
      wx.reLaunch({ url: '/pages/index/index' });
    }, 800);
  },

  onUnload() {
    if (this._loginTimer) {
      clearTimeout(this._loginTimer);
    }
  }
});
