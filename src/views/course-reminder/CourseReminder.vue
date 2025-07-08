<template>
  <el-card shadow="never" class="course-reminder">
    <div slot="header" class="clearfix">
      <span>课程提醒</span>
    </div>

    <!-- 顶部开关：站内提醒 & 邮件提醒 -->
    <el-row class="search-container" gutter="20">
      <el-col :span="12">
        <div class="switch-container">
          <el-switch
            v-model="settings.inSite"
            active-text="开启站内提醒"
            inactive-text="关闭站内提醒"
            @change="onToggle('inSite')"
          />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="switch-container">
          <el-switch
            v-model="settings.email"
            active-text="开启邮件提醒"
            inactive-text="关闭邮件提醒"
            @change="onToggle('email')"
          />
        </div>
      </el-col>
    </el-row>

    <!-- 仅当站内提醒开启时，展示最新1条提醒 -->
    <div v-if="settings.inSite" style="margin-top: 20px;" v-loading="loading">
      <el-table stripe border :data="reminders" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="message" label="提醒内容" />
        <el-table-column prop="remindTime" label="提醒时间" width="180" />
      </el-table>
      <el-empty v-if="!reminders.length" description="暂无提醒" />
    </div>

  </el-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'CourseReminder',
  data () {
    return {
      settings: {
        inSite: false,
        email: false
      },
      reminders: [],
      loading: false
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.authentication.userInfo
    })
  },
  methods: {
    ...mapActions([
      'GetReminderSettings',
      'UpdateReminderSettings',
      'GetUpcomingReminders'
    ]),
    // 初始化：拉取用户设置 & 如果站内提醒开启则拉取列表
    init () {
      this.GetReminderSettings({ username: this.userInfo.username })
        .then(res => {
          this.settings = res
          if (this.settings.inSite) {
            this.loadReminders()
          }
        })
    },
    // 切换设置时调用
    onToggle (key) {
      if (key === 'email' && this.settings.email) {
        // 检查邮箱
        if (!this.userInfo || !this.userInfo.email) {
          this.$message.warning('请先在个人信息中填写邮箱地址！')
          this.settings.email = false
          return
        }
      }
      this.UpdateReminderSettings({ username: this.userInfo.username, [key]: this.settings[key] })
        .then(() => {
          this.$message.success('提醒设置已更新')
          if (key === 'inSite' && this.settings.inSite) {
            this.loadReminders()
          } else if (key === 'inSite') {
            this.reminders = []
          }
        })
    },
    // 拉取最近 1 条即将提醒的数据
    loadReminders () {
      this.loading = true
      this.GetUpcomingReminders({ username: this.userInfo.username, limit: 1 })
        .then(res => {
          this.reminders = res
          // 有新提醒时，设置红点
          if (res && res.length > 0) {
            this.$store.commit('SET_REMINDER_DOT', true)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 用户点击页面时，消除红点
    clearReminderDot () {
      this.$store.commit('SET_REMINDER_DOT', false)
    }
  },
  mounted () {
    this.init()
    // 进入页面时消除红点
    this.clearReminderDot()
  }
}
</script>

<style>
/* 课程提醒页面主题化样式 */
.course-reminder .el-card__header {
  background: #409EFF !important;
  color: white !important;
}

.course-reminder .search-container {
  margin-bottom: 20px;
}

.course-reminder .switch-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.course-reminder .switch-container:hover {
  border-color: #409EFF;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.course-reminder .el-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.course-reminder .el-table th {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #409EFF;
}

.course-reminder .el-table tbody tr:hover {
  background: linear-gradient(135deg, #f8fbff, #ecf5ff);
}

.course-reminder .el-switch.is-checked .el-switch__core {
  background-color: #409EFF;
}

/* 暗色主题 */
.theme-dark .course-reminder .el-card__header {
  background: #666666 !important;
  color: white !important;
}

.theme-dark .course-reminder .switch-container {
  background: #2d2d2d;
  border-color: #404040;
  color: #ffffff;
}

.theme-dark .course-reminder .switch-container:hover {
  border-color: #666666;
  box-shadow: 0 2px 8px rgba(102, 102, 102, 0.1);
}

.theme-dark .course-reminder .el-table {
  background-color: #2d2d2d;
  color: #ffffff;
}

.theme-dark .course-reminder .el-table th {
  background: #3d3d3d !important;
  color: #ffffff !important;
  border-bottom-color: #666666 !important;
}

.theme-dark .course-reminder .el-table td {
  background-color: #2d2d2d !important;
  color: #ffffff !important;
  border-bottom-color: #404040 !important;
}

.theme-dark .course-reminder .el-table tbody tr:hover {
  background: #404040 !important;
}

.theme-dark .course-reminder .el-switch.is-checked .el-switch__core {
  background-color: #666666;
}

/* 马卡龙主题 */
.theme-macaron .course-reminder .el-card__header {
  background: #8b4789 !important;
  color: white !important;
}

.theme-macaron .course-reminder .switch-container {
  background: #fff0f5;
  border-color: #f8d7da;
}

.theme-macaron .course-reminder .switch-container:hover {
  border-color: #8b4789;
  box-shadow: 0 2px 8px rgba(139, 71, 137, 0.1);
}

.theme-macaron .course-reminder .el-switch.is-checked .el-switch__core {
  background-color: #8b4789;
}

/* 清新绿主题 */
.theme-fresh-green .course-reminder .el-card__header {
  background: #1e7e34 !important;
  color: white !important;
}

.theme-fresh-green .course-reminder .switch-container {
  background: #f0fff4;
  border-color: #d4edda;
}

.theme-fresh-green .course-reminder .switch-container:hover {
  border-color: #1e7e34;
  box-shadow: 0 2px 8px rgba(30, 126, 52, 0.1);
}

.theme-fresh-green .course-reminder .el-switch.is-checked .el-switch__core {
  background-color: #1e7e34;
}

/* 复古黄主题 */
.theme-retro-yellow .course-reminder .el-card__header {
  background: #8b4513 !important;
  color: white !important;
}

.theme-retro-yellow .course-reminder .switch-container {
  background: #fdf6e3;
  border-color: #f3ecd4;
}

.theme-retro-yellow .course-reminder .switch-container:hover {
  border-color: #8b4513;
  box-shadow: 0 2px 8px rgba(139, 69, 19, 0.1);
}

.theme-retro-yellow .course-reminder .el-switch.is-checked .el-switch__core {
  background-color: #8b4513;
}
</style>
