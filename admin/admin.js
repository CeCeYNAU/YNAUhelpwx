// 云小农后台管理系统 - JavaScript逻辑

// ========== 全局变量 ==========
let currentPage = 'dashboard';
let allData = {
  boundUsers: [],
  userTodos: [],
  lostList: [],
  foundList: [],
  forumPosts: [],
  activityList: [],
  sceneryList: [],
  voiceList: [],
  studyRecords: [],
  courseList: [],
  userPosts: [],
  chatHistory: []
};

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
  console.log('云小农后台管理系统启动');
  initNavigation();
  loadAllData();
  updateDashboard();
});

// ========== 导航切换 ==========
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 移除所有active类
      navItems.forEach(nav => nav.classList.remove('active'));
      
      // 添加active类到当前项
      this.classList.add('active');
      
      // 获取页面名称
      const pageName = this.dataset.page;
      switchPage(pageName);
    });
  });
}

function switchPage(pageName) {
  // 隐藏所有页面
  const pages = document.querySelectorAll('.data-page, .dashboard-page');
  pages.forEach(page => page.classList.remove('active'));
  
  // 显示目标页面
  const targetPage = document.getElementById(pageName + 'Page');
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // 更新页面标题
  const titles = {
    dashboard: '数据概览',
    users: '用户管理',
    todos: '待办事项',
    lostfound: '失物招领',
    forum: '论坛管理',
    activities: '活动管理',
    scenery: '校园风景',
    settings: '系统设置'
  };
  
  document.getElementById('pageTitle').textContent = titles[pageName] || '数据概览';
  
  // 加载对应数据
  currentPage = pageName;
  loadPageData(pageName);
}

// ========== 数据加载 ==========
function loadAllData() {
  try {
    // 从localStorage读取所有数据
    allData.boundUsers = JSON.parse(localStorage.getItem('boundUsers') || '[]');
    allData.userTodos = JSON.parse(localStorage.getItem('userTodos') || '[]');
    allData.lostList = JSON.parse(localStorage.getItem('lostList') || '[]');
    allData.foundList = JSON.parse(localStorage.getItem('foundList') || '[]');
    allData.forumPosts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    allData.activityList = JSON.parse(localStorage.getItem('activityList') || '[]');
    allData.sceneryList = JSON.parse(localStorage.getItem('sceneryList') || '[]');
    allData.voiceList = JSON.parse(localStorage.getItem('voiceList') || '[]');
    allData.studyRecords = JSON.parse(localStorage.getItem('studyRecords') || '[]');
    allData.courseList = JSON.parse(localStorage.getItem('courseList') || '[]');
    allData.userPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
    allData.chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    
    console.log('数据加载成功', allData);
  } catch (e) {
    console.error('数据加载失败:', e);
    showToast('数据加载失败', 'error');
  }
}

function loadPageData(pageName) {
  switch(pageName) {
    case 'dashboard':
      updateDashboard();
      break;
    case 'users':
      renderUsersTable();
      break;
    case 'todos':
      renderTodosTable();
      break;
    case 'lostfound':
      renderLostFoundGrid();
      break;
    case 'forum':
      renderForumTable();
      break;
    case 'activities':
      renderActivitiesGrid();
      break;
    case 'scenery':
      renderSceneryGrid();
      break;
  }
}

// ========== 数据概览 ==========
function updateDashboard() {
  // 更新统计数字
  document.getElementById('totalUsers').textContent = allData.boundUsers.length;
  document.getElementById('totalTodos').textContent = allData.userTodos.length;
  document.getElementById('totalLostFound').textContent = allData.lostList.length + allData.foundList.length;
  document.getElementById('totalPosts').textContent = allData.forumPosts.length;
  document.getElementById('totalActivities').textContent = allData.activityList.length;
  document.getElementById('totalScenery').textContent = allData.sceneryList.length;
  
  // 绘制图表
  drawUserChart();
  drawUsageChart();
  
  // 更新最近动态
  updateActivityList();
}

