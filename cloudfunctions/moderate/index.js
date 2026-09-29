// 云函数：moderate - 内容审核
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 敏感词库（基础版，实际项目应从数据库读取）
const SENSITIVE_WORDS = [
  '代写', '代考', '作弊', '枪手', '答案出售',
  '贷款', '信用卡套现', '刷单', '传销',
  '约炮', '裸聊', '色情', '赌博', '博彩'
];

/**
 * 检测文本是否包含敏感词
 * @param {string} text
 * @returns {{pass: boolean, words: string[]}}
 */
function checkSensitiveWords(text) {
  if (!text) return { pass: true, words: [] };
  const lowerText = text.toLowerCase();
  const found = SENSITIVE_WORDS.filter(word => lowerText.includes(word));
  return { pass: found.length === 0, words: found };
}

/**
 * 基础内容校验
 * @param {object} params
 * @returns {{pass: boolean, msg: string}}
 */
function validateContent(params) {
  const { title, content, type } = params;

  if (title && title.length > 100) {
    return { pass: false, msg: '标题不能超过100字' };
  }

  if (content && content.length > 5000) {
    return { pass: false, msg: '内容不能超过5000字' };
  }

  const fullText = `${title || ''} ${content || ''}`;
  const wordCheck = checkSensitiveWords(fullText);

  if (!wordCheck.pass) {
    return { pass: false, msg: `内容包含违规词汇：${wordCheck.words.join('、')}` };
  }

  return { pass: true, msg: '' };
}

exports.main = async (event, context) => {
  const { action, title, content, type } = event;

  if (action === 'check') {
    const result = validateContent({ title, content, type });
    return result;
  }

  return { pass: false, msg: '未知操作' };
};
