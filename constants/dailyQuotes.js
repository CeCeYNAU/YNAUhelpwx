// constants/dailyQuotes.js - 每日名言与提示

const quotes = [
  { text: '春种一粒粟，秋收万颗子', author: '李绅《悯农》' },
  { text: '厚德博学，明理尚农', author: '云南农业大学校训' },
  { text: '书山有路勤为径，学海无涯苦作舟', author: '韩愈' },
  { text: '博学之，审问之，慎思之，明辨之，笃行之', author: '《中庸》' },
  { text: '农为邦本，本固邦宁', author: '《尚书》' },
  { text: '纸上得来终觉浅，绝知此事要躬行', author: '陆游' },
];

const tips = [
  '期末将至，图书馆延长至23:00闭馆',
  '近日温差较大，注意添衣保暖',
  '二食堂新窗口开业，欢迎品尝',
  '校园卡余额不足的同学请及时充值',
];

function getDaily() {
  const day = new Date().getDate();
  return {
    quote: quotes[day % quotes.length],
    tip: tips[day % tips.length]
  };
}

module.exports = { quotes, tips, getDaily };
