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
      </el-form>

      <!-- 备注字段 -->
      <div style="margin-top: 20px;">
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

      <div slot="footer" class="dialog-footer">
        <el-popconfirm title="确定要删除吗？" @onConfirm="remove">
          <el-button type="danger" slot="reference" style="margin-right: 10px;">删除</el-button>
        </el-popconfirm>
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
      form: {},
      remarksChanged: false
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.authentication.userInfo
    })
  },
  methods: {
    ...mapActions(['GetCourseSchedulingById', 'RemoveCourseSchedulingById', 'UpdateCourseSchedulingById']),
    search () {
      this.GetCourseSchedulingById(this.id).then((res) => {
        this.form = res
        this.form.attendTime = moment(res.attendTime, 'HH:mm:ss').format('HH:mm')
        this.form.finishTime = moment(res.finishTime, 'HH:mm:ss').format('HH:mm')
      }).catch(() => {
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
      this.RemoveCourseSchedulingById({
        id: this.id,
        username: this.userInfo?.username || ''
      }).then((res) => {
        this.$emit('on-success')
        this.dialogVisible = false
      }).catch(() => {
      })
    },
    handleClose (done) {
      this.$refs.form.resetFields()
      this.$emit('on-close')
      done()
    },
    close () {
      this.$refs.form.resetFields()
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
        this.search()
        this.dialogVisible = val
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
