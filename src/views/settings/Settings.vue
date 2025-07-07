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
                    v-if="userForm.avatar_url"
                    :src="userForm.avatar_url"
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
                  style="margin-right: 10px"
                >
                  保存课表设置
                </el-button>
                <el-button
                  :size="isMobile ? 'small' : 'medium'"
                  @click="refreshSettings"
                >
                  从服务器刷新
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 上课时间设置弹窗 -->
    <el-dialog
      title="上课时间设置"
      :visible.sync="classTimeDialogVisible"
      :width="isMobile ? '95%' : '70%'"
      :lock-scroll="true"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      :destroy-on-close="false"
      :append-to-body="true"
      custom-class="class-time-dialog"
      center
    >
      <el-table
        :data="localClassTimes"
        border
        style="width: 100%"
        :key="'class-times-table'"
      >
        <el-table-column
          prop="section"
          label="节次"
          width="80"
        ></el-table-column>
        <el-table-column label="开始时间">
          <template slot-scope="scope">
            <el-time-picker
              v-model="scope.row.startTime"
              format="HH:mm"
              value-format="HH:mm"
              :size="isMobile ? 'small' : 'medium'"
              placeholder="选择时间"
            >
            </el-time-picker>
          </template>
        </el-table-column>
        <el-table-column label="结束时间">
          <template slot-scope="scope">
            <el-time-picker
              v-model="scope.row.endTime"
              format="HH:mm"
              value-format="HH:mm"
              :size="isMobile ? 'small' : 'medium'"
              placeholder="选择时间"
            >
            </el-time-picker>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              @click="removeClassTime(scope.$index)"
              type="text"
              :size="isMobile ? 'small' : 'medium'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button
          @click="addClassTime"
          type="primary"
          :size="isMobile ? 'small' : 'medium'"
        >
          添加时间段
        </el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="classTimeDialogVisible = false"
          :size="isMobile ? 'small' : 'medium'"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          :size="isMobile ? 'small' : 'medium'"
          @click="saveClassTimes"
        >
          保存
        </el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { mapState } from 'vuex'
import userMixin from '@/mixins/userMixin'