function drawUserChart() {
  const canvas = document.getElementById('userChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // 清空画布
  ctx.clearRect(0, 0, width, height);
  
  // 简单柱状图示例
  const data = [
    { label: '周一', value: 12 },
    { label: '周二', value: 19 },
    { label: '周三', value: 8 },
    { label: '周四', value: 15 },
    { label: '周五', value: 22 },
    { label: '周六', value: 10 },
    { label: '周日', value: 5 }
  ];
  
  const maxVal = Math.max(...data.map(d => d.value));
  const barWidth = (width - 60) / data.length;
  const chartHeight = height - 40;
  
  // 绘制坐标轴
  ctx.strokeStyle = '#C4C8BD';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 10);
  ctx.lineTo(40, height - 30);
  ctx.lineTo(width - 10, height - 30);
  ctx.stroke();
  
  // 绘制柱状图
  data.forEach((item, index) => {
    const x = 50 + index * barWidth;
    const barH = (item.value / maxVal) * chartHeight;
    const y = height - 30 - barH;
    
    // 柱子
    const gradient = ctx.createLinearGradient(x, y, x, height - 30);
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(1, '#8BC34A');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth - 10, barH);
    
    // 标签
    ctx.fillStyle = '#44483F';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.label, x + (barWidth - 10) / 2, height - 15);
    
    // 数值
    ctx.fillStyle = '#2E7D32';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(item.value, x + (barWidth - 10) / 2, y - 5);
  });
}

