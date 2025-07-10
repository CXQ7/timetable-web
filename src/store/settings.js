import {
  getCalendarSettings,
  saveCalendarSettings,
  updateCalendarSettings
} from '@/api/settings'

const state = {
  // 课表显示设置
  scheduleSettings: {
    name: 'test课表',
    firstWeekDay: '2025-07-07',
    classesPerDay: 11,
    semesterCount: 2,
    showSaturday: true,
    showSunday: false,
    showNonCurrentWeek: true,
    showTeacher: true,
    showClassroom: true
  },
  // 上课时间配置
  classTimes: [
    { section: 1, startTime: '08:00', endTime: '08:45' },
    { section: 2, startTime: '08:55', endTime: '09:40' },
    { section: 3, startTime: '10:10', endTime: '10:55' },
    { section: 4, startTime: '11:05', endTime: '11:50' },
    { section: 5, startTime: '14:30', endTime: '15:15' },
    { section: 6, startTime: '15:25', endTime: '16:10' },
    { section: 7, startTime: '16:40', endTime: '17:25' },
    { section: 8, startTime: '17:35', endTime: '18:20' },
    { section: 9, startTime: '19:10', endTime: '19:55' },
    { section: 10, startTime: '20:05', endTime: '20:50' },
    { section: 11, startTime: '21:00', endTime: '21:45' }
  ]
}

const mutations = {
  SET_SCHEDULE_SETTINGS (state, settings) {
    state.scheduleSettings = { ...state.scheduleSettings, ...settings }
  },
  SET_CLASS_TIMES (state, classTimes) {
    state.classTimes = classTimes
  },
  ADD_CLASS_TIME (state, classTime) {
    state.classTimes.push(classTime)
  },
  REMOVE_CLASS_TIME (state, index) {
    state.classTimes.splice(index, 1)
    // 重新编号
    state.classTimes.forEach((item, i) => {
      item.section = i + 1
    })
  }
}

