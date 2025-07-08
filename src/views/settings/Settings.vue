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
                <div class="avatar-upload-container">
                  <el-upload
                    class="avatar-uploader"
                    action=""
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="handleAvatarChange"
                  >
                    <img :src="currentAvatarUrl" class="avatar" alt="用户头像" />
                    <div class="avatar-upload-overlay">
                      <i class="el-icon-camera"></i>
                      <div>点击上传</div>
                    </div>
                  </el-upload>
                  <div class="avatar-upload-tips">
                    <p v-if="avatarPreview" class="preview-tip">预览模式，保存后生效</p>
                    <p class="format-tip">支持 JPG、PNG 格式，文件大小不超过 2MB</p>
                  </div>
                </div>
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
      windowWidth: window.innerWidth,
      avatarPreview: null // 用于存储头像预览的base64数据
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
    },
    // 当前显示的头像URL，优先显示预览图片，其次是用户头像，最后是默认头像
    currentAvatarUrl () {
      console.log('=== currentAvatarUrl 计算属性执行 ===')

      // 如果有预览图片，优先显示预览
      if (this.avatarPreview) {
        console.log('使用预览头像显示')
        return this.avatarPreview
      }

      // 如果用户有头像URL且不为空，显示用户头像
      if (this.userForm.avatar_url && this.userForm.avatar_url.trim() !== '') {
        const avatarUrl = this.userForm.avatar_url.trim()
        console.log('userForm.avatar_url:', avatarUrl)
        console.log('avatar_url数据类型:', typeof avatarUrl)
        console.log('avatar_url数据长度:', avatarUrl.length)

        // 检查是否是base64数据
        if (avatarUrl.startsWith('data:image/')) {
          // 是base64图片数据，直接使用
          console.log('检测到base64头像数据，直接使用')
          console.log('base64前缀:', avatarUrl.substring(0, 50) + '...')
          return avatarUrl
        }

        // 检查是否是本地文件路径或文件名
        const isLocalFile =
          // Windows绝对路径：C:\Users\... 或 D:\...
          /^[A-Za-z]:\\/.test(avatarUrl) ||
          // Unix/Linux绝对路径：/home/... 或 /Users/...
          avatarUrl.startsWith('/home/') ||
          avatarUrl.startsWith('/Users/') ||
          // Windows相对路径标识符
          avatarUrl.includes('\\Documents\\') ||
          avatarUrl.includes('\\Pictures\\') ||
          // 仅文件名（没有协议、域名或以/开头的路径）
          (!avatarUrl.includes('://') && !avatarUrl.startsWith('/') && !avatarUrl.startsWith('http'))

        if (isLocalFile) {
          // 本地文件路径/文件名无法在浏览器中直接显示，使用默认头像
          console.log('检测到本地文件，使用默认头像显示:', avatarUrl)
          return require('@/assets/default-avatar.jpg')
        }

        // 如果是完整URL（包含协议）或网络路径，直接使用
        console.log('使用网络URL显示头像:', avatarUrl)
        return this.userForm.avatar_url
      }

      // 使用默认头像
      console.log('没有有效的头像数据，使用默认头像')
      console.log('userForm:', this.userForm)
      return require('@/assets/default-avatar.jpg')
    }
  },
  methods: {
    // 保存用户设置
    saveUserSettings () {
      this.loading = true

      // 准备发送给后端的数据，转换字段名以匹配后端期望的格式
      const updateData = {
        username: this.userForm.username,
        email: this.userForm.email,
        phone: this.userForm.phone,
        avatarUrl: this.userForm.avatar_url // 转换字段名：avatar_url -> avatarUrl
      }

      console.log('=== 保存用户设置开始 ===')
      console.log('发送给后端的用户更新数据:', updateData)
      console.log('头像数据详情:')
      if (updateData.avatarUrl) {
        console.log('  - 数据类型:', typeof updateData.avatarUrl)
        console.log('  - 数据长度:', updateData.avatarUrl.length)
        console.log('  - 是否为base64:', updateData.avatarUrl.startsWith('data:image/'))
        if (updateData.avatarUrl.startsWith('data:image/')) {
          console.log('  - base64前缀:', updateData.avatarUrl.substring(0, 50) + '...')
        }
      } else {
        console.log('  - 没有头像数据')
      }

      this.$store
        .dispatch('UpdateUserInfo', updateData)
        .then((updatedUserInfo) => {
          console.log('后端返回的更新结果:', updatedUserInfo)

          // 检查头像数据是否正确保存
          const sentAvatarUrl = updateData.avatarUrl
          const returnedAvatarUrl = updatedUserInfo.avatar_url

          if (sentAvatarUrl && sentAvatarUrl.startsWith('data:image/')) {
            if (returnedAvatarUrl && returnedAvatarUrl.startsWith('data:image/')) {
              this.$message.success('用户设置保存成功，头像已更新')
              console.log('头像数据正确保存到后端')
            } else {
              this.$message({
                message: '用户设置保存成功，但后端可能未正确保存头像数据',
                type: 'warning',
                duration: 5000
              })
              console.warn('发送的头像数据:', sentAvatarUrl.substring(0, 50) + '...')
              console.warn('返回的头像数据:', returnedAvatarUrl)

              // 如果后端没有正确返回头像数据，我们强制使用前端的数据更新localStorage
              if (updatedUserInfo) {
                updatedUserInfo.avatar_url = sentAvatarUrl
                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo))
                console.log('已强制更新localStorage中的头像数据')
              }
            }
          } else {
            this.$message.success('用户设置保存成功')
          }

          // 使用返回的用户信息更新本地存储
          if (updatedUserInfo) {
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo))
            console.log('localStorage已更新，头像数据:', !!updatedUserInfo.avatar_url)
          }

          // 确保token也同步保存
          const token = this.$store.state.authentication.token
          if (token) {
            localStorage.setItem('token', token)
          }

          // 清除头像预览，使用保存后的头像URL
          this.avatarPreview = null

          // 立即验证保存结果
          setTimeout(() => {
            const verifyUserInfo = localStorage.getItem('userInfo')
            if (verifyUserInfo) {
              try {
                const parsedInfo = JSON.parse(verifyUserInfo)
                console.log('验证保存结果 - localStorage中的头像数据:', !!parsedInfo.avatar_url)
                if (parsedInfo.avatar_url && parsedInfo.avatar_url.startsWith('data:image/')) {
                  console.log('验证通过：localStorage中确实保存了base64头像数据')
                }
              } catch (e) {
                console.error('验证localStorage数据时出错:', e)
              }
            }
          }, 100)

          console.log('=== 保存用户设置完成 ===')
        })
        .catch((err) => {
          console.error('保存用户设置失败:', err)
          this.$message.error(err.message || '保存用户设置失败，请重试')
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
    }, // 处理头像上传
    handleAvatarChange (file) {
      // 验证文件类型
      const isImage = file.raw.type.startsWith('image/')
      if (!isImage) {
        this.$message.error('只能上传图片文件！')
        return
      }

      // 验证文件大小（限制为2MB）
      const isLt2M = file.raw.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
        return
      }

      console.log('文件信息:', {
        name: file.name,
        size: file.raw.size,
        type: file.raw.type,
        lastModified: file.raw.lastModified
      })

      // 读取文件内容转换为base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64Data = e.target.result

        // 设置avatar_url为base64数据（用于保存到数据库）
        this.userForm.avatar_url = base64Data

        // 同时设置预览图片
        this.avatarPreview = base64Data

        console.log('头像base64已生成')
        console.log('base64数据长度:', base64Data.length)
        console.log('base64前缀:', base64Data.substring(0, 50) + '...')

        this.$message.success(`头像已选择 (${(base64Data.length / 1024).toFixed(1)}KB)`)
      }

      reader.onerror = () => {
        this.$message.error('文件读取失败，请重试')
      }

      // 读取文件为base64格式
      reader.readAsDataURL(file.raw)
    },

    // 上传头像到服务器的方法（示例）
    async uploadAvatarToServer (file, filename) {
      try {
        const formData = new FormData()
        formData.append('avatar', file)
        formData.append('filename', filename)

        // 这里应该调用实际的上传API
        // const response = await this.$http.post('/api/upload/avatar', formData)
        // return response.data.path

        console.log('模拟上传头像到服务器:', filename)
        return `/uploads/avatars/${filename}`
      } catch (error) {
        console.error('上传头像失败:', error)
        this.$message.error('头像上传失败')
        throw error
      }
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

      console.log('=== Settings页面mounted开始 ===')
      console.log('本地缓存的用户信息:', userInfo)
      console.log('localStorage中的userInfo:', localStorage.getItem('userInfo'))

      // 主动查询用户的最新信息，确保头像数据是最新的
      try {
        console.log('查询用户最新信息:', userInfo.username)
        const latestUserInfo = await this.$store.dispatch('GetUserByUsername', userInfo.username)
        console.log('从后端获取到的最新用户信息:', latestUserInfo)

        // 检查头像数据
        if (latestUserInfo.avatar_url) {
          console.log('后端返回的头像数据:')
          console.log('  - 数据类型:', typeof latestUserInfo.avatar_url)
          console.log('  - 数据长度:', latestUserInfo.avatar_url.length)
          console.log('  - 是否为base64:', latestUserInfo.avatar_url.startsWith('data:image/'))
          if (latestUserInfo.avatar_url.startsWith('data:image/')) {
            console.log('  - base64前缀:', latestUserInfo.avatar_url.substring(0, 50) + '...')
          } else {
            console.log('  - 完整数据:', latestUserInfo.avatar_url)
          }
        } else {
          console.log('后端返回的用户信息中没有头像数据')
        }

        // 使用最新的用户信息
        this.userForm = {
          ...this.userForm,
          avatar_url: latestUserInfo.avatar_url || '', // 使用最新的头像数据
          username: latestUserInfo.username || '',
          email: latestUserInfo.email || '',
          phone: latestUserInfo.phone || ''
        }

        console.log('更新后的userForm.avatar_url:', this.userForm.avatar_url)

        // 如果用户没有头像或头像为空，记录日志
        if (!latestUserInfo.avatar_url || latestUserInfo.avatar_url.trim() === '') {
          console.log('用户暂无头像，将显示默认头像')
        } else if (latestUserInfo.avatar_url.startsWith('data:image/')) {
          console.log('用户有base64头像数据，将正常显示')
        } else {
          console.log('用户头像URL:', latestUserInfo.avatar_url)
        }
      } catch (error) {
        console.warn('查询用户最新信息失败，使用本地缓存:', error.message)
        // 如果查询失败，使用本地缓存的用户信息
        this.userForm = {
          ...this.userForm,
          avatar_url: userInfo.avatar_url || '',
          username: userInfo.username || '',
          email: userInfo.email || '',
          phone: userInfo.phone || ''
        }
        console.log('使用本地缓存的头像数据:', this.userForm.avatar_url)
      }

      // 清除之前的预览图片
      this.avatarPreview = null

      console.log('=== 最终检查 ===')
      console.log('最终的userForm.avatar_url:', this.userForm.avatar_url)
      console.log('当前localStorage中的userInfo:')
      const currentLocalStorage = localStorage.getItem('userInfo')
      if (currentLocalStorage) {
        try {
          const parsedUserInfo = JSON.parse(currentLocalStorage)
          console.log('  - 用户名:', parsedUserInfo.username)
          console.log('  - 头像数据存在:', !!parsedUserInfo.avatar_url)
          if (parsedUserInfo.avatar_url) {
            console.log('  - 头像数据类型:', typeof parsedUserInfo.avatar_url)
            console.log('  - 头像数据长度:', parsedUserInfo.avatar_url.length)
            console.log('  - 是否为base64:', parsedUserInfo.avatar_url.startsWith('data:image/'))
          }
        } catch (e) {
          console.error('localStorage中的userInfo格式错误:', e)
        }
      } else {
        console.log('localStorage中没有userInfo')
      }
      console.log('=== Settings页面mounted结束 ===')

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

.avatar-upload-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.avatar-uploader {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  transition: all 0.3s ease;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader:hover .avatar-upload-overlay {
  opacity: 1;
}

.avatar-upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  font-size: 12px;
}

.avatar-upload-overlay i {
  font-size: 20px;
  margin-bottom: 4px;
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
  object-fit: cover;
}

.avatar-upload-tips {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}

.preview-tip {
  color: #409eff;
  margin: 0 0 4px 0;
  font-weight: 500;
}

.format-tip {
  margin: 0;
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

  .avatar-upload-overlay i {
    font-size: 16px;
  }

  .avatar-upload-tips {
    font-size: 11px;
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

  .avatar-upload-overlay i {
    font-size: 14px;
  }

  .avatar-upload-tips {
    font-size: 10px;
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
