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
      console.log('SET_USER_INFO mutation 接收到数据:', userInfo)

      state.userInfo = userInfo
      // 同步保存到localStorage
      if (userInfo) {
        const userInfoStr = JSON.stringify(userInfo)
        localStorage.setItem('userInfo', userInfoStr)
        console.log(
          '用户信息已保存到localStorage，包含头像数据:',
          !!userInfo.avatar_url
        )
        if (
          userInfo.avatar_url &&
          userInfo.avatar_url.startsWith('data:image/')
        ) {
          console.log('localStorage中保存的是base64头像数据')
        }
      } else {
        localStorage.removeItem('userInfo')
        console.log('用户信息已从localStorage移除')
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
        console.log('Store GetUserByUsername 开始查询:', username)

        Api.getUserByUsername(username)
          .then((res) => {
            console.log('Store GetUserByUsername API响应:', res)
            console.log('Store GetUserByUsername 响应数据:', res.data)

            // 处理字段名转换：后端返回avatarUrl，前端使用avatar_url
            const userData = { ...res.data }
            if (userData.avatarUrl && !userData.avatar_url) {
              userData.avatar_url = userData.avatarUrl
              delete userData.avatarUrl
              console.log(
                'Store GetUserByUsername 字段名转换：avatarUrl -> avatar_url'
              )
            }

            if (userData.avatar_url) {
              console.log('Store GetUserByUsername 头像数据:')
              console.log('  - 数据类型:', typeof userData.avatar_url)
              console.log('  - 数据长度:', userData.avatar_url.length)
              console.log(
                '  - 是否为base64:',
                userData.avatar_url.startsWith('data:image/')
              )
              if (userData.avatar_url.startsWith('data:image/')) {
                console.log(
                  '  - base64前缀:',
                  userData.avatar_url.substring(0, 50) + '...'
                )
              }
            } else {
              console.log('Store GetUserByUsername 响应中无头像数据')
            }

            commit('SET_USER_INFO', userData)
            resolve(userData)
          })
          .catch((err) => {
            console.error('Store GetUserByUsername 查询失败:', err)
            reject(err)
          })
      })
    },
    SaveRegister ({ commit }, data) {
      return new Promise((resolve, reject) => {
        // 转换字段名以匹配后端期望的格式
        const registerData = { ...data }
        if (registerData.avatar_url) {
          registerData.avatarUrl = registerData.avatar_url
          delete registerData.avatar_url
        }

        console.log('发送给后端的注册数据:', registerData)

        Api.saveRegister(registerData)
          .then(async (res) => {
            // 处理注册响应，即使没有返回数据也视为成功
            let userInfo, token

            if (res && res.data) {
              // 如果有返回数据，使用返回的数据
              userInfo = res.data.userInfo || res.data
              token = res.data.token || '模拟token值'

              // 如果后端返回的数据使用驼峰命名，需要转换为前端使用的下划线命名
              if (userInfo.avatarUrl && !userInfo.avatar_url) {
                userInfo.avatar_url = userInfo.avatarUrl
                delete userInfo.avatarUrl
              }
            } else {
              // 如果没有返回数据，使用注册时提交的数据创建用户信息
              // 注意：这里使用原始的data（包含avatar_url），而不是转换后的registerData
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
    UpdateUserInfo ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        console.log('Store UpdateUserInfo 接收到的数据:', data)

        Api.updateUserInfo(data)
          .then((res) => {
            console.log('后端响应:', res)

            // 检查响应是否成功
            if (
              res &&
              (res.data || res.status === 200 || res.statusText === 'OK')
            ) {
              // 如果后端返回了用户数据，使用返回的数据
              if (
                res.data &&
                typeof res.data === 'object' &&
                res.data.username
              ) {
                // 如果后端返回的数据使用驼峰命名，需要转换
                const normalizedData = { ...res.data }
                if (normalizedData.avatarUrl && !normalizedData.avatar_url) {
                  normalizedData.avatar_url = normalizedData.avatarUrl
                  delete normalizedData.avatarUrl
                }

                // 检查后端是否正确返回了我们发送的avatarUrl
                // 如果发送的是base64数据，但后端返回的不是，则使用发送的数据
                if (
                  data.avatarUrl &&
                  data.avatarUrl.startsWith('data:image/')
                ) {
                  if (
                    !normalizedData.avatar_url ||
                    !normalizedData.avatar_url.startsWith('data:image/')
                  ) {
                    console.warn(
                      '后端没有正确保存base64头像数据，使用前端数据'
                    )
                    normalizedData.avatar_url = data.avatarUrl
                  }
                }

                commit('SET_USER_INFO', normalizedData)
                resolve(normalizedData)
              } else {
                // 如果后端只返回成功状态，使用前端传入的数据更新store
                // 需要将驼峰命名转换为下划线命名以保持前端一致性
                const updatedUserInfo = { ...state.userInfo }

                // 处理字段名转换
                if (data.avatarUrl !== undefined) {
                  updatedUserInfo.avatar_url = data.avatarUrl
                }
                if (data.username !== undefined) {
                  updatedUserInfo.username = data.username
                }
                if (data.email !== undefined) {
                  updatedUserInfo.email = data.email
                }
                if (data.phone !== undefined) {
                  updatedUserInfo.phone = data.phone
                }
                if (data.password !== undefined) {
                  updatedUserInfo.password = data.password
                }

                console.log('合并后的用户信息:', updatedUserInfo)
                commit('SET_USER_INFO', updatedUserInfo)
                resolve(updatedUserInfo)
              }
            } else {
              reject(new Error('更新用户信息失败：服务器响应异常'))
            }
          })
          .catch((err) => {
            console.error('更新用户信息失败:', err)
            reject(new Error(err.message || '更新用户信息失败'))
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
