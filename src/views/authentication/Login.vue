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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="%23ffffff" opacity="0.05"/><circle cx="10" cy="60" r="0.5" fill="%23ffffff" opacity="0.05"/><circle cx="90" cy="40" r="0.5" fill="%23ffffff" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  z-index: 0;
}

.loginForm {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 400px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.loginForm:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.loginForm::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #409EFF, #5dade2, #3498db, #2980b9, #1f618d);
  border-radius: 16px 16px 0 0;
}

.loginTitle {
  margin: 0 auto 30px auto;
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.loginTitle::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #409EFF, #3498db);
  border-radius: 2px;
}

.action-area {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 15px;
}

.register-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.Remember {
  margin-right: auto;
}

.register-text {
  font-size: 0.9rem;
  color: #606266;
  font-weight: 500;
}

.el-form-item {
  margin-bottom: 25px;
}

.el-input__inner {
  border-radius: 10px;
  border: 2px solid #e9ecef;
  padding: 12px 16px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.el-input__inner:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: rgba(255, 255, 255, 1);
}

.el-button {
  border-radius: 10px;
  font-weight: 600;
  font-size: 16px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.el-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.el-button:hover::before {
  left: 100%;
}

.el-button:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
}

.el-checkbox__input.is-checked .el-checkbox__inner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.el-link {
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.el-link:hover {
  transform: translateY(-1px);
}

/* 平板及以上设备适配 */
@media (min-width: 768px) {
  .loginForm {
    padding: 35px 40px;
    max-width: 450px;
  }

  .loginTitle {
    font-size: 2.25rem;
    margin-bottom: 40px;
  }
}

/* 桌面设备适配 */
@media (min-width: 992px) {
  .loginForm {
    max-width: 500px;
    padding: 40px 50px;
  }
  .loginTitle {
    font-size: 2.5rem;
  }
}

/* 主题适配 */
.theme-dark .login-container {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.theme-dark .loginForm {
  background: rgba(45, 45, 45, 0.95);
  color: #ffffff;
}

.theme-dark .loginTitle {
  background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.theme-dark .el-input__inner {
  background: rgba(45, 45, 45, 0.8);
  border-color: #404040;
  color: #ffffff;
}

.theme-dark .el-input__inner:focus {
  background: rgba(45, 45, 45, 1);
  border-color: #667eea;
}

.theme-macaron .login-container {
  background: linear-gradient(135deg, #8b4789 0%, #ffb6b9 100%);
}

.theme-fresh-green .login-container {
  background: linear-gradient(135deg, #1e7e34 0%, #28c76f 100%);
}

.theme-retro-yellow .login-container {
  background: linear-gradient(135deg, #8b4513 0%, #c29f42 100%);
}
</style>
