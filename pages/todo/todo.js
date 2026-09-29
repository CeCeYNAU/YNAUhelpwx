const app = getApp();
const cloudService = require('../../utils/cloudService');

Page({
  data: {
    todos: [],
    showList: [],
    filter: 'all',
    activeCount: 0
  },

  onShow() { this.loadTodos(); },

  async loadTodos() {
    try {
      const result = await cloudService.dataAPI.myList('todo', 100, 1);
      if (result.code === 0) {
        const todos = result.data.list;
        const activeCount = todos.filter(t => !t.completed).length;
        this.setData({ todos, activeCount });
        this.applyFilter();
      }
    } catch (err) {
      console.error('加载待办失败:', err);
    }
  },

  applyFilter() {
    let list = [...this.data.todos];
    if (this.data.filter === 'active') list = list.filter(t => !t.completed);
    if (this.data.filter === 'done') list = list.filter(t => t.completed);
    this.setData({ showList: list });
  },

  setFilter(e) { this.setData({ filter: e.currentTarget.dataset.f }); this.applyFilter(); },

  async toggleTodo(e) {
    const id = e.currentTarget.dataset.id;
    const todo = this.data.todos.find(t => t._id === id);
    if (!todo) return;
    try {
      const result = await cloudService.dataAPI.update('todo', id, { completed: !todo.completed });
      if (result.code === 0) this.loadTodos();
    } catch (err) {
      console.error('更新待办失败:', err);
    }
  },

  deleteTodo(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除', content: '确定删除吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await cloudService.dataAPI.delete('todo', id);
            if (result.code === 0) this.loadTodos();
          } catch (err) {
            console.error('删除待办失败:', err);
          }
        }
      }
    });
  },

  goAdd() {
    wx.vibrateShort({ type: 'light' });
    wx.navigateTo({ url: '/pages/todoPublish/todoPublish' });
  },

  onPullDownRefresh() {
    this.loadTodos().then(() => wx.stopPullDownRefresh());
  }
});
