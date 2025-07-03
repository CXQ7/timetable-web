<template>
  <el-container>
    <el-aside width="100px">
      <el-menu
        router
        @select="handleSelect">
        <el-menu-item v-for="item in navData"
                      :key="item.code"
                      :index="item.code" :route="item.path">
          <span>{{item.name}}</span>
          <el-badge v-if="item.code==='07' && reminderDot" is-dot style="margin-left: 4px;">
          </el-badge>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main style="padding: 10px 20px;">
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Main',
  components: {
  },
  data () {
    return {
      navData: [
        {
          code: '01',
          path: '/course-scheduling',
          name: '排课日历'
        },
        {
          code: '02',
          path: '/course-scheduling-list',
          name: '排课列表'
        },
        {
          code: '03',
          path: '/classroom',
          name: '教室'
        },
        {
          code: '04',
          path: '/course',
          name: '课程'
        },
        {
          code: '05',
          path: '/teacher',
          name: '老师'
        },
        {
          code: '06',
          path: '/report',
          name: '报表'
        },
        {
          code: '07',
          path: '/course-reminder',
          name: '课程提醒'
        }
      ],
      pollInterval: null, // 轮询定时器
      currentNavName: ''
    }
  },
  computed: {
    ...mapState({
      reminderDot: state => state.courseReminder.reminderDot,
      userInfo: state => state.authentication.userInfo
    })
  },
  methods: {
    ...mapActions([
      'GetReminderSettings',
      'GetUpcomingReminders'
    ]),

    handleSelect (key, keyPath) {
    },

    startReminderPolling () {
      // 每分钟检查一次
      this.pollInterval = setInterval(() => {
        this.checkReminderDot()
      }, 60000)
    },

    checkReminderDot () {
      // 先判断是否开启了站内提醒
      this.GetReminderSettings().then(settings => {
        if (settings.inSite) {
          this.GetUpcomingReminders({ limit: 1 }).then(reminders => {
            if (reminders && reminders.length > 0) {
              this.$store.commit('SET_REMINDER_DOT', true)
            }
          })
        }
      })
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

</style>
