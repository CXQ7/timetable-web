import * as Api from '@/api/course-reminder'

const courseReminder = {
  state: {
  },
  mutations: {
  },
  actions: {
    // 拉取用户的提醒设置
    GetReminderSettings ({ commit }) {
      return new Promise((resolve, reject) => {
        Api.getReminderSettings()
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
