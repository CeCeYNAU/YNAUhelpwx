// utils/cloudService.js - 云数据库服务层

/**
 * 调用云函数
 * @param {string} name - 云函数名称
 * @param {object} data - 参数
 * @returns {Promise<object>}
 */
function isCloudAvailable() {
  try {
    if (!wx.cloud) return false;
    const app = getApp();
    return app && app.globalData && app.globalData.cloudAvailable;
  } catch (e) {
    return false;
  }
}

function callCloud(name, data) {
  if (!isCloudAvailable()) {
    return Promise.reject({ errMsg: 'cloud not available', silent: true });
  }
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,
      data,
      success: (res) => resolve(res.result),
      fail: (err) => {
        console.error(`callCloud ${name} error:`, err);
        reject(err);
      }
    });
  });
}

// ========== 用户相关 ==========

const userAPI = {
  register(studentId, password, nickName, avatarUrl, college) {
    return callCloud('login', {
      action: 'register',
      studentId,
      password,
      nickName,
      avatarUrl,
      college
    });
  },

  login(studentId, password, nickName, avatarUrl) {
    return callCloud('login', {
      action: 'login',
      studentId,
      password,
      nickName,
      avatarUrl
    });
  },

  updateProfile(data) {
    return callCloud('login', {
      action: 'updateProfile',
      ...data
    });
  },

  getUserByOpenid() {
    return callCloud('login', { action: 'getUserByOpenid' });
  }
};

// ========== 通用数据操作 ==========

const dataAPI = {
  create(collection, data) {
    return callCloud('dataCRUD', {
      action: 'create',
      collection,
      data
    });
  },

  list(collection, query, pageSize = 20, pageNum = 1) {
    return callCloud('dataCRUD', {
      action: 'list',
      collection,
      query,
      pageSize,
      pageNum
    });
  },

  detail(collection, id) {
    return callCloud('dataCRUD', {
      action: 'detail',
      collection,
      id
    });
  },

  update(collection, id, data) {
    return callCloud('dataCRUD', {
      action: 'update',
      collection,
      id,
      data
    });
  },

  delete(collection, id) {
    return callCloud('dataCRUD', {
      action: 'delete',
      collection,
      id
    });
  },

  increment(collection, id, data) {
    return callCloud('dataCRUD', {
      action: 'increment',
      collection,
      id,
      data
    });
  },

  myList(collection, pageSize = 20, pageNum = 1) {
    return callCloud('dataCRUD', {
      action: 'myList',
      collection,
      pageSize,
      pageNum
    });
  }
};

// ========== 内容审核 ==========

const moderateAPI = {
  check(title, content, type) {
    return callCloud('moderate', {
      action: 'check',
      title,
      content,
      type
    });
  }
};

module.exports = {
  callCloud,
  userAPI,
  dataAPI,
  moderateAPI
};
