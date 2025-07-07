import * as Api from '@/api/authentication'
import { saveCalendarSettings } from '@/api/settings'
import defaultSettings from '@/store/settings'

const authentication = {
  state: {
    userInfo: null,
    token: null
  },
  mutations: {
    SET_USER_INFO (state, userInfo) {
      state.userInfo = userInfo
      // 同步保存到localStorage
      if (userInfo) {
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
      } else {
        localStorage.removeItem('userInfo')
      }
    },
    SET_TOKEN (state, token) {
      state.token = token
      // 同步保存到localStorage
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    RESTORE_USER_STATE (state, { userInfo, token }) {
      state.userInfo = userInfo
      state.token = token
    }
  },
  actions: {
    // 初始化用户状态 - 从localStorage恢复
    InitializeUserState ({ commit }) {
      try {
        const savedUserInfo = localStorage.getItem('userInfo')
        const savedToken = localStorage.getItem('token')

        if (savedUserInfo && savedToken) {
          const userInfo = JSON.parse(savedUserInfo)
          commit('RESTORE_USER_STATE', { userInfo, token: savedToken })
          return { success: true, userInfo, token: savedToken }
        }

        return { success: false, message: '没有保存的用户信息' }
      } catch (error) {
        console.error('初始化用户状态失败:', error)
        // 清除可能损坏的数据
        localStorage.removeItem('userInfo')
        localStorage.removeItem('token')
        return { success: false, message: '用户信息已损坏，已清除' }
      }
    },

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
        // 清除所有相关的localStorage数据
        localStorage.removeItem('userInfo')
        localStorage.removeItem('token')
        localStorage.removeItem('rememberMe')
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
            // 处理注册响应，即使没有返回数据也视为成功
            let userInfo, token

            if (res && res.data) {
              // 如果有返回数据，使用返回的数据
              userInfo = res.data.userInfo || res.data
              token = res.data.token || '模拟token值'
            } else {
              // 如果没有返回数据，使用注册时提交的数据创建用户信息
              userInfo = {
                ...data,
                id: Date.now(), // 生成一个简单的ID
                created_at: new Date().toISOString()
              }
              token = '模拟token值'
            }

            commit('SET_USER_INFO', userInfo)
            commit('SET_TOKEN', token)

            // 注册成功后插入课表设置
            try {
              await saveCalendarSettings(
                defaultSettings.state.scheduleSettings
              )
            } catch (e) {
              console.error('保存课表设置失败:', e)
              // 即使课表设置保存失败，也不影响注册成功
            }

            resolve({ userInfo, token })
          })
          .catch((err) => {
            // 简化错误处理，只显示基本的注册失败信息
            console.error('注册失败:', err)
            reject(new Error('注册失败，请重试'))
          })
      })
    },
    UpdateUserInfo ({ commit }, data) {
      return new Promise((resolve, reject) => {
        Api.updateUserInfo(data)
          .then((res) => {
            if (res && res.data) {
              commit('SET_USER_INFO', res.data)
              resolve(res.data)
            } else {
              reject(new Error('更新用户信息失败：服务器未返回数据'))
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  },
  getters: {
    // 安全获取用户信息
    getUserInfo: (state) => state.userInfo,
    // 安全获取token
    getToken: (state) => state.token,
    // 检查是否已登录
    isLoggedIn: (state) => !!(state.userInfo && state.token),
    // 获取用户名
    getUsername: (state) => (state.userInfo ? state.userInfo.username : ''),
    // 获取用户头像
    getUserAvatar: (state) => (state.userInfo ? state.userInfo.avatar_url : '')
  }
}

export default authentication
