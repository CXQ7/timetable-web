<template>
  <el-card shadow="never">
    <div slot="header" class="clearfix">
      <span>系统设置</span>
    </div>

    <div v-loading="loading">
      <el-row :gutter="20">
        <!-- 用户设置 -->
        <el-col :xs="24" :sm="24" :md="12">
          <el-card shadow="never" class="settings-section">
            <div slot="header" class="clearfix">
              <span>用户设置</span>
            </div>

            <el-form
              :label-position="isMobile ? 'top' : 'right'"
              :label-width="isMobile ? 'auto' : '120px'"
            >
              <el-form-item label="头像">
                <el-upload
                  class="avatar-uploader"
                  action=""
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-change="handleAvatarChange"
                >
                  <img
                    v-if="userForm.avatar"
                    :src="userForm.avatar"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>

              <el-form-item label="用户名">
                <el-input
                  v-model="userForm.username"
                  :size="isMobile ? 'small' : 'medium'"
                ></el-input>
              </el-form-item>

              <el-form-item label="邮箱">
                <el-input
                  v-model="userForm.email"
                  :size="isMobile ? 'small' : 'medium'"
                ></el-input>
              </el-form-item>

              <el-form-item label="手机号">
                <el-input
                  v-model="userForm.phone"
                  :size="isMobile ? 'small' : 'medium'"
                ></el-input>
              </el-form-item>

              <el-divider></el-divider>

              <el-form-item>
                <el-button
                  type="primary"
                  :size="isMobile ? 'small' : 'medium'"
                  @click="saveUserSettings"
                >
                  保存用户设置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <!-- 课表设置 -->
        <el-col :xs="24" :sm="24" :md="12">
          <el-card shadow="never" class="settings-section">
            <div slot="header" class="clearfix">
              <span>课表设置</span>
            </div>

            <el-form
              :label-position="isMobile ? 'top' : 'right'"
              :label-width="isMobile ? 'auto' : '180px'"
            >
              <el-form-item label="课表名称">
                <el-input
                  v-model="scheduleForm.name"
                  :size="isMobile ? 'small' : 'medium'"
                ></el-input>
              </el-form-item>

              <el-divider>课表数据</el-divider>

              <el-form-item label="上课时间配置">
                <el-button
                  type="primary"
                  :size="isMobile ? 'small' : 'mini'"
                  @click="showClassTimeSettings"
                >
                  编辑上课时间
                </el-button>
              </el-form-item>

              <el-form-item label="第一周的第一天">
                <el-date-picker
                  v-model="scheduleForm.firstWeekDay"
                  type="date"
                  :size="isMobile ? 'small' : 'medium'"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="一天课程节数">
                <el-input-number
                  v-model="scheduleForm.classesPerDay"
                  :min="1"
                  :max="20"
                  :size="isMobile ? 'small' : 'medium'"
                ></el-input-number>
              </el-form-item>

              <el-form-item label="学期数">
                <el-input-number
                  v-model="scheduleForm.semesterCount"
                  :min="1"
                  :max="10"
                  :size="isMobile ? 'small' : 'medium'"
                ></el-input-number>
              </el-form-item>

              <el-divider>课表外观</el-divider>

              <el-form-item label="显示周六">
                <el-switch v-model="scheduleForm.showSaturday"></el-switch>
              </el-form-item>

              <el-form-item label="显示周日">
                <el-switch v-model="scheduleForm.showSunday"></el-switch>
              </el-form-item>

              <el-form-item label="显示非本周课程">
                <el-switch
                  v-model="scheduleForm.showNonCurrentWeek"
                ></el-switch>
              </el-form-item>

              <el-form-item label="显示老师">
                <el-switch v-model="scheduleForm.showTeacher"></el-switch>
              </el-form-item>

              <el-form-item label="显示教室">
                <el-switch v-model="scheduleForm.showClassroom"></el-switch>
              </el-form-item>

              <el-divider></el-divider>

              <el-form-item>
                <el-button
                  type="primary"
                  :size="isMobile ? 'small' : 'medium'"
                  @click="saveScheduleSettings"
                >
                  保存课表设置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 上课时间设置弹窗 -->
    <class-time-dialog
      :visible.sync="classTimeDialogVisible"
      :class-times="classTimes"
      :is-mobile="isMobile"
      @save="saveClassTimes"
      @add="addClassTime"
      @remove="removeClassTime"
    />
  </el-card>