function drawUsageChart() {
  const canvas = document.getElementById('usageChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // 清空画布
  ctx.clearRect(0, 0, width, height);
  
  // 饼图数据
  const data = [
    { label: '待办', value: allData.userTodos.length, color: '#4CAF50' },
    { label: '失物', value: allData.lostList.length + allData.foundList.length, color: '#FF9800' },
    { label: '论坛', value: allData.forumPosts.length, color: '#9C27B0' },
    { label: '活动', value: allData.activityList.length, color: '#F44336' },
    { label: '风景', value: allData.sceneryList.length, color: '#00BCD4' }
  ];
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    ctx.fillStyle = '#75796F';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('暂无数据', width / 2, height / 2);
    return;
  }
  
  const centerX = width / 2 - 60;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 40;
  
  let startAngle = 0;
  
  // 绘制饼图
  data.forEach(item => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = item.color;
    ctx.fill();
    
    startAngle += sliceAngle;
  });
  
  // 绘制图例
  let legendY = 30;
  data.forEach(item => {
    const legendX = width - 120;
    
    // 颜色块
    ctx.fillStyle = item.color;
    ctx.fillRect(legendX, legendY, 16, 16);
    
    // 标签
    ctx.fillStyle = '#1A1C19';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${item.label}: ${item.value}`, legendX + 24, legendY + 13);
    
    legendY += 28;
  });
}

function updateActivityList() {
  const activityList = document.getElementById('activityList');
  if (!activityList) return;
  
  // 生成最近动态
  const activities = [];
  
  if (allData.boundUsers.length > 0) {
    const lastUser = allData.boundUsers[allData.boundUsers.length - 1];
    activities.push({
      icon: '👤',
      text: `新用户注册: ${lastUser.nickName || lastUser.studentId}`,
      time: formatTime(lastUser.loginTime || Date.now())
    });
  }
  
  if (allData.userTodos.length > 0) {
    const lastTodo = allData.userTodos[0];
    activities.push({
      icon: '📋',
      text: `新待办: ${lastTodo.title || '未知'}`,
      time: formatTime(lastTodo.id || Date.now())
    });
  }
  
  if (allData.forumPosts.length > 0) {
    const lastPost = allData.forumPosts[0];
    activities.push({
      icon: '💬',
      text: `新帖子: ${lastPost.title || '未知'}`,
      time: formatTime(lastPost.timestamp || Date.now())
    });
  }
  
  if (activities.length === 0) {
    activities.push({
      icon: '✅',
      text: '系统初始化完成',
      time: '刚刚'
    });
  }
  
  // 渲染动态列表
  activityList.innerHTML = activities.map(act => `
    <div class="activity-item">
      <span class="activity-icon">${act.icon}</span>
      <div class="activity-content">
        <p class="activity-text">${act.text}</p>
        <span class="activity-time">${act.time}</span>
      </div>
    </div>
  `).join('');
}

// ========== 用户管理 ==========
function renderUsersTable() {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;
  
  if (allData.boundUsers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state-cell">
          <div class="empty-state">
            <span class="empty-icon">👥</span>
            <p>暂无用户数据</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = allData.boundUsers.map(user => `
    <tr>
      <td>${user.studentId || '-'}</td>
      <td>${user.nickName || '-'}</td>
      <td>${user.college || '-'}</td>
      <td>${formatTime(user.loginTime)}</td>
      <td>${formatTime(user.lastLogin || user.loginTime)}</td>
      <td>
        <button class="btn-secondary" onclick="deleteUser('${user.studentId}')" style="padding: 6px 12px; font-size: 12px;">删除</button>
      </td>
    </tr>
  `).join('');
}

function filterUsers() {
  const searchTerm = document.getElementById('userSearch').value.toLowerCase();
  const rows = document.querySelectorAll('#usersTableBody tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? '' : 'none';
  });
}

function showAddUserDialog() {
  document.getElementById('addUserModal').style.display = 'flex';
}

function closeAddUserDialog() {
  document.getElementById('addUserModal').style.display = 'none';
  // 清空表单
  document.getElementById('newUserStudentId').value = '';
  document.getElementById('newUserPassword').value = '';
  document.getElementById('newUserNickName').value = '';
  document.getElementById('newUserCollege').value = '';
}

function addNewUser() {
  const studentId = document.getElementById('newUserStudentId').value.trim();
  const password = document.getElementById('newUserPassword').value.trim();
  const nickName = document.getElementById('newUserNickName').value.trim();
  const college = document.getElementById('newUserCollege').value.trim();
  
  // 验证
  if (!studentId || !password || !nickName) {
    showToast('请填写必填字段', 'error');
    return;
  }
  
  if (!/^20\d{8}$/.test(studentId)) {
    showToast('学号格式错误（应为20开头10位数字）', 'error');
    return;
  }
  
  // 检查是否已存在
  if (allData.boundUsers.find(u => u.studentId === studentId)) {
    showToast('该学号已存在', 'error');
    return;
  }
  
  // 添加用户
  const newUser = {
    studentId,
    password,
    nickName,
    college,
    loginTime: Date.now(),
    lastLogin: Date.now()
  };
  
  allData.boundUsers.push(newUser);
  saveData('boundUsers', allData.boundUsers);
  
  showToast('用户添加成功', 'success');
  closeAddUserDialog();
  renderUsersTable();
  updateDashboard();
}

function deleteUser(studentId) {
  if (!confirm(`确定要删除用户 ${studentId} 吗？`)) {
    return;
  }
  
  allData.boundUsers = allData.boundUsers.filter(u => u.studentId !== studentId);
  saveData('boundUsers', allData.boundUsers);
  
  showToast('用户已删除', 'success');
  renderUsersTable();
  updateDashboard();
}

// ========== 待办事项管理 ==========
function renderTodosTable() {
  const tbody = document.getElementById('todosTableBody');
  if (!tbody) return;
  
  if (allData.userTodos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state-cell">
          <div class="empty-state">
            <span class="empty-icon">📋</span>
            <p>暂无待办数据</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = allData.userTodos.map(todo => `
    <tr>
      <td>${todo.title || '-'}</td>
      <td><span class="tag tag-green">${todo.category || '其他'}</span></td>
      <td>${todo.deadline || '-'}</td>
      <td><span class="tag ${todo.completed ? 'tag-blue' : 'tag-gold'}">${todo.completed ? '已完成' : '进行中'}</span></td>
      <td>${formatTime(todo.id)}</td>
      <td>
        <button class="btn-secondary" onclick="deleteTodo(${todo.id})" style="padding: 6px 12px; font-size: 12px;">删除</button>
      </td>
    </tr>
  `).join('');
}

function filterTodos() {
  const searchTerm = document.getElementById('todoSearch').value.toLowerCase();
  const filterStatus = document.getElementById('todoFilter').value;
  const rows = document.querySelectorAll('#todosTableBody tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const matchesSearch = text.includes(searchTerm);
    
    let matchesFilter = true;
    if (filterStatus === 'active') {
      matchesFilter = text.includes('进行中');
    } else if (filterStatus === 'completed') {
      matchesFilter = text.includes('已完成');
    }
    
    row.style.display = (matchesSearch && matchesFilter) ? '' : 'none';
  });
}

function deleteTodo(id) {
  if (!confirm('确定要删除这条待办吗？')) return;
  
  allData.userTodos = allData.userTodos.filter(t => t.id !== id);
  saveData('userTodos', allData.userTodos);
  
  showToast('待办已删除', 'success');
  renderTodosTable();
  updateDashboard();
}

// ========== 失物招领管理 ==========
function renderLostFoundGrid() {
  const grid = document.getElementById('lostfoundGrid');
  if (!grid) return;
  
  const allItems = [
    ...allData.lostList.map(item => ({ ...item, type: 'lost' })),
    ...allData.foundList.map(item => ({ ...item, type: 'found' }))
  ];
  
  if (allItems.length === 0) {
    grid.innerHTML = `
      <div class="empty-card elevation-1">
        <span class="empty-icon">🔍</span>
        <p>暂无失物招领数据</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = allItems.map(item => `
    <div class="stat-card elevation-1">
      <div style="flex: 1;">
        <h4 style="margin-bottom: 8px;">${item.title || '无标题'}</h4>
        <p style="font-size: 13px; color: var(--md-on-surface-variant); margin-bottom: 8px;">
          ${item.description || '无描述'}
        </p>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="tag ${item.type === 'lost' ? 'tag-red' : 'tag-green'}">
            ${item.type === 'lost' ? '失物' : '招领'}
          </span>
          <span style="font-size: 12px; color: var(--md-outline);">${formatTime(item.id)}</span>
        </div>
      </div>
      <button class="btn-danger" onclick="deleteLostFound(${item.id}, '${item.type}')" style="padding: 6px 12px; font-size: 12px; margin-top: 12px;">删除</button>
    </div>
  `).join('');
}

function filterLostFound() {
  const searchTerm = document.getElementById('lfSearch').value.toLowerCase();
  const filterType = document.getElementById('lfFilter').value;
  const cards = document.querySelectorAll('#lostfoundGrid .stat-card');
  
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    const matchesSearch = text.includes(searchTerm);
    
    let matchesFilter = true;
    if (filterType === 'lost') {
      matchesFilter = text.includes('失物');
    } else if (filterType === 'found') {
      matchesFilter = text.includes('招领');
    }
    
    card.style.display = (matchesSearch && matchesFilter) ? '' : 'none';
  });
}

