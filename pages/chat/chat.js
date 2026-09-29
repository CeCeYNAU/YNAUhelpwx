const chatBehavior = require('../../utils/chatBehavior');

Page({
  behaviors: [chatBehavior],

  data: {
    quickQuestions: ['今天天气怎么样', '图书馆开放时间', '食堂推荐', '校园快递在哪里', '期末考试时间', '校园网怎么用']
  },

  onLoad() {
    this.addMessage('assistant', '你好！我是云小农\n云南农业大学校园生活助手\n\n你可以问我关于校园生活的问题，比如天气、食堂、图书馆、快递等。');
    this.initChatHistory();
  },

  onPullDownRefresh() {
    this.clearChat();
    wx.stopPullDownRefresh();
  },

  clearChat() {
    wx.showModal({
      title: '清空聊天',
      content: '确定要清空聊天记录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('chatHistory');
          this.setData({ messages: [] });
          this.addMessage('assistant', '聊天记录已清空\n有什么校园生活问题都可以问我~');
        }
      }
    });
  }
});