</template>

<script>
import { mapState } from 'vuex'
import ClassTimeDialog from './EditClassTime.vue'

export default {
  name: 'SystemSettings',
  components: {
    ClassTimeDialog
  },
  data () {
    return {
      loading: false, // 加载状态
      userForm: {
        avatar: '', // 用户头像
        username: '', // 用户名
        email: '', // 邮箱
        phone: '' // 手机号
      },
      scheduleForm: {
        name: '',
        firstWeekDay: '',
        classesPerDay: 10,
        showSaturday: true,
        showSunday: false,
        showNonCurrentWeek: true,
        showTeacher: true,
        showClassroom: true
      },
      classTimeDialogVisible: false,
      classTimes: [],
      windowWidth: window.innerWidth
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.authentication.userInfo
    }),
    isMobile () {
      return this.windowWidth < 768
    }
  },
  methods: {
    // 保存用户设置
    saveUserSettings () {
      this.loading = true
      this.$store
        .dispatch('UpdateUserInfo', this.userForm)
        .then(() => {
          this.$message.success('用户设置保存成功')
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
          localStorage.setItem('token', this.userInfo.token)
        })
        .catch((err) => {
          this.$message.error(err.message || '保存失败')
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 保存课表设置
    saveScheduleSettings () {
      this.loading = true
      // 模拟API调用
      setTimeout(() => {
        this.loading = false
        this.$message.success('课表设置保存成功')
      }, 500)
    },

    // 处理头像上传
    handleAvatarChange (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.userForm.avatar = e.target.result
      }
      reader.readAsDataURL(file.raw)
    },

    // 显示上课时间设置弹窗
    showClassTimeSettings () {
      // 加载默认上课时间数据
      this.classTimes = [
        { section: 1, startTime: '08:00', endTime: '08:45' },
        { section: 2, startTime: '08:55', endTime: '09:40' }
      ]
      this.classTimeDialogVisible = true
    },

    // 添加上课时间段
    addClassTime () {
      const newSection = this.classTimes.length + 1
      this.classTimes.push({
        section: newSection,
        startTime: '',
        endTime: ''
      })
    },

    // 删除上课时间段
    removeClassTime (index) {
      this.classTimes.splice(index, 1)
      // 重新编号
      this.classTimes.forEach((item, i) => {
        item.section = i + 1
      })
    },

    // 保存上课时间设置
    saveClassTimes () {
      this.classTimeDialogVisible = false
      this.$message.success('上课时间设置保存成功')
    },

    // 处理窗口大小变化
    handleResize () {
      this.windowWidth = window.innerWidth
    }
  },
  mounted () {
    this.loading = true
    if (!this.userInfo) {
      this.$message.warning('请先登录')
      this.$router.replace('/login')
      return
    }
    this.userForm = { ...this.userForm, ...this.userInfo }
    this.loading = false
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy () {
    // 移除窗口大小变化监听
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style scoped>
/* 基础样式 */
.settings-section {
  margin-bottom: 20px;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.el-divider {
  margin: 20px 0;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  html {
    font-size: 14px;
  }

  .el-form-item__label {
    width: 100px !important;
  }

  .el-form-item__content {
    margin-left: 100px !important;
  }

  .settings-section {
    margin-bottom: 15px;
  }

  .avatar-uploader {
    width: 80px;
    height: 80px;
  }

  .avatar-uploader-icon {
    width: 80px;
    height: 80px;
    line-height: 80px;
    font-size: 24px;
  }

  .avatar {
    width: 80px;
    height: 80px;
  }

  .el-divider {
    margin: 15px 0;
  }
}

@media screen and (max-width: 480px) {
  html {
    font-size: 12px;
  }

  .el-form-item__label {
    width: 90px !important;
  }

  .el-form-item__content {
    margin-left: 90px !important;
  }

  .avatar-uploader {
    width: 70px;
    height: 70px;
  }

  .avatar-uploader-icon {
    width: 70px;
    height: 70px;
    line-height: 70px;
    font-size: 20px;
  }

  .avatar {
    width: 70px;
    height: 70px;
  }
}
</style>