function deleteLostFound(id, type) {
  if (!confirm('确定要删除这条信息吗？')) return;
  
  if (type === 'lost') {
    allData.lostList = allData.lostList.filter(item => item.id !== id);
    saveData('lostList', allData.lostList);
  } else {
    allData.foundList = allData.foundList.filter(item => item.id !== id);
    saveData('foundList', allData.foundList);
  }
  
  showToast('已删除', 'success');
  renderLostFoundGrid();
  updateDashboard();
}

// ========== 论坛管理 ==========
function renderForumTable() {
  const tbody = document.getElementById('forumTableBody');
  if (!tbody) return;
  
  if (allData.forumPosts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state-cell">
          <div class="empty-state">
            <span class="empty-icon">💬</span>
            <p>暂无帖子数据</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = allData.forumPosts.map(post => `
    <tr>
      <td>${post.title || '无标题'}</td>
      <td>${post.authorNickName || post.author || '匿名'}</td>
      <td><span class="tag tag-green">${post.category || '综合'}</span></td>
      <td>${post.likes || 0}</td>
      <td>${(post.comments || []).length}</td>
      <td>${formatTime(post.timestamp)}</td>
      <td>
        <button class="btn-danger" onclick="deletePost(${post.id})" style="padding: 6px 12px; font-size: 12px;">删除</button>
      </td>
    </tr>
  `).join('');
}

function filterForum() {
  const searchTerm = document.getElementById('forumSearch').value.toLowerCase();
  const filterCategory = document.getElementById('forumFilter').value;
  const rows = document.querySelectorAll('#forumTableBody tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const matchesSearch = text.includes(searchTerm);
    
    let matchesFilter = true;
    if (filterCategory) {
      matchesFilter = text.includes(filterCategory.toLowerCase());
    }
    
    row.style.display = (matchesSearch && matchesFilter) ? '' : 'none';
  });
}

