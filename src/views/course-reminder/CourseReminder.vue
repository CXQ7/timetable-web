<template>
  <el-card shadow="never">
    <div slot="header" class="clearfix">
      <span>课程提醒</span>
    </div>

    <!-- 顶部开关：站内提醒 & 邮件提醒 -->
    <el-row class="tams-search-container" gutter="20">
      <el-col :span="12">
        <el-switch
          v-model="settings.inSite"
          active-text="开启站内提醒"
          inactive-text="关闭站内提醒"
          @change="onToggle('inSite')"
        />
      </el-col>
      <el-col :span="12">
        <el-switch
          v-model="settings.email"
          active-text="开启邮件提醒"
          inactive-text="关闭邮件提醒"
          @change="onToggle('email')"
        />
      </el-col>
    </el-row>

    <!-- 仅当站内提醒开启时，展示最新 10 条提醒 -->
    <div v-if="settings.inSite" style="margin-top: 20px;" v-loading="loading">
      <el-table stripe border :data="reminders" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="message" label="提醒内容" />
        <el-table-column prop="remindTime" label="触发时间" width="180" />
      </el-table>
      <el-empty v-if="!reminders.length" description="暂无提醒" />
    </div>
  </el-card>
</template>

<script>
import { mapActions } from 'vuex'

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
  methods: {
    ...mapActions([
      'GetReminderSettings',
      'UpdateReminderSettings',
      'GetUpcomingReminders'
    ]),
    // 初始化：拉取用户设置 & 如果站内提醒开启则拉取列表
    init () {
      this.GetReminderSettings()
        .then(res => {
          this.settings = res
          if (this.settings.inSite) {
            this.loadReminders()
          }
        })
    },
    // 切换设置时调用
    onToggle (key) {
      this.UpdateReminderSettings({ [key]: this.settings[key] })
        .then(() => {
          if (key === 'inSite' && this.settings.inSite) {
            this.loadReminders()
          } else if (key === 'inSite') {
            this.reminders = []
          }
        })
    },
    // 拉取最近 10 条即将提醒的数据
    loadReminders () {
      this.loading = true
      this.GetUpcomingReminders({ limit: 10 })
        .then(res => {
          this.reminders = res
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
.tams-search-container {
  margin-bottom: 10px;
}
</style>