const actions = {
  // 获取设置
  async GetSettings ({ commit }) {
    try {
      // 首先尝试从服务器获取设置
      try {
        const res = await getCalendarSettings()
        if (res && res.data) {
          const serverData = res.data

          // 如果服务器有设置数据，优先使用服务器数据
          if (serverData.scheduleSettings) {
            commit('SET_SCHEDULE_SETTINGS', serverData.scheduleSettings)
          }
          if (serverData.classTimes) {
            commit('SET_CLASS_TIMES', serverData.classTimes)
          }

          // 同步到本地存储
          if (serverData.scheduleSettings) {
            localStorage.setItem(
              'scheduleSettings',
              JSON.stringify(serverData.scheduleSettings)
            )
          }
          if (serverData.classTimes) {
            localStorage.setItem(
              'classTimes',
              JSON.stringify(serverData.classTimes)
            )
          }

          return { success: true, source: 'server' }
        }
      } catch (serverError) {
        console.warn(
          '从服务器获取设置失败，使用本地存储:',
          serverError.message
        )
      }

      // 如果服务器获取失败，从localStorage获取设置
      const savedSettings = localStorage.getItem('scheduleSettings')
      const savedClassTimes = localStorage.getItem('classTimes')

      if (savedSettings) {
        commit('SET_SCHEDULE_SETTINGS', JSON.parse(savedSettings))
      }

      if (savedClassTimes) {
        commit('SET_CLASS_TIMES', JSON.parse(savedClassTimes))
      }

      return { success: true, source: 'localStorage' }
    } catch (error) {
      console.error('获取设置失败:', error)
      return { success: false, message: error.message }
    }
  },

  // 保存课表设置
  async SaveScheduleSettings ({ commit, state, rootState }, settings) {
    try {
      console.log('Store收到的设置数据:', JSON.stringify(settings, null, 2))

      commit('SET_SCHEDULE_SETTINGS', settings)

      // 保存到localStorage
      localStorage.setItem(
        'scheduleSettings',
        JSON.stringify(state.scheduleSettings)
      )

      // 尝试同步到服务器
      try {
        const settingsData = {
          scheduleSettings: state.scheduleSettings,
          classTimes: state.classTimes,
          username: rootState.authentication.userInfo?.username // 添加username参数
        }

        console.log(
          '发送到后端API的完整数据:',
          JSON.stringify(settingsData, null, 2)
        )

        // 先尝试更新，如果失败则保存
        try {
          await updateCalendarSettings(settingsData)
        } catch (updateError) {
          // 如果更新失败，可能是记录不存在，尝试保存
          await saveCalendarSettings(settingsData)
        }
      } catch (serverError) {
        console.warn('同步设置到服务器失败:', serverError.message)
        // 即使服务器同步失败，本地保存成功也返回成功
      }

      return { success: true }
    } catch (error) {
      console.error('保存课表设置失败:', error)
      return { success: false, message: error.message }
    }
  },

  // 保存上课时间设置
  async SaveClassTimes ({ commit, state, rootState }, classTimes) {
    try {
      commit('SET_CLASS_TIMES', classTimes)

      // 保存到localStorage
      localStorage.setItem('classTimes', JSON.stringify(state.classTimes))

      // 尝试同步到服务器
      try {
        const settingsData = {
          scheduleSettings: state.scheduleSettings,
          classTimes: state.classTimes,
          username: rootState.authentication.userInfo?.username // 添加username参数
        }

        // 先尝试更新，如果失败则保存
        try {
          await updateCalendarSettings(settingsData)
        } catch (updateError) {
          // 如果更新失败，可能是记录不存在，尝试保存
          await saveCalendarSettings(settingsData)
        }
      } catch (serverError) {
        console.warn('同步设置到服务器失败:', serverError.message)
        // 即使服务器同步失败，本地保存成功也返回成功
      }

      return { success: true }
    } catch (error) {
      console.error('保存上课时间设置失败:', error)
      return { success: false, message: error.message }
    }
  },

  // 添加上课时间段
  async AddClassTime ({ commit, state, rootState }, classTime) {
    commit('ADD_CLASS_TIME', classTime)
    localStorage.setItem('classTimes', JSON.stringify(state.classTimes))

    // 同步到服务器
    try {
      const settingsData = {
        scheduleSettings: state.scheduleSettings,
        classTimes: state.classTimes,
        username: rootState.authentication.userInfo?.username // 添加username参数
      }

      try {
        await updateCalendarSettings(settingsData)
      } catch (updateError) {
        await saveCalendarSettings(settingsData)
      }
    } catch (serverError) {
      console.warn('同步设置到服务器失败:', serverError.message)
    }
  },

  // 删除上课时间段
  async RemoveClassTime ({ commit, state, rootState }, index) {
    commit('REMOVE_CLASS_TIME', index)
    localStorage.setItem('classTimes', JSON.stringify(state.classTimes))

    // 同步到服务器
    try {
      const settingsData = {
        scheduleSettings: state.scheduleSettings,
        classTimes: state.classTimes,
        username: rootState.authentication.userInfo?.username // 添加username参数
      }

      try {
        await updateCalendarSettings(settingsData)
      } catch (updateError) {
        await saveCalendarSettings(settingsData)
      }
    } catch (serverError) {
      console.warn('同步设置到服务器失败:', serverError.message)
    }
  },

  // 强制从服务器刷新设置
  async RefreshSettingsFromServer ({ commit }) {
    try {
      const res = await getCalendarSettings()
      if (res && res.data) {
        const serverData = res.data

        if (serverData.scheduleSettings) {
          commit('SET_SCHEDULE_SETTINGS', serverData.scheduleSettings)
          localStorage.setItem(
            'scheduleSettings',
            JSON.stringify(serverData.scheduleSettings)
          )
        }

        if (serverData.classTimes) {
          commit('SET_CLASS_TIMES', serverData.classTimes)
          localStorage.setItem(
            'classTimes',
            JSON.stringify(serverData.classTimes)
          )
        }

        return { success: true, data: serverData }
      } else {
        throw new Error('服务器未返回有效数据')
      }
    } catch (error) {
      console.error('从服务器刷新设置失败:', error)
      return { success: false, message: error.message }
    }
  }
}

const getters = {
  // 获取课表设置
  getScheduleSettings: (state) => state.scheduleSettings,
  // 获取上课时间配置
  getClassTimes: (state) => state.classTimes,
  // 获取是否显示老师
  getShowTeacher: (state) => state.scheduleSettings.showTeacher,
  // 获取是否显示教室
  getShowClassroom: (state) => state.scheduleSettings.showClassroom,
  // 获取是否显示周六
  getShowSaturday: (state) => state.scheduleSettings.showSaturday,
  // 获取是否显示周日
  getShowSunday: (state) => state.scheduleSettings.showSunday,
  // 获取是否显示非本周课程
  getShowNonCurrentWeek: (state) => state.scheduleSettings.showNonCurrentWeek
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
