# 云小农智慧校园小程序 - 可视化界面关系图

## 📊 完整页面导航图 (Mermaid)

```mermaid
graph TB
    Start[启动应用] --> CheckLogin{检查登录状态}
    
    CheckLogin -->|未登录| Login[🔐 登录页<br/>pages/login/login]
    CheckLogin -->|已登录| Index[🏠 首页-三屏滑动<br/>pages/index/index]
    
    Login --> WechatAuth[微信授权登录]
    Login --> StudentAuth[学号密码登录]
    WechatAuth --> ValidateUser{验证用户}
    StudentAuth --> ValidateUser
    ValidateUser -->|成功| SaveStorage[保存localStorage]
    SaveStorage --> Index
    
    Index --> SwipeRight[右滑: 校园日报]
    Index --> Center[中屏: AI助手]
    Index --> SwipeLeft[左滑: 功能大厅]
    
    SwipeRight --> NewsCategory[📰 资讯分类<br/>pages/newsCategory]
    NewsCategory --> NewsDetail[📄 资讯详情<br/>pages/newsDetail]
    
    Center --> ChatInput[输入问题]
    ChatInput --> AIResponse[关键词匹配回答]
    
    SwipeLeft --> FuncGrid[10个功能入口]
    
    FuncGrid --> Todo[📋 待办事项<br/>pages/todo/todo]
    FuncGrid --> LostFound[🔍 失物招领<br/>pages/lostfound/lostfound]
    FuncGrid --> Course[📅 我的课表<br/>pages/course/course]
    FuncGrid --> Forum[💬 校园论坛<br/>pages/forum/forum]
    FuncGrid --> Activities[🎉 校园活动<br/>pages/activities/activities]
    FuncGrid --> Scenery[📸 校园一角<br/>pages/scenery/scenery]
    FuncGrid --> VoiceMap[🎙️ 留声机<br/>pages/voiceMap/voiceMap]
    FuncGrid --> Study[📚 学习打卡<br/>pages/study/study]
    FuncGrid --> CampusMap[🗺️ 校园地图<br/>pages/campusMap/campusMap]
    FuncGrid --> Campus[🌾 校园生活<br/>pages/campus/campus]
    
    Todo --> TodoFab[+ FAB按钮]
    TodoFab --> TodoPublish[发布待办<br/>pages/todoPublish]
    TodoPublish --> SaveTodo[保存到userTodos]
    SaveTodo --> Todo
    
    LostFound --> LFTab{分类标签}
    LFTab --> |失物| LostList[失物列表]
    LFTab --> |招领| FoundList[招领列表]
    LostList --> LFDetail[详情<br/>pages/lostfoundDetail]
    FoundList --> LFDetail
    LFDetail --> ContactUser[联系发布者]
    LostFound --> LFFab[+ FAB按钮]
    LFFab --> LFPublish[发布失物<br/>pages/lostfoundPublish]
    LFPublish --> UploadImage[上传图片]
    UploadImage --> SaveLF[保存到lostList/foundList]
    SaveLF --> LostFound
    
    Course --> WeekView[周视图课表]
    WeekView --> ClickSlot[点击时间格]
    ClickSlot --> AddCourse[添加课程弹窗]
    AddCourse --> SaveCourse[保存到courseList]
    SaveCourse --> Course
    
    Forum --> PostList[帖子列表]
    PostList --> PostDetail[详情<br/>pages/forumDetail]
    PostDetail --> Comment[评论]
    PostDetail --> Like[点赞]
    Forum --> ForumFab[+ FAB按钮]
    ForumFab --> ForumPublish[发帖<br/>pages/forumPublish]
    ForumPublish --> SavePost[保存到forumPosts]
    SavePost --> Forum
    
    Activities --> ActList[活动列表]
    ActList --> ActDetail[详情<br/>pages/activityDetail]
    ActDetail --> Signup{报名操作}
    Signup --> |报名| JoinAct[加入参与者列表]
    Signup --> |取消| LeaveAct[移除参与者]
    JoinAct --> SaveAct[保存到activityList]
    LeaveAct --> SaveAct
    SaveAct --> Activities
    Activities --> ActFab[+ FAB按钮]
    ActFab --> ActPublish[创建活动<br/>pages/activityPublish]
    ActPublish --> SaveNewAct[保存新活动]
    SaveNewAct --> Activities
    
    Scenery --> PhotoWall[瀑布流照片墙]
    PhotoWall --> PhotoDetail[详情<br/>pages/sceneryDetail]
    Scenery --> SceneryFab[+ FAB按钮]
    SceneryFab --> SceneryPublish[发布风景<br/>pages/sceneryPublish]
    SceneryPublish --> UploadPhoto[上传照片]
    UploadPhoto --> SaveScenery[保存到sceneryList]
    SaveScenery --> Scenery
    
    VoiceMap --> MapView[语音地图]
    MapView --> ClickPoint[点击地标]
    ClickPoint --> PlayVoice[播放语音]
    VoiceMap --> RecordVoice[录音打卡]
    
    Study --> StudyList[打卡记录]
    Study --> StudyFab[+ FAB按钮]
    StudyFab --> StudyPublish[发布打卡<br/>pages/studyPublish]
    StudyPublish --> SaveStudy[保存学习记录]
    SaveStudy --> Study
    
    CampusMap --> ShowMap[显示校园地图]
    ShowMap --> MarkLocation[标注地标]
    
    AllPages[所有页面] --> Profile[👤 个人中心<br/>pages/profile/profile]
    Profile --> EditProfile[编辑资料]
    Profile --> ViewStats[查看统计]
    Profile --> Logout[退出登录]
    Logout --> Login
    
    style Login fill:#4CAF50,stroke:#2E7D32,color:#fff
    style Index fill:#2196F3,stroke:#1565C0,color:#fff
    style Profile fill:#FF9800,stroke:#E65100,color:#fff
    style Todo fill:#9C27B0,stroke:#7B1FA2,color:#fff
    style LostFound fill:#F44336,stroke:#C62828,color:#fff
    style Course fill:#00BCD4,stroke:#0097A7,color:#fff
    style Forum fill:#795548,stroke:#5D4037,color:#fff
    style Activities fill:#E91E63,stroke:#AD1457,color:#fff
    style Scenery fill:#3F51B5,stroke:#283593,color:#fff
```

