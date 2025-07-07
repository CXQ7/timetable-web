import * as Api from '@/api/authentication'
import { saveCalendarSettings } from '@/api/settings'
import defaultSettings from '@/store/settings'

const authentication = {
  state: {
    userInfo: {},
    token: null
  },
  mutations: {
    SET_USER_INFO (state, userInfo) {
      state.userInfo = userInfo
    },
    SET_TOKEN (state, token) {
      state.token = token
    }
  },
  actions: {
    Login ({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        Api.getUserByUsername(username)
          .then((res) => {
            if (res.data && res.data.password === password) {
              commit('SET_USER_INFO', res.data)
              commit('SET_TOKEN', '模拟token值')
              resolve(res.data)
            } else {
              reject(new Error('用户名或密码错误'))
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    Logout ({ commit }) {
      return new Promise((resolve) => {
        commit('SET_USER_INFO', null)
        commit('SET_TOKEN', null)
        resolve()
      })
    },
    GetUserByUsername ({ commit }, username) {
      return new Promise((resolve, reject) => {
        Api.getUserByUsername(username)
          .then((res) => {
            commit('SET_USER_INFO', res.data)
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    SaveRegister ({ commit }, data) {
      return new Promise((resolve, reject) => {
        Api.saveRegister(data)
          .then(async (res) => {
            commit('SET_USER_INFO', res.data.userInfo)
            commit('SET_TOKEN', res.data.token)
            // 注册成功后插入课表设置
            try {
              await saveCalendarSettings(
                defaultSettings.state.scheduleSettings
              )
            } catch (e) {
              // 可以选择忽略或处理错误
            }
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    UpdateUserInfo ({ commit }, data) {
      return new Promise((resolve, reject) => {
        Api.updateUserInfo(data)
          .then((res) => {
            commit('SET_USER_INFO', res.data)
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
}

export default authentication
