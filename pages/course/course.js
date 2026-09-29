const cloudService = require('../../utils/cloudService');
const app = getApp();

Page({
  data: {
    currentWeek: 1,
    weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    timeSlots: [
      { label: '1-2节', time: '08:00-09:40' },
      { label: '3-4节', time: '10:00-11:40' },
      { label: '5-6节', time: '14:00-15:40' },
      { label: '7-8节', time: '16:00-17:40' },
      { label: '晚课', time: '19:00-20:40' }
    ],
    courses: {},
    allCourses: [],
    showAdd: false,
    editCourse: { name: '', teacher: '', location: '', weeks: '1-16', color: '#4CAF50' },
    colors: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#795548', '#607D8B']
  },

  onShow() { this.loadCourses(); },

  async loadCourses() {
    try {
      const res = await cloudService.dataAPI.myList('course', 100);
      const list = (res.code === 0 && res.data) ? res.data.list : [];
      this.setData({ allCourses: list });
      this.buildGrid(list);
    } catch (e) {
      console.error('loadCourses error:', e);
    }
  },

  buildGrid(list) {
    list = list || this.data.allCourses;
    const { currentWeek } = this.data;
    const map = {};
    list.forEach(c => {
      const w = c.weeks || '1-16';
      let show = false;
      if (w.includes('-')) {
        const [s, e] = w.split('-').map(Number);
        show = currentWeek >= s && currentWeek <= e;
      } else {
        show = w.split(',').map(Number).includes(currentWeek);
      }
      if (show) map[c.weekDay + '-' + c.timeSlot] = c;
    });
    this.setData({ courses: map });
  },

  prevWeek() {
    if (this.data.currentWeek > 1) {
      this.setData({ currentWeek: this.data.currentWeek - 1 });
      this.buildGrid();
    }
  },
  nextWeek() {
    if (this.data.currentWeek < 20) {
      this.setData({ currentWeek: this.data.currentWeek + 1 });
      this.buildGrid();
    }
  },

  showAdd(e) {
    const { weekday, timeslot } = e.currentTarget.dataset;
    this.setData({
      showAdd: true,
      editCourse: {
        name: '', teacher: '', location: '', weeks: '1-16',
        color: this.data.colors[Math.floor(Math.random() * this.data.colors.length)],
        weekDay: weekday, timeSlot: timeslot, _id: ''
      }
    });
  },

  hideAdd() { this.setData({ showAdd: false }); },
  stop() {},
  onName(e) { this.setData({ 'editCourse.name': e.detail.value }); },
  onTeacher(e) { this.setData({ 'editCourse.teacher': e.detail.value }); },
  onLocation(e) { this.setData({ 'editCourse.location': e.detail.value }); },
  onWeeks(e) { this.setData({ 'editCourse.weeks': e.detail.value }); },
  onColor(e) { this.setData({ 'editCourse.color': e.currentTarget.dataset.color }); },

  async deleteCourse(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除', content: '确定删除吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const r = await cloudService.dataAPI.delete('course', id);
            if (r.code === 0) {
              wx.showToast({ title: '已删除', icon: 'success' });
              this.loadCourses();
            } else {
              wx.showToast({ title: r.msg || '删除失败', icon: 'none' });
            }
          } catch (err) {
            wx.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      }
    });
  },

  async saveCourse() {
    if (!this.data.editCourse.name.trim()) {
      wx.showToast({ title: '请输入课程名', icon: 'none' });
      return;
    }
    const { editCourse } = this.data;
    const payload = {
      name: editCourse.name.trim(),
      teacher: editCourse.teacher.trim(),
      location: editCourse.location.trim(),
      weeks: editCourse.weeks.trim(),
      color: editCourse.color,
      weekDay: editCourse.weekDay,
      timeSlot: editCourse.timeSlot
    };

    wx.showLoading({ title: '保存中...' });
    try {
      let r;
      if (editCourse._id) {
        r = await cloudService.dataAPI.update('course', editCourse._id, payload);
      } else {
        r = await cloudService.dataAPI.create('course', payload);
      }
      wx.hideLoading();
      if (r.code === 0) {
        this.setData({ showAdd: false });
        this.loadCourses();
        wx.showToast({ title: '添加成功', icon: 'success' });
      } else {
        wx.showToast({ title: r.msg || '保存失败', icon: 'none' });
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  onPullDownRefresh() {
    this.loadCourses().then(() => wx.stopPullDownRefresh());
  }
});