---

## 🔄 数据流向图

```mermaid
graph LR
    subgraph LocalStorage["LocalStorage 本地数据库"]
        direction TB
        A[userTodos] 
        B[lostList]
        C[foundList]
        D[courseList]
        E[forumPosts]
        F[activityList]
        G[sceneryList]
        H[voiceList]
        I[studyRecords]
        J[chatHistory]
        K[userInfo]
        L[boundUsers]
    end
    
    subgraph Modules["功能模块"]
        direction TB
        M1[Todo模块]
        M2[LostFound模块]
        M3[Course模块]
        M4[Forum模块]
        M5[Activities模块]
        M6[Scenery模块]
        M7[VoiceMap模块]
        M8[Study模块]
        M9[Chat模块]
        M10[Profile模块]
        M11[Login模块]
    end
    
    A --> M1
    B --> M2
    C --> M2
    D --> M3
    E --> M4
    F --> M5
    G --> M6
    H --> M7
    I --> M8
    J --> M9
    K --> M10
    K --> M11
    L --> M11
    
    M1 -->|CRUD| A
    M2 -->|CRUD| B
    M2 -->|CRUD| C
    M3 -->|CRUD| D
    M4 -->|CRUD| E
    M5 -->|CRUD| F
    M6 -->|CRUD| G
    M7 -->|Read| H
    M8 -->|CRUD| I
    M9 -->|Append| J
    M10 -->|Read| K
    M11 -->|Verify| L
    M11 -->|Save| K
    
    style LocalStorage fill:#E8F5E9,stroke:#2E7D32,stroke-width:3px
    style Modules fill:#E3F2FD,stroke:#1565C0,stroke-width:3px
```

---

## 🎨 Material Design 3 组件层级图

