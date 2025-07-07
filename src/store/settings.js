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
      // 从localStorage获取设置，如果没有则使用默认值
      const savedSettings = localStorage.getItem('scheduleSettings')
      const savedClassTimes = localStorage.getItem('classTimes')

      if (savedSettings) {
        commit('SET_SCHEDULE_SETTINGS', JSON.parse(savedSettings))
      }

      if (savedClassTimes) {
        commit('SET_CLASS_TIMES', JSON.parse(savedClassTimes))
      }

      return { success: true }
    } catch (error) {
      console.error('获取设置失败:', error)
      return { success: false, message: error.message }
    }
  },

  // 保存课表设置
  async SaveScheduleSettings ({ commit, state }, settings) {
    try {
      commit('SET_SCHEDULE_SETTINGS', settings)
      // 保存到localStorage
      localStorage.setItem(
        'scheduleSettings',
        JSON.stringify(state.scheduleSettings)
      )
      return { success: true }
    } catch (error) {
      console.error('保存课表设置失败:', error)
      return { success: false, message: error.message }
    }
  },

  // 保存上课时间设置
  async SaveClassTimes ({ commit, state }, classTimes) {
    try {
      commit('SET_CLASS_TIMES', classTimes)
      // 保存到localStorage
      localStorage.setItem('classTimes', JSON.stringify(state.classTimes))
      return { success: true }
    } catch (error) {
      console.error('保存上课时间设置失败:', error)
      return { success: false, message: error.message }
    }
  },

  // 添加上课时间段
  AddClassTime ({ commit, state }, classTime) {
    commit('ADD_CLASS_TIME', classTime)
    localStorage.setItem('classTimes', JSON.stringify(state.classTimes))
  },

  // 删除上课时间段
  RemoveClassTime ({ commit, state }, index) {
    commit('REMOVE_CLASS_TIME', index)
    localStorage.setItem('classTimes', JSON.stringify(state.classTimes))
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
