<template>
  <el-dialog title="新增课程" :visible.sync="visible" width="50%" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="form-container">
      <el-form-item label="课程名称" prop="name">
        <el-input v-model="form.name" class="form-item"></el-input>
      </el-form-item>
      <el-form-item label="时长（分钟）" prop="duration">
        <el-input-number v-model="form.duration" :step="$consts.COURSE_DURATION_STEP_MINUTE" :min="0" :max="360" class="form-item"></el-input-number>
      </el-form-item>
      <el-form-item label="课程类型" prop="courseType">
        <el-radio-group v-model="form.courseType" class="form-item">
          <el-radio :label="1">必修</el-radio>
          <el-radio :label="2">选修</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="背景颜色" prop="backgroundColor">
        <el-color-picker v-model="form.backgroundColor" :predefine="predefineColors">
        </el-color-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="submitBtnLoading" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SaveCourse',
  props: {
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        courseType: 1
      },
      predefineColors: [],
      rules: {
        name: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }
        ],
        courseType: [
          {
            required: true,
            message: '课程类型不能为空',
            trigger: 'change'
          }
        ]
      },
      submitBtnLoading: false
    }
  },
  methods: {
    ...mapActions(['SaveCourse', 'GetEffectiveList']),
    init () {
      this.GetEffectiveList().then((res) => {
        this.predefineColors = res
      }).catch(() => {
      })
    },
    handleClose (done) {
      this.$refs.form.resetFields()
      this.form.courseType = 1 // 重置后恢复默认值
      this.$emit('on-close')
      done()
    },
    close () {
      this.$refs.form.resetFields()
      this.form.courseType = 1 // 重置后恢复默认值
      this.$emit('on-close')
      this.dialogVisible = false
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log('提交的课程数据：', this.form)
          this.submitBtnLoading = true
          this.SaveCourse(this.form).then((res) => {
            this.submitBtnLoading = false
            this.$refs.form.resetFields()
            this.form.courseType = 1 // 重置后恢复默认值
            this.$emit('on-success', res)
            this.dialogVisible = false
          }).catch(() => {
            this.submitBtnLoading = false
          })
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
