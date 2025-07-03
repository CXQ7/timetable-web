<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="rules"
      class="loginForm">

      <h3 class="loginTitle">Login</h3>

      <!--用户名输入框-->
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          auto-complete="false"
          placeholder="请输入用户名"
          type="text">
        </el-input>
      </el-form-item>

      <!--密码输入框-->
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          auto-complete="false"
          placeholder="请输入密码"
          type="password"
          show-password>
        </el-input>
      </el-form-item>

      <!--功能区-->
      <div class="action-area">
        <el-checkbox
          v-model="checked"
          class="Remember">
          记住我
        </el-checkbox>

        <!-- 跳转注册 -->
        <div class="register-container">
          <span class="register-text">没有账号？</span>
          <el-link
            type="primary"
            @click="goToRegister">
            立即注册
          </el-link>
        </div>
      </div>

      <!-- 登录按钮 -->
      <el-button
        style="width: 100%"
        type="primary"
        @click="submitLogin"
        :loading="loginLoading">
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginLoading: false, // 注册按钮加载状态
      captchaUrl: '',
      loginForm: {
        username: 'admin',
        password: '123456',
        code: ''
      },
      checked: true,
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitLogin () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loginLoading = true
          this.$store.dispatch('Login', this.loginForm)
            .then(() => {
              if (this.checked) {
                localStorage.setItem('rememberMe', 'true')
              }
              this.$router.push('/main')
            })
            .catch(err => {
              this.$message.error(err.message || '登录失败')
            })
            .finally(() => {
              this.loginLoading = false
            })
        } else {
          this.$message.error('请输入所有字段')
        }
      })
    },
    goToRegister () {
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped>
/* 基础样式 - 移动端优先 */
.login-container {
  min-height: 100vh;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('~@/assets/login-bg.jpg') no-repeat center center;
  position: relative;
  background-size: cover;  padding: 20px;
  box-sizing: border-box;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 0;
}

.loginForm {
  border-radius: 12px;
  background-clip: padding-box;
  width: 100%;
  max-width: 350px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.1);
}

.loginTitle {
  margin: 0 auto 30px auto;
  text-align: center;
  font-size: 1.5rem;
}

.action-area {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.register-container {
  display: flex;
  align-items: center;
}

.Remember {
  margin-right: auto;
}

.register-text {
  font-size: 0.875rem;
  color: #606266;
}

.el-form-item {
  margin-bottom: 20px;
}

/* 平板及以上设备适配 */
@media (min-width: 768px) {
  .loginForm {
    padding: 25px 35px;
  }

  .loginTitle {
    font-size: 1.75rem;
    margin-bottom: 40px;
  }
}

/* 桌面设备适配 */
@media (min-width: 992px) {
  .loginForm {
    position: relative;
    z-index: 1;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
  }
}

/* 小屏幕手机特殊适配 */
@media (max-width: 360px) {
  .loginForm {
    padding: 15px;
  }

  .action-area {
    flex-direction: column;
    align-items: flex-start;
  }

  .register-container {
    margin-top: 10px;
  }
}
</style>