```mermaid
graph TB
    subgraph Page["页面容器"]
        P1[Top App Bar]
        P2[Content Area]
        P3[Bottom Navigation]
    end
    
    subgraph Components["Material You 组件库"]
        direction TB
        
        subgraph Buttons["按钮系统"]
            B1[Filled Button<br/>主要按钮]
            B2[Tonal Button<br/>次要按钮]
            B3[Outlined Button<br/>描边按钮]
            B4[Text Button<br/>文本按钮]
            B5[FAB<br/>浮动操作按钮]
        end
        
        subgraph Cards["卡片系统"]
            C1[Elevated Card<br/>凸起卡片]
            C2[Filled Card<br/>填充卡片]
            C3[Outlined Card<br/>描边卡片]
            C4[Glass Card<br/>毛玻璃卡片]
            C5[Morphing Card<br/>变形卡片]
            C6[Glow Card<br/>发光卡片]
        end
        
        subgraph Inputs["表单系统"]
            I1[Text Field<br/>文本输入框]
            I2[Select<br/>下拉选择]
            I3[Picker<br/>选择器]
            I4[Switch<br/>开关]
            I5[Slider<br/>滑块]
        end
        
        subgraph Navigation["导航系统"]
            N1[Tab Bar<br/>标签栏]
            N2[Chips<br/>筛选标签]
            N3[Drawer<br/>侧边栏]
            N4[Bottom Sheet<br/>底部弹窗]
        end
        
        subgraph Feedback["反馈组件"]
            F1[Toast<br/>轻提示]
            F2[Dialog<br/>对话框]
            F3[Snackbar<br/>消息条]
            F4[Progress<br/>进度条]
            F5[Skeleton<br/>骨架屏]
        end
    end
    
    P1 --> Components
    P2 --> Components
    P3 --> Components
    
    style Page fill:#F5F5F5,stroke:#333,stroke-width:2px
    style Buttons fill:#E8F5E9,stroke:#2E7D32
    style Cards fill:#FFF3E0,stroke:#FF9800
    style Inputs fill:#E3F2FD,stroke:#2196F3
    style Navigation fill:#F3E5F5,stroke:#9C27B0
    style Feedback fill:#FFEBEE,stroke:#F44336
```

---

## 📱 页面状态转换图

```mermaid
stateDiagram-v2
    [*] --> Splash: 启动
    Splash --> Checking: 检查登录
    Checking --> Login: 未登录
    Checking --> Home: 已登录
    
    state Login {
        [*] --> InputForm: 输入信息
        InputForm --> Validating: 提交
        Validating --> Success: 验证通过
        Validating --> Error: 验证失败
        Error --> InputForm: 重新输入
        Success --> [*]
    }
    
    state Home {
        [*] --> CenterScreen: 默认中屏
        CenterScreen --> RightScreen: 右滑
        CenterScreen --> LeftScreen: 左滑
        RightScreen --> CenterScreen: 左滑
        LeftScreen --> CenterScreen: 右滑
        
        LeftScreen --> FeatureList: 功能列表
        FeatureList --> TodoPage: 点击待办
        FeatureList --> LostFoundPage: 点击失物
        FeatureList --> CoursePage: 点击课表
        FeatureList --> ForumPage: 点击论坛
        FeatureList --> ActivityPage: 点击活动
        FeatureList --> SceneryPage: 点击风景
    }
    
    state TodoPage {
        [*] --> ListMode: 列表展示
        ListMode --> FilterMode: 点击筛选
        FilterMode --> ListMode: 应用筛选
        ListMode --> DetailMode: 点击卡片
        DetailMode --> ListMode: 返回
        ListMode --> PublishMode: 点击FAB
        PublishMode --> ListMode: 保存
    }
    
    state LostFoundPage {
        [*] --> TabView: 标签切换
        TabView --> LostTab: 失物
        TabView --> FoundTab: 招领
        LostTab --> DetailView: 点击卡片
        FoundTab --> DetailView
        DetailView --> TabView: 返回
        TabView --> PublishView: 点击FAB
        PublishView --> TabView: 发布
    }
    
    Login --> Home: 登录成功
    Home --> Profile: 点击头像
    Profile --> Home: 返回
    Profile --> Login: 退出登录
    
    Home --> [*]: 关闭应用
```

---

## 🎯 用户旅程地图 (User Journey Map)

