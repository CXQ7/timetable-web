// 用户信息访问的安全混入
export default {
  computed: {
    // 安全获取用户信息
    safeUserInfo () {
      return this.$store.getters.getUserInfo || {}
    },
    // 安全获取token
    safeToken () {
      return this.$store.getters.getToken || ''
    },
    // 检查是否已登录
    isUserLoggedIn () {
      return this.$store.getters.isLoggedIn
    },
    // 安全获取用户名
    safeUsername () {
      return this.$store.getters.getUsername || ''
    },
    // 安全获取用户头像
    safeUserAvatar () {
      return this.$store.getters.getUserAvatar || ''
    }
  },
  methods: {
    // 安全地执行需要登录的操作
    requireLogin (callback) {
      if (this.isUserLoggedIn) {
        return callback()
      } else {
        this.$message.warning('请先登录')
        this.$router.push('/login')
        return Promise.reject(new Error('用户未登录'))
      }
    },

    // 检查并初始化用户状态
    async ensureUserState () {
      if (!this.isUserLoggedIn) {
        try {
          const result = await this.$store.dispatch('InitializeUserState')
          if (!result.success) {
            throw new Error('用户状态初始化失败')
          }
        } catch (error) {
          console.error('用户状态检查失败:', error)
          this.$message.warning('请重新登录')
          this.$router.push('/login')
          throw error
        }
      }
    }
  }
}