function deletePost(id) {
  if (!confirm('确定要删除这个帖子吗？')) return;
  
  allData.forumPosts = allData.forumPosts.filter(p => p.id !== id);
  saveData('forumPosts', allData.forumPosts);
  
  showToast('帖子已删除', 'success');
  renderForumTable();
  updateDashboard();
}

// ========== 活动管理 ==========
function renderActivitiesGrid() {
  const grid = document.getElementById('activitiesGrid');
  if (!grid) return;
  
  if (allData.activityList.length === 0) {
    grid.innerHTML = `
      <div class="empty-card elevation-1">
        <span class="empty-icon">🎉</span>
        <p>暂无活动数据</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = allData.activityList.map(act => {
    const participants = act.participants || [];
    const count = participants.length;
    const maxPeople = act.maxPeople || 999;
    const isFull = count >= maxPeople;
    const isEnded = act.status === 'ended';
    const statusText = isEnded ? '已结束' : isFull ? '已满' : '报名中';
    const statusClass = isEnded ? 'tag-red' : isFull ? 'tag-gold' : 'tag-green';
    
    return `
      <div class="stat-card elevation-1">
        <div style="flex: 1;">
          <h4 style="margin-bottom: 8px;">${act.title || '无标题'}</h4>
          <p style="font-size: 13px; color: var(--md-on-surface-variant); margin-bottom: 8px;">
            ${act.description || '无描述'}
          </p>
          <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
            <span class="tag ${statusClass}">${statusText}</span>
            <span style="font-size: 12px; color: var(--md-outline);">${count}/${maxPeople === 999 ? '不限' : maxPeople}人</span>
          </div>
          <div style="font-size: 12px; color: var(--md-outline);">
            ${act.startTime || '时间未定'}
          </div>
        </div>
        <button class="btn-danger" onclick="deleteActivity(${act.id})" style="padding: 6px 12px; font-size: 12px; margin-top: 12px;">删除</button>
      </div>
    `;
  }).join('');
}

function filterActivities() {
  const searchTerm = document.getElementById('actSearch').value.toLowerCase();
  const filterStatus = document.getElementById('actFilter').value;
  const cards = document.querySelectorAll('#activitiesGrid .stat-card');
  
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    const matchesSearch = text.includes(searchTerm);
    
    let matchesFilter = true;
    if (filterStatus === 'open') {
      matchesFilter = text.includes('报名中');
    } else if (filterStatus === 'full') {
      matchesFilter = text.includes('已满');
    } else if (filterStatus === 'ended') {
      matchesFilter = text.includes('已结束');
    }
    
    card.style.display = (matchesSearch && matchesFilter) ? '' : 'none';
  });
}

function deleteActivity(id) {
  if (!confirm('确定要删除这个活动吗？')) return;
  
  allData.activityList = allData.activityList.filter(a => a.id !== id);
  saveData('activityList', allData.activityList);
  
  showToast('活动已删除', 'success');
  renderActivitiesGrid();
  updateDashboard();
}

// ========== 风景管理 ==========
function renderSceneryGrid() {
  const grid = document.getElementById('sceneryGrid');
  if (!grid) return;
  
  if (allData.sceneryList.length === 0) {
    grid.innerHTML = `
      <div class="empty-card elevation-1">
        <span class="empty-icon">📸</span>
        <p>暂无风景数据</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = allData.sceneryList.map(scenery => `
    <div class="stat-card elevation-1" style="padding: 16px;">
      ${scenery.image ? `<img src="${scenery.image}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;" alt="风景">` : ''}
      <h4 style="margin-bottom: 8px; font-size: 16px;">${scenery.title || '无标题'}</h4>
      <p style="font-size: 13px; color: var(--md-on-surface-variant); margin-bottom: 8px;">
        ${scenery.location || '位置未知'}
      </p>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 12px; color: var(--md-outline);">${formatTime(scenery.id)}</span>
        <button class="btn-danger" onclick="deleteScenery(${scenery.id})" style="padding: 6px 12px; font-size: 12px;">删除</button>
      </div>
    </div>
  `).join('');
}

function filterScenery() {
  const searchTerm = document.getElementById('scenerySearch').value.toLowerCase();
  const cards = document.querySelectorAll('#sceneryGrid .stat-card');
  
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(searchTerm) ? '' : 'none';
  });
}