export default {
  name: 'SystemSettings',
  mixins: [userMixin],
  data () {
    return {
      loading: false, // 加载状态
      userForm: {
        avatar_url: '', // 用户头像
        username: '', // 用户名
        email: '', // 邮箱
        phone: '' // 手机号
      },
      scheduleForm: {
        name: '',
        firstWeekDay: '2025-07-07', // 默认设置为有效日期
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
    },
    // 使用computed来管理上课时间数据，避免直接修改
    localClassTimes: {
      get () {
        return this.classTimes
      },
      set (value) {
        this.classTimes = value
      }
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
          // 安全地访问userInfo和token
          const userInfo = this.$store.state.authentication.userInfo
          const token = this.$store.state.authentication.token

          if (userInfo) {
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
          }
          if (token) {
            localStorage.setItem('token', token)
          }
        })
        .catch((err) => {
          this.$message.error(err.message || '保存失败')
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 保存课表设置
    async saveScheduleSettings () {
      this.loading = true
      try {
        // 准备要保存的数据，确保日期格式正确
        const settingsToSave = { ...this.scheduleForm }

        // 处理firstWeekDay，确保格式正确且不为空
        let formattedDate = '2025-07-07' // 默认值

        if (settingsToSave.firstWeekDay) {
          if (settingsToSave.firstWeekDay instanceof Date) {
            // Date对象，直接格式化
            const year = settingsToSave.firstWeekDay.getFullYear()
            const month = String(
              settingsToSave.firstWeekDay.getMonth() + 1
            ).padStart(2, '0')
            const day = String(settingsToSave.firstWeekDay.getDate()).padStart(
              2,
              '0'
            )
            formattedDate = `${year}-${month}-${day}`
          } else if (
            typeof settingsToSave.firstWeekDay === 'string' &&
            settingsToSave.firstWeekDay.trim() !== ''
          ) {
            // 非空字符串，验证格式
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/
            if (dateRegex.test(settingsToSave.firstWeekDay.trim())) {
              // 已经是正确格式
              formattedDate = settingsToSave.firstWeekDay.trim()
            } else {
              // 尝试解析并重新格式化
              const date = new Date(settingsToSave.firstWeekDay.trim())
              if (!isNaN(date.getTime())) {
                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                formattedDate = `${year}-${month}-${day}`
              }
              // 如果解析失败，保持默认值
            }
          }
          // 如果是其他类型或空字符串，使用默认值
        }

        // 确保设置有效的日期
        settingsToSave.firstWeekDay = formattedDate

        console.log(
          '发送到后端的完整数据:',
          JSON.stringify(settingsToSave, null, 2)
        )
        console.log(
          '发送到后端的firstWeekDay:',
          settingsToSave.firstWeekDay,
          '类型:',
          typeof settingsToSave.firstWeekDay
        )

        // 使用store的action来保存设置
        const result = await this.$store.dispatch(
          'settings/SaveScheduleSettings',
          settingsToSave
        )
        if (result && result.success) {
          this.$message.success('课表设置保存成功')
        } else {
          this.$message.error(result.message || '课表设置保存失败')
        }
      } catch (err) {
        console.error('保存课表设置失败:', err)
        this.$message.error(err.message || '课表设置保存失败')
      } finally {
        this.loading = false
      }
    },

    // 从服务器刷新设置
    async refreshSettings () {
      this.loading = true
      try {
        const result = await this.$store.dispatch(
          'settings/RefreshSettingsFromServer'
        )
        if (result && result.success) {
          // 更新表单数据
          const settings = this.$store.getters['settings/getScheduleSettings']
          this.scheduleForm = { ...this.scheduleForm, ...settings }

          // 如果firstWeekDay是字符串，转换为Date对象供日期选择器使用
          if (
            this.scheduleForm.firstWeekDay &&
            typeof this.scheduleForm.firstWeekDay === 'string'
          ) {
            const dateStr = this.scheduleForm.firstWeekDay.trim()
            if (dateStr !== '') {
              const date = new Date(dateStr)
              if (!isNaN(date.getTime())) {
                this.scheduleForm.firstWeekDay = date
              } else {
                // 如果解析失败，使用默认日期
                this.scheduleForm.firstWeekDay = new Date('2025-07-07')
              }
            } else {
              // 如果是空字符串，使用默认日期
              this.scheduleForm.firstWeekDay = new Date('2025-07-07')
            }
          } else if (!this.scheduleForm.firstWeekDay) {
            // 如果没有firstWeekDay，使用默认日期
            this.scheduleForm.firstWeekDay = new Date('2025-07-07')
          }

          const classTimes = this.$store.getters['settings/getClassTimes']
          this.classTimes = [...classTimes]

          this.$message.success('设置已从服务器刷新')
        } else {
          this.$message.error(result.message || '从服务器刷新设置失败')
        }
      } catch (err) {
        this.$message.error(err.message || '从服务器刷新设置失败')
      } finally {
        this.loading = false
      }
    },

    // 处理头像上传
    handleAvatarChange (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.userForm.avatar_url = e.target.result
      }
      reader.readAsDataURL(file.raw)
    },

    // 显示上课时间设置弹窗
    showClassTimeSettings () {
      // 从store获取上课时间数据
      const classTimes = this.$store.getters['settings/getClassTimes']
      // 使用Vue.set确保响应式更新
      this.$set(this, 'classTimes', JSON.parse(JSON.stringify(classTimes)))
      this.classTimeDialogVisible = true
    },

    // 添加上课时间段
    addClassTime () {
      const newSection = this.classTimes.length + 1
      const newTime = {
        section: newSection,
        startTime: '',
        endTime: ''
      }
      this.classTimes.push(newTime)
    },

    // 删除上课时间段
    removeClassTime (index) {
      this.$delete(this.classTimes, index)
      // 重新编号
      this.classTimes.forEach((item, i) => {
        this.$set(item, 'section', i + 1)
      })
    },

    // 保存上课时间设置
    saveClassTimes () {
      this.$store
        .dispatch('settings/SaveClassTimes', this.classTimes)
        .then((res) => {
          if (res && res.success) {
            this.$message.success('上课时间设置保存成功')
            this.classTimeDialogVisible = false
          } else {
            this.$message.error(res.message || '保存失败')
          }
        })
        .catch((err) => {
          this.$message.error(err.message || '保存失败')
        })
    },

    // 处理窗口大小变化
    handleResize () {
      this.windowWidth = window.innerWidth
    }
  },
  async mounted () {
    this.loading = true

    try {
      // 确保用户状态已正确初始化
      await this.ensureUserState()

      // 使用安全的用户信息访问
      const userInfo = this.safeUserInfo
      if (!userInfo.username) {
        throw new Error('用户信息不完整')
      }

      // 安全地复制用户信息
      this.userForm = {
        ...this.userForm,
        avatar_url: userInfo.avatar_url || '',
        username: userInfo.username || '',
        email: userInfo.email || '',
        phone: userInfo.phone || ''
      }

      // 获取课表设置
      const result = await this.$store.dispatch('settings/GetSettings')

      // 从store获取设置并赋值给表单
      const settings = this.$store.getters['settings/getScheduleSettings']
      this.scheduleForm = { ...this.scheduleForm, ...settings }

      // 如果firstWeekDay是字符串，转换为Date对象供日期选择器使用
      if (
        this.scheduleForm.firstWeekDay &&
        typeof this.scheduleForm.firstWeekDay === 'string'
      ) {
        const dateStr = this.scheduleForm.firstWeekDay.trim()
        if (dateStr !== '') {
          const date = new Date(dateStr)
          if (!isNaN(date.getTime())) {
            this.scheduleForm.firstWeekDay = date
          } else {
            // 如果解析失败，使用默认日期
            this.scheduleForm.firstWeekDay = new Date('2025-07-07')
          }
        } else {
          // 如果是空字符串，使用默认日期
          this.scheduleForm.firstWeekDay = new Date('2025-07-07')
        }
      } else if (!this.scheduleForm.firstWeekDay) {
        // 如果没有firstWeekDay，使用默认日期
        this.scheduleForm.firstWeekDay = new Date('2025-07-07')
      }

      // 获取上课时间数据
      const classTimes = this.$store.getters['settings/getClassTimes']
      this.classTimes = [...classTimes]

      // 根据数据源显示不同的提示
      if (result && result.source === 'server') {
        console.log('设置已从服务器同步')
      } else if (result && result.source === 'localStorage') {
        console.log('使用本地缓存设置')
      }
    } catch (err) {
      console.error('初始化失败:', err)
      this.$message.warning('初始化失败，请重新登录')
      this.$router.replace('/login')
      return
    } finally {
      this.loading = false
    }

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

/* 上课时间设置弹窗样式 */
.class-time-dialog {
  transition: none !important;
}

.class-time-dialog .el-dialog__body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.class-time-dialog .el-table {
  margin-bottom: 0;
}

.class-time-dialog .el-time-picker {
  width: 100%;
}
</style>
