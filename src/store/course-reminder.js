import * as Api from '@/api/course-reminder'

const courseReminder = {
  state: {
    reminderDot: false // 红点状态
  },
  mutations: {
    SET_REMINDER_DOT (state, val) {
      state.reminderDot = val
    }
  },
  actions: {
    // 拉取用户的提醒设置
    GetReminderSettings ({ commit }, params) {
      return new Promise((resolve, reject) => {
        Api.getReminderSettings(params)
          .then(res => resolve(res.data))
          .catch(err => reject(err))
      })
    },
    // 更新提醒设置
    UpdateReminderSettings ({ commit }, data) {
      return new Promise((resolve, reject) => {
        Api.updateReminderSettings(data)
          .then(res => resolve(res.data))
          .catch(err => reject(err))
      })
    },
    // 获取即将到来的提醒列表
    GetUpcomingReminders ({ commit }, params) {
      return new Promise((resolve, reject) => {
        Api.getUpcomingReminders(params)
          .then(res => resolve(res.data.records))
          .catch(err => reject(err))
      })
    }
  }
}

export default courseReminder
