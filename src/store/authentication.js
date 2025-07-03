import * as Api from '@/api/authentication'

const authentication = {
  state: {
    userInfo: null,
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
        if (username === 'admin' && password === '123456') {
          // 模拟登录成功
          const userInfo = {
            username: 'admin',
            name: '管理员',
            roles: ['admin'],
            email: 'example@qq.com',
            phone: '12345678901'
          }
          commit('SET_USER_INFO', userInfo)
          commit('SET_TOKEN', '模拟token值')
          resolve(userInfo)
        }
        Api.getUserByUsername(username)
          .then(res => {
            if (res.data && res.data.password === password) {
              commit('SET_USER_INFO', res.data)
              commit('SET_TOKEN', '模拟token值')
              resolve(res.data)
            } else {
              reject(new Error('用户名或密码错误'))
            }
          })
          .catch(err => {
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
          .then(res => {
            commit('SET_USER_INFO', res.data)
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    SaveRegister ({ commit }, data) {
      return new Promise((resolve, reject) => {
        Api.saveRegister(data)
          .then(res => {
            commit('SET_USER_INFO', res.data.userInfo)
            commit('SET_TOKEN', res.data.token)
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}

export default authentication
