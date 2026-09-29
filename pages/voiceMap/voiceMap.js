const app = getApp();
const cloudService = require('../../utils/cloudService');

Page({
  data: {
    latitude: 25.1415,
    longitude: 102.7379,
    scale: 15,
    markers: [],
    voiceList: [],
    showRecordPanel: false,
    isRecording: false,
    recordTime: 0,
    hasLocation: false,
    locationName: '',
    recordLatitude: 0,
    recordLongitude: 0,
    showEdit: false,
    editTitle: '',
    tempVoicePath: '',
    playingId: null
  },

  onLoad() {
    this.initRecorder();
  },

  onShow() {
    this.loadVoiceList();
  },

  onUnload() {
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy();
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
  },

  initRecorder() {
    this.recorderManager = wx.getRecorderManager();
    this.recorderManager.onStart(() => {
      this.setData({ isRecording: true, recordTime: 0 });
      this.timer = setInterval(() => {
        this.setData({ recordTime: this.data.recordTime + 1 });
      }, 1000);
    });

    this.recorderManager.onStop((res) => {
      clearInterval(this.timer);
      this.setData({ isRecording: false, tempVoicePath: res.tempFilePath });
      if (res.duration < 1000) {
        wx.showToast({ title: '录音时间太短', icon: 'none' });
        this.setData({ tempVoicePath: '', showRecordPanel: false });
        return;
      }
      this.setData({ showEdit: true, editTitle: '' });
    });

    this.recorderManager.onError(() => {
      clearInterval(this.timer);
      this.setData({ isRecording: false });
      wx.showToast({ title: '录音失败', icon: 'none' });
    });

    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError(() => {
      wx.showToast({ title: '音频文件可能已过期', icon: 'none', duration: 2000 });
      this.setData({ playingId: null });
    });
    this.innerAudioContext.onEnded(() => {
      this.setData({ playingId: null });
    });
  },

  async loadVoiceList() {
    try {
      const result = await cloudService.dataAPI.list('voice', null, 100, 1);
      if (result.code === 0) {
        const voiceList = result.data.list;
        const markers = voiceList.map(item => ({
          id: item._id,
          latitude: item.latitude,
          longitude: item.longitude,
          title: item.title,
          iconPath: '/images/star_icon.png',
          width: 30,
          height: 30,
          callout: { content: item.title || '留言', display: 'BYCLICK', borderRadius: 8, bgColor: '#7B1FA2', color: '#fff', padding: 6 }
        }));
        this.setData({ voiceList, markers });
      }
    } catch (err) {
      console.error('加载语音列表失败:', err);
    }
  },

  showRecord() {
    this.setData({ showRecordPanel: true, hasLocation: false, locationName: '', tempVoicePath: '' });
  },

  hideRecord() {
    if (this.data.isRecording) {
      this.recorderManager.stop();
    }
    this.setData({ showRecordPanel: false, isRecording: false, showEdit: false, tempVoicePath: '' });
    if (this.timer) clearInterval(this.timer);
  },

  getLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          hasLocation: true,
          locationName: res.name,
          recordLatitude: res.latitude,
          recordLongitude: res.longitude
        });
      },
      fail: () => {
        wx.showToast({ title: '请选择位置', icon: 'none' });
      }
    });
  },

  toggleRecord() {
    if (this.data.isRecording) {
      this.recorderManager.stop();
    } else {
      if (!this.data.hasLocation) {
        wx.showToast({ title: '请先选择位置', icon: 'none' });
        return;
      }
      this.recorderManager.start({
        duration: 60000,
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 48000,
        format: 'mp3'
      });
    }
  },

  onTitle(e) { this.setData({ editTitle: e.detail.value }); },

  async uploadVoice(filePath) {
    const ext = filePath.split('.').pop();
    const cloudPath = `voice/${Date.now()}_${Math.random().toString(36).substr(2, 8)}.${ext}`;
    const result = await wx.cloud.uploadFile({ cloudPath, filePath });
    return result.fileID;
  },

  async saveVoice() {
    if (!this.data.editTitle.trim()) {
      wx.showToast({ title: '请输入标题', icon: 'none' });
      return;
    }
    if (!this.data.tempVoicePath) {
      wx.showToast({ title: '请先录音', icon: 'none' });
      return;
    }
    if (!this.data.recordLatitude || !this.data.recordLongitude) {
      wx.showToast({ title: '位置信息缺失，请重新选择位置', icon: 'none' });
      return;
    }

    try {
      const voiceFileID = await this.uploadVoice(this.data.tempVoicePath);
      const info = wx.getStorageSync('userInfo');

      const result = await cloudService.dataAPI.create('voice', {
        title: this.data.editTitle.trim(),
        voicePath: voiceFileID,
        latitude: this.data.recordLatitude,
        longitude: this.data.recordLongitude,
        locationName: this.data.locationName,
        authorId: info ? info.studentId : '',
        authorName: info ? info.nickName : '匿名',
        duration: this.data.recordTime
      });

      if (result.code === 0) {
        this.setData({ showEdit: false, showRecordPanel: false, tempVoicePath: '' });
        this.loadVoiceList();
        wx.showToast({ title: '发布成功', icon: 'success' });
      }
    } catch (err) {
      console.error('发布语音失败:', err);
      wx.showToast({ title: '网络错误', icon: 'none' });
    }
  },

  playVoice(e) {
    const id = e.currentTarget.dataset.id;
    const voice = this.data.voiceList.find(v => v._id === id);
    if (!voice) return;

    if (this.data.playingId === id) {
      this.innerAudioContext.stop();
      this.setData({ playingId: null });
      return;
    }

    this.setData({ playingId: id });
    this.innerAudioContext.src = voice.voicePath;
    this.innerAudioContext.play();
  },

  onMarkerTap(e) {
    const id = e.markerId;
    this.playVoice({ currentTarget: { dataset: { id } } });
  },

  deleteVoice(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定删除这条留言吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await cloudService.dataAPI.delete('voice', id);
            if (result.code === 0) {
              if (this.data.playingId === id) {
                this.innerAudioContext.stop();
              }
              this.loadVoiceList();
              wx.showToast({ title: '已删除', icon: 'success' });
            }
          } catch (err) {
            console.error('删除失败:', err);
          }
        }
      }
    });
  }
});
