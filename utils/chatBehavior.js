const chatKB = require('../constants/chatKB');
const app = getApp();

module.exports = Behavior({
  data: {
    messages: [],
    inputValue: '',
    hasInput: false,
    scrollToView: ''
  },

  methods: {
    initChatHistory() {
      const history = app.safeGet('chatHistory', []);
      if (history.length > 0) {
        this.setData({ messages: history, scrollToView: `msg-${history[history.length - 1].id}` });
      }
    },

    onInput(e) {
      this.setData({ inputValue: e.detail.value, hasInput: e.detail.value.trim().length > 0 });
    },

    askQuestion(e) {
      this.setData({ inputValue: e.currentTarget.dataset.text, hasInput: true });
      this.sendMessage();
    },

    sendMessage() {
      const text = this.data.inputValue.trim();
      if (!text) return;
      this.addMessage('user', text);
      this.setData({ inputValue: '', hasInput: false });
      setTimeout(() => {
        this.addMessage('assistant', this.getReply(text));
        this.saveChatHistory();
      }, 500 + Math.random() * 500);
    },

    getReply(t) {
      const text = t.toLowerCase();
      for (const [key, val] of Object.entries(chatKB)) {
        if (key === 'default') continue;
        if (text.includes(key)) return val;
      }
      return chatKB['default'];
    },

    addMessage(role, content) {
      const msgs = [...this.data.messages, { id: Date.now(), role, content }];
      this.setData({ messages: msgs }, () => {
        this.setData({ scrollToView: `msg-${msgs[msgs.length - 1].id}` });
      });
    },

    saveChatHistory() {
      const msgs = this.data.messages.slice(-50);
      app.safeSet('chatHistory', msgs);
    },

    onCopyMessage(e) {
      const content = e.currentTarget.dataset.content;
      if (content) {
        wx.setClipboardData({
          data: content,
          success: () => wx.showToast({ title: '已复制', icon: 'success' })
        });
      }
    }
  }
});
