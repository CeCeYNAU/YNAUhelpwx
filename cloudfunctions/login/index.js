// 云函数：login - 用户登录注册
const cloud = require('wx-server-sdk');
const crypto = require('crypto');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

function hashPassword(password, salt) {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const { action, studentId, password, nickName, avatarUrl, college } = event;

  const usersCollection = db.collection('users');

  if (action === 'register') {
    if (!studentId || !/^20\d{8}$/.test(studentId)) {
      return { code: -1, msg: '学号格式错误' };
    }
    if (!password || password.length < 6) {
      return { code: -1, msg: '密码至少6位' };
    }

    const existing = await usersCollection.where({ studentId }).get();
    if (existing.data.length > 0) {
      return { code: -1, msg: '该学号已注册' };
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);

    const now = Date.now();
    const result = await usersCollection.add({
      data: {
        openid: OPENID,
        studentId,
        salt,
        passwordHash,
        nickName: nickName || '同学',
        avatarUrl: avatarUrl || '',
        college: college || '',
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now
      }
    });

    return {
      code: 0,
      msg: '注册成功',
      data: {
        _id: result._id,
        studentId,
        nickName: nickName || '同学',
        avatarUrl: avatarUrl || '',
        college: college || ''
      }
    };
  }

  if (action === 'login') {
    if (!studentId || !password) {
      return { code: -1, msg: '请输入学号和密码' };
    }

    const userResult = await usersCollection.where({ studentId }).get();
    if (userResult.data.length === 0) {
      return { code: -1, msg: '学号未注册' };
    }

    const user = userResult.data[0];
    const inputHash = hashPassword(password, user.salt);

    if (inputHash !== user.passwordHash) {
      return { code: -1, msg: '密码错误' };
    }

    await usersCollection.doc(user._id).update({
      data: {
        lastLoginAt: Date.now(),
        nickName: nickName || user.nickName,
        avatarUrl: avatarUrl || user.avatarUrl
      }
    });

    return {
      code: 0,
      msg: '登录成功',
      data: {
        _id: user._id,
        studentId: user.studentId,
        nickName: nickName || user.nickName,
        avatarUrl: avatarUrl || user.avatarUrl,
        college: user.college || ''
      }
    };
  }

  if (action === 'updateProfile') {
    const updateData = {};
    if (nickName !== undefined) updateData.nickName = nickName;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (college !== undefined) updateData.college = college;
    updateData.updatedAt = Date.now();

    await usersCollection.where({ openid: OPENID }).update({
      data: updateData
    });

    return { code: 0, msg: '更新成功' };
  }

  if (action === 'getUserByOpenid') {
    const userResult = await usersCollection.where({ openid: OPENID }).get();
    if (userResult.data.length === 0) {
      return { code: -1, msg: '用户不存在' };
    }
    const user = userResult.data[0];
    return {
      code: 0,
      data: {
        _id: user._id,
        studentId: user.studentId,
        nickName: user.nickName,
        avatarUrl: user.avatarUrl,
        college: user.college || ''
      }
    };
  }

  return { code: -1, msg: '未知操作' };
};
