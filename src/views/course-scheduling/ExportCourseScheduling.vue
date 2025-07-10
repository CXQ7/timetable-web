<template>
  <el-dialog title="导出课程表" width="580px"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :visible.sync="dialogVisible"
             :before-close="handleClose"
             class="export-dialog">
    <div class="export-content">
      <!-- 说明信息 -->
      <el-alert
        title="导出说明"
        type="info"
        :closable="false"
        show-icon
        class="export-tips">
        <div slot="title">
          <i class="el-icon-info"></i>
          <span style="margin-left: 8px;">导出说明</span>
        </div>
        <p>• 选择日期范围导出指定时间段的课程安排</p>
        <p>• 支持按教室筛选，可导出特定教室的课表</p>
        <p>• 导出的Excel文件包含详细的课程信息</p>
      </el-alert>

      <el-form ref="form" :model="form" :rules="rules" label-width="110px" class="export-form">
        <el-card class="form-section" shadow="never">
          <div slot="header" class="section-header">
            <i class="el-icon-date"></i>
            <span>时间设置</span>
          </div>
          <el-form-item label="日期范围" prop="dates">
            <el-date-picker
              :clearable="false"
              v-model="form.dates"
              :picker-options="pickerOptions"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="form-item">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="工作表命名" prop="sheetNamingType">
            <el-radio-group v-model="form.sheetNamingType" class="radio-group">
              <el-radio :label="1" class="radio-item">
                <span class="radio-label">按时间段命名</span>
                <span class="radio-desc">（如：2024-01-01至2024-01-07）</span>
              </el-radio>
              <el-radio :label="2" class="radio-item">
                <span class="radio-label">按周次命名</span>
                <span class="radio-desc">（如：第1周、第2周）</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="显示周末" prop="isShowWeek">
            <el-radio-group v-model="form.isShowWeek" class="radio-group">
              <el-radio :label="1" class="radio-item">
                <span class="radio-label">显示周末</span>
                <span class="radio-desc">（包含周六、周日）</span>
              </el-radio>
              <el-radio :label="0" class="radio-item">
                <span class="radio-label">仅工作日</span>
                <span class="radio-desc">（周一至周五）</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-card>

        <el-card class="form-section" shadow="never">
          <div slot="header" class="section-header">
            <i class="el-icon-setting"></i>
            <span>筛选与自定义</span>
          </div>
          <el-form-item label="指定教室" prop="classroomId">
            <el-select
              :clearable="true"
              v-model="currentClassroom"
              value-key="id"
              class="form-item"
              placeholder="选择教室（可选）">
              <el-option
                v-for="item in classroomData"
                :key="item.id"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
            <div class="field-tip">不选择则导出所有教室的课程</div>
          </el-form-item>

          <el-form-item label="课表标题" prop="title">
            <el-input
              v-model="form.title"
              class="form-item"
              placeholder="请输入课表标题（可选）"
              maxlength="50"
              show-word-limit>
            </el-input>
            <div class="field-tip">将显示在导出文件的顶部</div>
          </el-form-item>

          <el-form-item label="文件名称" prop="filename">
            <el-input
              v-model="form.filename"
              class="form-item"
              placeholder="请输入文件名（可选）"
              maxlength="30"
              show-word-limit>
              <template slot="append">.xlsx</template>
            </el-input>
            <div class="field-tip">不填写将自动生成文件名</div>
          </el-form-item>
        </el-card>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close" size="medium">
        <i class="el-icon-close"></i>
        取消
      </el-button>
      <el-button
        type="primary"
        :loading="submitBtnLoading"
        @click="submit"
        size="medium">
        <i class="el-icon-download"></i>
        {{ submitBtnLoading ? '正在导出...' : '开始导出' }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import moment from 'moment'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ExportCourseScheduling',
  props: {
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {},
      classroomData: [],
      currentClassroom: {},
      pickerOptions: {
        firstDayOfWeek: 1
      },
      rules: {
        dates: [
          {
            required: true,
            type: 'array',
            min: 2,
            message: '请选择日期范围',
            trigger: 'blur'
          }
        ]
      },
      submitBtnLoading: false
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.authentication.userInfo
    })
  },
  methods: {
    ...mapActions(['GetClassroomRefList']),
    init () {
      this.$set(this.form, 'sheetNamingType', 1)
      this.$set(this.form, 'isShowWeek', 1)
      this.GetClassroomRefList().then(res => {
        if (res) {
          this.classroomData = res
        }
      }).catch(() => {
      })
    },
    resetData () {
      this.$refs.form.resetFields()
      this.form = {}
      this.classroomData = []
      this.currentClassroom = {}
    },
    handleClose (done) {
      this.resetData()
      this.$emit('on-close')
      done()
    },
    close () {
      this.resetData()
      this.$emit('on-close')
      this.dialogVisible = false
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitBtnLoading = true

          let url = 'course-scheduling/export/excel' +
            '?startDate=' + moment(this.form.dates[0]).format('YYYY-MM-DD') +
            '&endDate=' + moment(this.form.dates[1]).format('YYYY-MM-DD') +
            '&sheetNamingType=' + this.form.sheetNamingType +
            '&isShowWeek=' + this.form.isShowWeek +
            '&username=' + encodeURIComponent(this.userInfo?.username || '')

          if (this.currentClassroom && this.currentClassroom.id) {
            url += '&classroomId=' + this.currentClassroom.id
            url += '&classroomName=' + encodeURIComponent(this.currentClassroom.name)
          }
          if (this.form.title) {
            url += '&title=' + encodeURIComponent(this.form.title)
          }
          if (this.form.filename) {
            url += '&filename=' + encodeURIComponent(this.form.filename)
          }

          // 显示导出提示
          this.$message({
            message: '正在准备导出文件，请稍候...',
            type: 'info',
            duration: 2000
          })

          window.location.href = url

          // 延迟重置状态，给用户足够的反馈时间
          setTimeout(() => {
            this.submitBtnLoading = false
            this.$emit('on-success')
            this.dialogVisible = false
            this.resetData()

            this.$message({
              message: '导出完成！文件已开始下载',
              type: 'success',
              duration: 3000
            })
          }, 1500)
        }
      })
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.init()
        this.dialogVisible = val
      }
    }
  }
}
</script>

