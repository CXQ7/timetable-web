<template>
  <div class="register-container">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="rules"
      class="registerForm"
    >
      <h3 class="registerTitle">Register</h3>

      <!-- 用户名输入框 -->
      <el-form-item prop="username">
        <el-input
          v-model="registerForm.username"
          auto-complete="off"
          placeholder="请输入用户名"
          type="text"
        >
        </el-input>
      </el-form-item>

      <!-- 邮件输入框 -->
      <el-form-item prop="email">
        <el-input
          v-model="registerForm.email"
          auto-complete="off"
          placeholder="请输入邮箱"
          type="email"
        >
        </el-input>
      </el-form-item>

      <!-- 密码输入框 -->
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          auto-complete="false"
          placeholder="请输入密码"
          type="password"
        >
        </el-input>
      </el-form-item>

      <!-- 确认密码输入框 -->
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          auto-complete="false"
          placeholder="再次输入密码"
          type="password"
        >
        </el-input>
      </el-form-item>

      <!-- 注册按钮 -->
      <el-button
        style="width: 100%"
        type="primary"
        @click="submitRegister"
        :loading="registerLoading"
      >
        立即注册
      </el-button>

      <!-- 跳转登录 -->
      <div class="login-link">
        已有账号？
        <el-link type="primary" @click="goToLogin"> 立即登录 </el-link>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
    // 邮箱验证规则
    const validateEmail = (rule, value, callback) => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (!emailPattern.test(value)) {
        callback(new Error('请输入有效的邮箱地址'))
      } else {
        callback()
      }
    }

    // 密码验证规则
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位'))
      } else {
        if (this.registerForm.confirmPassword !== '') {
          this.$refs.registerForm.validateField('confirmPassword')
        }
        callback()
      }
    }

    // 确认密码验证规则
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      registerLoading: false, // 注册按钮加载状态

      registerForm: {
        username: '',
        email: '',
        password: '',
        avatar_url: require('@/assets/default-avatar.jpg')
      },

      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 16,
            message: '长度在 3 到 16 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        confirmPassword: [
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 提交注册
    submitRegister () {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.registerLoading = true
          const { confirmPassword, ...registerData } = this.registerForm

          this.$store
            .dispatch('SaveRegister', registerData)
            .then(() => {
              this.$message.success('注册成功')
              this.$router.push('/login')
            })
            .catch((err) => {
              this.$message.error(err.message || '注册失败')
            })
            .finally(() => {
              this.registerLoading = false
            })
        }
      })
    },

    // 跳转到登录页
    goToLogin () {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
/* 基础样式 - 移动端优先 */
.register-container {
  min-height: 100vh;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("~@/assets/jvav-bg.jpg") no-repeat center center;
  position: relative;
  background-size: cover;
  padding: 20px;
  box-sizing: border-box;
}

.register-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 0;
}

.registerForm {
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

.registerForm:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.registerTitle {
  margin: 0 auto 30px auto;
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.registerTitle::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #764ba2, #667eea);
  border-radius: 2px;
}

.login-link {
  text-align: center;
  margin-top: 25px;
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
  border-color: #764ba2;
  box-shadow: 0 0 0 3px rgba(118, 75, 162, 0.1);
  background: rgba(255, 255, 255, 1);
}

.el-button {
  border-radius: 10px;
  font-weight: 600;
  font-size: 16px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(118, 75, 162, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.el-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.el-button:hover::before {
  left: 100%;
}

.el-button:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 6px 20px rgba(118, 75, 162, 0.4);
  transform: translateY(-2px);
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
  .registerForm {
    padding: 35px 40px;
    max-width: 450px;
  }

  .registerTitle {
    font-size: 2.25rem;
    margin-bottom: 40px;
  }
}

/* 桌面设备适配 */
@media (min-width: 992px) {
  .registerForm {
    max-width: 500px;
    padding: 40px 50px;
  }
  .registerTitle {
    font-size: 2.5rem;
  }
}

/* 主题适配 */
.theme-dark .register-container {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.theme-dark .registerForm {
  background: rgba(45, 45, 45, 0.95);
  color: #ffffff;
}

.theme-dark .registerTitle {
  background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
  -webkit-text-fill-color: transparent;
}

.theme-dark .el-input__inner {
  background: rgba(45, 45, 45, 0.8);
  border-color: #404040;
  color: #ffffff;
}

.theme-dark .el-input__inner:focus {
  background: rgba(45, 45, 45, 1);
  border-color: #764ba2;
}

.theme-macaron .register-container {
  background: linear-gradient(135deg, #ffb6b9 0%, #8b4789 100%);
}

.theme-fresh-green .register-container {
  background: linear-gradient(135deg, #28c76f 0%, #1e7e34 100%);
}

.theme-retro-yellow .register-container {
  background: linear-gradient(135deg, #c29f42 0%, #8b4513 100%);
}
</style>
