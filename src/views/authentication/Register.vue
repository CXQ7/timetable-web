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

      <!-- 已有账号登录 -->
      <div class="login-link">
        已有账号？<el-link type="primary" @click="goToLogin">立即登录</el-link>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
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
        password: '',
        confirmPassword: ''
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

          // 模拟注册请求
          setTimeout(() => {
            this.registerLoading = false
            this.$message.success('注册成功')
            this.$router.push('/login') // 注册成功后跳转到登录页
          }, 1500)
        } else {
          return false
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
  background: url("~@/assets/register-bg.jpg") no-repeat center center;
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
  background: rgba(0, 0, 0, 0.3);
  z-index: 0;
}

.registerForm {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 100px auto;
  width: 400px;
  padding: 25px 35px 25px 35px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.1);
}

.registerTitle {
  margin: 0 auto 30px auto;
  text-align: center;
  font-size: 24px;
  color: #303133;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #606266;
}
/* 平板及以上设备适配 */
@media (min-width: 768px) {
  .registerForm {
    padding: 25px 35px;
  }

  .registerTitle {
    font-size: 1.75rem;
    margin-bottom: 40px;
  }
}

/* 桌面设备适配 */
@media (min-width: 992px) {
  .registerForm {
    position: relative;
    z-index: 1;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
  }
}

/* 小屏幕手机特殊适配 */
@media (max-width: 360px) {
  .registerForm {
    padding: 15px;
  }

  .register-container {
    margin-top: 10px;
  }
}
</style>
