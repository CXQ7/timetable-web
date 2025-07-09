<template>
  <el-container class="main-container">
    <el-aside width="100px" class="main-aside">
      <el-menu router @select="handleSelect" class="main-menu">
        <el-menu-item
          v-for="item in regularNavData"
          :key="item.code"
          :index="item.code"
          :route="item.path"
          class="main-menu-item"
        >
          <span>{{ item.name }}</span>
          <el-badge
            v-if="item.code === '05' && reminderDot"
            is-dot
            class="reminder-badge"
          >
          </el-badge>
        </el-menu-item>
        <div class="logout-menu-item main-menu-item" @click="handleLogout">
          <span>注销</span>
        </div>
      </el-menu>
    </el-aside>
    <el-main class="main-content">
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Main',
  components: {},
  data () {
    return {
      navData: [
        {
          code: '01',
          path: '/course-scheduling',
          name: '课表展示'
        },
        {
          code: '02',
          path: '/course-scheduling-list',
          name: '选课列表'
        },
        {
          code: '03',
          path: '/basic-data-management',
          name: '数据管理'
        },

        {
          code: '05',
          path: '/course-reminder',
          name: '课程提醒'
        },
        {
          code: '06',
          path: '/settings',
          name: '系统设置'
        },
        {
          code: '07',
          path: '/logout',
          name: '注销',
          isLogout: true
        }
      ],
      pollInterval: null, // 轮询定时器
      currentNavName: ''
    }
  },
  computed: {
    ...mapState({
      reminderDot: (state) => state.courseReminder.reminderDot,
      userInfo: (state) => state.authentication.userInfo
    }),
    regularNavData () {
      return this.navData.filter((item) => !item.isLogout)
    }
  },
  methods: {
    ...mapActions(['GetReminderSettings', 'GetUpcomingReminders']),

    handleSelect (key, keyPath) {},

    handleLogout () {
      this.$confirm('确定要注销登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 清除用户信息和token
          this.$store.commit('SET_USER_INFO', null)
          this.$store.commit('SET_TOKEN', null)

          // 清除本地存储
          localStorage.removeItem('userInfo')
          localStorage.removeItem('token')

          // 停止轮询
          if (this.pollInterval) {
            clearInterval(this.pollInterval)
          }

          // 跳转到登录页面
          this.$router.replace('/login')
          this.$message.success('注销成功')
        })
        .catch(() => {
          // 用户取消注销
        })
    },

    startReminderPolling () {
      // 每分钟检查一次
      this.pollInterval = setInterval(() => {
        this.checkReminderDot()
      }, 60000)
    },

    checkReminderDot () {
      console.log('[轮询] 开始检查提醒设置')
      // 先判断是否开启了站内提醒
      this.GetReminderSettings({ username: this.userInfo.username }).then(
        (settings) => {
          console.log('[轮询] 当前提醒设置：', settings)
          if (settings.inSite) {
            console.log('[轮询] 准备请求 upcoming reminders')
            this.GetUpcomingReminders({
              username: this.userInfo.username,
              limit: 1
            }).then((reminders) => {
              console.log('[轮询] 获取到的提醒数据：', reminders)
              if (reminders && reminders.length > 0) {
                this.$store.commit('SET_REMINDER_DOT', true)
              }
            })
          }
          if (!settings.inSite && settings.email) {
            this.GetUpcomingReminders({
              username: this.userInfo.username,
              limit: 1
            })
          }
        }
      )
    },

    clearReminderDotIfOnReminderPage () {
      if (this.$route.path === '/course-reminder') {
        this.$store.commit('SET_REMINDER_DOT', false)
      }
    }
  },
  watch: {
    '$route.path' () {
      this.clearReminderDotIfOnReminderPage()
    }
  },
  mounted () {
    // 首次加载立即检查
    this.checkReminderDot()
    this.startReminderPolling()
    this.clearReminderDotIfOnReminderPage()
  },
  beforeDestroy () {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
    }
  }
}
</script>

<style scoped>
.main-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.main-aside {
  background: #2c3e50;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.main-aside::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    #ff6b6b,
    #4ecdc4,
    #45b7d1,
    #96ceb4,
    #ffeaa7
  );
  opacity: 0.8;
}

.main-menu {
  border: none;
  background: transparent;
  padding: 20px 0;
}

.main-menu-item {
  margin: 8px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  padding: 16px 12px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.main-menu-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.5s ease;
}

.main-menu-item:hover::before {
  left: 100%;
}

.main-menu-item:hover {
  background: #3498db;
  color: white;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.main-menu-item.is-active {
  background: #409eff;
  color: white;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.logout-menu-item {
  background: #f56c6c !important;
  color: white !important;
  margin-top: 20px;
}

.logout-menu-item:hover {
  background: #e6484a !important;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4) !important;
}

.reminder-badge {
  position: absolute;
  top: 15px;
  right: 64px;
  transform: scale(0.8);
}

.main-content {
  padding: 20px 30px;
  background: transparent;
  position: relative;
}

.main-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.02"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.02"/><circle cx="50" cy="10" r="0.5" fill="%23ffffff" opacity="0.01"/><circle cx="10" cy="60" r="0.5" fill="%23ffffff" opacity="0.01"/><circle cx="90" cy="40" r="0.5" fill="%23ffffff" opacity="0.01"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

/* 主题适配 */
.theme-dark .main-container {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.theme-dark .main-aside {
  background: #1a1a1a;
}

.theme-dark .main-menu-item:hover {
  background: #404040;
}

.theme-dark .main-menu-item.is-active {
  background: #666666;
}

.theme-dark .logout-menu-item {
  background: #c0392b !important;
}

.theme-dark .logout-menu-item:hover {
  background: #a93226 !important;
}

.theme-macaron .main-aside {
  background: #8b4789;
}

.theme-macaron .main-menu-item:hover {
  background: #a05a9e;
}

.theme-macaron .main-menu-item.is-active {
  background: #ffb6b9;
}

.theme-macaron .logout-menu-item {
  background: #e74c3c !important;
}

.theme-macaron .logout-menu-item:hover {
  background: #c0392b !important;
}

.theme-fresh-green .main-aside {
  background: #1e7e34;
}

.theme-fresh-green .main-menu-item:hover {
  background: #28a745;
}

.theme-fresh-green .main-menu-item.is-active {
  background: #28c76f;
}

.theme-fresh-green .logout-menu-item {
  background: #dc3545 !important;
}

.theme-fresh-green .logout-menu-item:hover {
  background: #c82333 !important;
}

.theme-retro-yellow .main-aside {
  background: #8b4513;
}

.theme-retro-yellow .main-menu-item:hover {
  background: #a0522d;
}

.theme-retro-yellow .main-menu-item.is-active {
  background: #c29f42;
}

.theme-retro-yellow .logout-menu-item {
  background: #b8651f !important;
}

.theme-retro-yellow .logout-menu-item:hover {
  background: #9e5315 !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-aside {
    width: 80px !important;
  }
  .main-menu-item {
    font-size: 12px;
    padding: 12px 8px;
    margin: 4px 8px;
  }
  .main-content {
    padding: 15px 20px;
  }
}
</style>