<style scoped>
.export-dialog {
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.export-content {
  max-height: 70vh;
  overflow-y: auto;
}

.export-tips {
  margin-bottom: 20px;
  border-radius: 8px;
}

.export-tips p {
  margin: 5px 0;
  color: #606266;
  font-size: 14px;
}

.export-form {
  margin-top: 20px;
}

.form-section {
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-header {
  font-weight: 600;
  color: #303133;
  font-size: 16px;
}

.section-header i {
  margin-right: 8px;
  color: #409eff;
}

.form-item {
  width: 100%;
}

.radio-group {
  width: 100%;
}

.radio-item {
  display: block;
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.radio-item:hover {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.radio-item.is-checked {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.radio-label {
  font-weight: 500;
  color: #303133;
}

.radio-desc {
  color: #909399;
  font-size: 12px;
  margin-left: 8px;
}

.field-tip {
  color: #909399;
  font-size: 12px;
  margin-top: 4px;
  line-height: 1.4;
}

.dialog-footer {
  text-align: right;
  padding: 20px 0 0;
  border-top: 1px solid #e4e7ed;
}

.dialog-footer .el-button {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 6px;
}

.dialog-footer .el-button i {
  margin-right: 6px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .export-dialog {
    width: 95% !important;
  }

  .form-item {
    width: 100%;
  }

  .radio-item {
    padding: 6px 8px;
  }
}

/* 深色主题适配 */
.dark .form-section {
  background-color: #2d3748;
  border-color: #4a5568;
}

.dark .section-header {
  color: #e2e8f0;
}

.dark .radio-item {
  background-color: #2d3748;
  border-color: #4a5568;
  color: #e2e8f0;
}

.dark .radio-item:hover {
  border-color: #409eff;
  background-color: #1a365d;
}

.dark .field-tip {
  color: #a0aec0;
}
</style>
