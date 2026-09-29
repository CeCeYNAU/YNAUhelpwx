const app = getApp();
const cloudService = require('../../utils/cloudService');

Page({
  data: {
    title: '',
    description: '',
    imagePath: '',
    fileID: '',
    submitting: false
  },

  onTitle(e) { this.setData({ title: e.detail.value }); },
  onDesc(e) { this.setData({ description: e.detail.value }); },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        if (res.tempFiles && res.tempFiles.length > 0) {
          this.setData({ imagePath: res.tempFiles[0].tempFilePath });
        } else {
          wx.showToast({ title: '选择图片失败', icon: 'none' });
        }
      }
    });
  },

  removeImage() {
    this.setData({ imagePath: '', fileID: '' });
  },

  async uploadImage(filePath) {
    const ext = filePath.split('.').pop();
    const cloudPath = `scenery/${Date.now()}_${Math.random().toString(36).substr(2, 8)}.${ext}`;
    const result = await wx.cloud.uploadFile({ cloudPath, filePath });
    return result.fileID;
  },

  async submit() {
    if (!this.data.title.trim()) {
      wx.showToast({ title: '请输入标题', icon: 'none' });
      return;
    }
    if (!this.data.imagePath) {
      wx.showToast({ title: '请上传照片', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    try {
      let fileID = this.data.fileID;
      if (!fileID) {
        fileID = await this.uploadImage(this.data.imagePath);
        this.setData({ fileID });
      }

      const info = wx.getStorageSync('userInfo');
      const result = await cloudService.dataAPI.create('scenery', {
        title: this.data.title.trim(),
        description: this.data.description.trim(),
        imagePath: fileID,
        authorId: info ? info.studentId : '',
        authorName: info ? info.nickName : '匿名',
        views: 0
      });

      if (result.code === 0) {
        this.setData({ submitting: false });
        wx.showToast({ title: '发布成功', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 800);
      } else {
        this.setData({ submitting: false });
        wx.showToast({ title: result.msg || '发布失败', icon: 'none' });
      }
    } catch (err) {
      console.error('发布失败:', err);
      this.setData({ submitting: false });
      wx.showToast({ title: '网络错误', icon: 'none' });
    }
  }
});