function deleteScenery(id) {
  if (!confirm('确定要删除这张风景照吗？')) return;
  
  allData.sceneryList = allData.sceneryList.filter(s => s.id !== id);
  saveData('sceneryList', allData.sceneryList);
  
  showToast('风景照已删除', 'success');
  renderSceneryGrid();
  updateDashboard();
}

// ========== 系统功能 ==========
function refreshData() {
  loadAllData();
  loadPageData(currentPage);
  showToast('数据已刷新', 'success');
}

function exportAllData() {
  try {
    const dataStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `云小农数据备份_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('数据导出成功', 'success');
  } catch (e) {
    console.error('导出失败:', e);
    showToast('导出失败', 'error');
  }
}

function clearCache() {
  if (!confirm('确定要清除缓存数据吗？这将保留用户数据但清除临时数据。')) return;
  
  // 只清除临时数据，保留用户相关数据
  const keysToKeep = ['boundUsers', 'userInfo'];
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });
  
  showToast('缓存已清除', 'success');
  loadAllData();
  updateDashboard();
}

function resetAllData() {
  if (!confirm('⚠️ 警告：此操作将删除所有数据且不可恢复！确定要继续吗？')) return;
  
  const secondConfirm = prompt('请输入 "DELETE" 确认删除所有数据：');
  if (secondConfirm !== 'DELETE') {
    showToast('操作已取消', 'info');
    return;
  }
  
  localStorage.clear();
  showToast('所有数据已重置', 'success');
  
  setTimeout(() => {
    location.reload();
  }, 1000);
}

// ========== 工具函数 ==========
function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('保存失败:', e);
    showToast('保存失败', 'error');
  }
}

function formatTime(timestamp) {
  if (!timestamp) return '-';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  // 小于1分钟
  if (diff < 60000) {
    return '刚刚';
  }
  
  // 小于1小时
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`;
  }
  
  // 小于24小时
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`;
  }
  
  // 小于7天
  if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}天前`;
  }
  
  // 显示日期
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // 如果是今年，不显示年份
  if (year === now.getFullYear()) {
    return `${month}-${day}`;
  }
  
  return `${year}-${month}-${day}`;
}

function showToast(message, type = 'info') {
  // 创建Toast元素
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // 样式
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 12px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  // 3秒后自动消失
  setTimeout(() => {
    toast.style.animation = 'fadeIn 0.3s ease reverse';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// 添加Toast动画
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(style);