```mermaid
journey
    title 云小农用户使用旅程
    section 首次使用
      打开小程序: 5: 用户
      选择登录方式: 4: 用户
      输入学号密码: 3: 用户
      登录成功: 5: 系统
      浏览首页: 5: 用户
    
    section 日常使用
      查看AI助手: 4: 用户
      滑动功能大厅: 5: 用户
      创建待办事项: 4: 用户
      浏览失物招领: 3: 用户
      查看课表: 5: 用户
    
    section 深度使用
      发布论坛帖子: 4: 用户
      报名参加活动: 5: 用户
      上传校园风景: 4: 用户
      语音打卡: 3: 用户
      学习记录: 4: 用户
    
    section 长期留存
      查看个人统计: 5: 用户
      管理个人信息: 4: 用户
      持续使用功能: 5: 用户
```

---

## 📊 功能使用频率热力图

```
┌─────────────────────────────────────────────────────┐
│           功能模块使用频率预测                         │
├──────────────────┬──────────┬──────────┬────────────┤
│ 功能模块          │ 日活     │ 周活     │ 月活       │
├──────────────────┼──────────┼──────────┼────────────┤
│ AI助手           │ ⭐⭐⭐⭐⭐ │ ⭐⭐⭐⭐⭐ │ ⭐⭐⭐⭐⭐   │
│ 待办事项         │ ⭐⭐⭐⭐⭐ │ ⭐⭐⭐⭐⭐ │ ⭐⭐⭐⭐     │
│ 课程表           │ ⭐⭐⭐⭐   │ ⭐⭐⭐⭐⭐ │ ⭐⭐⭐⭐⭐   │
│ 失物招领         │ ⭐⭐⭐     │ ⭐⭐⭐⭐   │ ⭐⭐⭐⭐     │
│ 校园论坛         │ ⭐⭐⭐⭐   │ ⭐⭐⭐⭐⭐ │ ⭐⭐⭐⭐⭐   │
│ 校园活动         │ ⭐⭐⭐     │ ⭐⭐⭐⭐   │ ⭐⭐⭐⭐     │
│ 校园风景         │ ⭐⭐       │ ⭐⭐⭐     │ ⭐⭐⭐⭐     │
│ 留声机           │ ⭐⭐       │ ⭐⭐⭐     │ ⭐⭐⭐       │
│ 学习打卡         │ ⭐⭐⭐⭐   │ ⭐⭐⭐⭐⭐ │ ⭐⭐⭐⭐     │
│ 校园地图         │ ⭐⭐       │ ⭐⭐⭐     │ ⭐⭐⭐       │
└──────────────────┴──────────┴──────────┴────────────┘
```

---

## 🎨 UI设计规范速查表

### 色彩使用场景
```
Primary (#2E7D32):
  ✓ 主要按钮
  ✓ 激活状态
  ✓ 链接文字
  ✓ 图标高亮

Primary Container (#B8EFC1):
  ✓ 卡片背景
  ✓ 标签背景
  ✓ 悬浮按钮

Secondary (#52634F):
  ✓ 次要按钮
  ✓ 辅助信息

Tertiary (#D4A017):
  ✓ 强调元素
  ✓ 警告提示
  ✓ 特殊标记

Error (#BA1A1A):
  ✓ 错误提示
  ✓ 删除按钮
  ✓ 危险操作
```

### 间距规范
```
4rpx:  微小间距 (图标与文字)
8rpx:  小间距 (标签内边距)
12rpx: 中小间距 (相关元素间)
16rpx: 标准间距 (卡片内边距)
24rpx: 大间距 (区块间)
32rpx: 超大间距 (页面级)
```

### 字体大小
```
20rpx: 辅助文字 (标签说明)
22rpx: 次要文字 (时间戳)
24rpx: 正文小号
26rpx: 正文标准
28rpx: 正文大号
30rpx: 小标题
32rpx: 中标题
36rpx: 大标题
40rpx+: 展示性文字
```

### 动画时长
```
150ms: 微交互反馈
200ms: 按钮点击
300ms: 页面转场
400ms: 卡片进入
500ms: 模态框弹出
```

---

**文档版本**: v2.0  
**最后更新**: 2026-06-01  
**设计系统**: Material Design 3  
**总页面数**: 26个  
**交互节点**: 100+
