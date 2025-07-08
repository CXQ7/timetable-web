<template>
  <div>
    <el-dialog title="课程详情" width="900px"
               :visible.sync="dialogVisible"
               :before-close="handleClose" >
      <el-form ref="form" :model="form" inline label-width="80px" class="tams-form-container">
        <el-form-item label="日期">
          <el-input v-model="form.date" class="tams-form-item" readonly></el-input>
        </el-form-item>
        <el-form-item label="教室">
          <el-input v-model="form.classroomName" class="tams-form-item" readonly></el-input>
        </el-form-item>
        <el-form-item label="课程">
          <el-input v-model="form.courseName" class="tams-form-item" readonly></el-input>
        </el-form-item>
        <el-form-item label="老师">
          <el-input v-model="form.teacherName" class="tams-form-item" readonly></el-input>
        </el-form-item>
        <el-form-item label="上课时间">
          <el-input v-model="form.attendTime" class="tams-form-item" readonly></el-input>
        </el-form-item>
        <el-form-item label="下课时间">
          <el-input v-model="form.finishTime" class="tams-form-item" readonly></el-input>
        </el-form-item>
        <div style="margin-top: 20px; width: 100%;">
          <el-divider>备注</el-divider>
          <el-form-item label="备注" style="width: 100%;">
            <el-input
              v-model="form.remarks"
              type="textarea"
              :rows="4"
              placeholder="请输入备注信息、待办事项或注意事项"
              style="width: 100%;"
              @blur="saveRemarks">
            </el-input>
          </el-form-item>
          <div style="color: #909399; font-size: 12px; margin-top: 5px;">
            <i class="el-icon-info"></i> 备注内容会自动保存
          </div>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="confirmDelete" style="margin-right: 10px;">删除</el-button>
        <el-button type="primary" @click="updateCourseSchedulingVisible=true">修改</el-button>
      </div>
    </el-dialog>
    <UpdateCourseScheduling :visible="updateCourseSchedulingVisible"
                            :id="id"
                            @on-success="updateSuccess"
                            @on-close="updateCourseSchedulingVisible=false"></UpdateCourseScheduling>
  </div>
</template>

<script>
import moment from 'moment'
import { mapActions, mapState } from 'vuex'
import UpdateCourseScheduling from '@/views/course-scheduling/UpdateCourseScheduling'

export default {
  name: 'ViewCourseScheduling',
  components: {
    UpdateCourseScheduling
  },
  props: {
    visible: {
      type: Boolean
    },
    id: [Number, String]
  },
  data () {
    return {
      dialogVisible: false,
      updateCourseSchedulingVisible: false,
      form: {
        date: '',
        classroomName: '',
        courseName: '',
        teacherName: '',
        attendTime: '',
        finishTime: '',
        remarks: ''
      },
      remarksChanged: false
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.authentication.userInfo
    })
  },
  created () {
    // 确保form对象在组件创建时就是响应式的
    this.$set(this, 'form', {
      date: '',
      classroomName: '',
      courseName: '',
      teacherName: '',
      attendTime: '',
      finishTime: '',
      remarks: ''
    })
  },
  methods: {
    ...mapActions(['GetCourseSchedulingById', 'RemoveCourseSchedulingById', 'UpdateCourseSchedulingById']),
    search () {
      if (!this.id) return
      this.GetCourseSchedulingById(this.id).then((res) => {
        if (res) {
          // 安全地更新form对象
          this.form = Object.assign({}, this.form, {
            date: res.date || '',
            classroomName: res.classroomName || '',
            courseName: res.courseName || '',
            teacherName: res.teacherName || '',
            attendTime: res.attendTime ? moment(res.attendTime, 'HH:mm:ss').format('HH:mm') : '',
            finishTime: res.finishTime ? moment(res.finishTime, 'HH:mm:ss').format('HH:mm') : '',
            remarks: res.remarks || ''
          })
        }
      }).catch((error) => {
        console.error('获取课程信息失败:', error)
        this.$message.error('获取课程信息失败')
      })
    },
    saveRemarks () {
      if (this.remarksChanged) {
        this.UpdateCourseSchedulingById({
          id: this.id,
          data: {
            remarks: this.form.remarks,
            username: this.userInfo?.username || ''
          }
        }).then(() => {
          this.$message.success('备注已保存')
          this.remarksChanged = false
        }).catch(() => {
          this.$message.error('备注保存失败')
        })
      }
    },
    remove () {
      console.log('删除课程，ID:', this.id, '用户信息:', this.userInfo)
      // 检查用户信息
      if (!this.userInfo || !this.userInfo.username) {
        this.$message.error('用户信息获取失败，请重新登录')
        return
      }
      this.RemoveCourseSchedulingById({
        id: this.id,
        username: this.userInfo.username
      }).then((res) => {
        console.log('删除成功:', res)
        this.$message.success('课程删除成功')
        // 立即关闭弹窗
        this.dialogVisible = false
        // 确保父组件刷新数据
        this.$emit('on-success')
        // 延迟一点再次触发刷新，确保数据同步
        this.$nextTick(() => {
          this.$emit('on-success')
        })
      }).catch((error) => {
        console.error('删除失败:', error)
        this.$message.error('删除失败：' + (error.message || '服务器错误'))
      })
    },
    confirmDelete () {
      this.$confirm('确定要删除这个课程吗？删除后将无法恢复。', '确认删除', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: false
      }).then(() => {
        this.remove()
      }).catch(() => {
        // 用户取消删除
        console.log('用户取消删除')
      })
    },
    handleClose (done) {
      try {
        if (this.$refs.form && typeof this.$refs.form.resetFields === 'function') {
          this.$refs.form.resetFields()
        }
      } catch (error) {
        console.warn('重置表单失败:', error)
      }
      this.$emit('on-close')
      done()
    },
    close () {
      try {
        if (this.$refs.form && typeof this.$refs.form.resetFields === 'function') {
          this.$refs.form.resetFields()
        }
      } catch (error) {
        console.warn('重置表单失败:', error)
      }
      this.$emit('on-close')
      this.dialogVisible = false
    },
    updateSuccess () {
      this.$emit('on-success')
      this.search()
      this.updateCourseSchedulingVisible = false
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.dialogVisible = val
        this.$nextTick(() => {
          this.search()
        })
        // 确保用户信息已加载
        if (!this.userInfo) {
          this.$store.dispatch('InitializeUserState').catch(error => {
            console.error('初始化用户状态失败:', error)
          })
        }
      }
    },
    'form.remarks': {
      handler (newVal, oldVal) {
        if (oldVal !== undefined) {
          this.remarksChanged = true
        }
      },
      deep: true
    }
  },
  // 添加错误处理
  errorCaptured (err, vm, info) {
    console.error('ViewCourseScheduling组件错误:', err, info)
    return false
  }
}
</script>

<style scoped>
.tams-form-container .el-form-item {
  margin-bottom: 15px;
}
.tams-form-item {
  width: 300px;
}
</style>
