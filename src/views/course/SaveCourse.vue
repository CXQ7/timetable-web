<template>
  <el-dialog title="新增课程" :visible="visible" width="50%" :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="form-container">
      <el-form-item label="课程名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="时长（分钟）" prop="duration">
        <el-input-number v-model="form.duration" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="课程类型" prop="courseType">
        <el-radio-group v-model="form.courseType">
          <el-radio :label="1">必修</el-radio>
          <el-radio :label="2">选修</el-radio>
        </el-radio-group>
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
      form: {
        name: '',
        duration: 90,
        courseType: 1
      },

      rules: {
        name: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }
        ],
        duration: [
          {
            required: true,
            message: '时长不能为空',
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
    ...mapActions(['SaveCourse']),
    handleClose (done) {
      this.$refs.form.resetFields()
      this.form = {
        name: '',
        duration: 90,
        courseType: 1
      }
      this.$emit('on-close')
      done()
    },
    close () {
      this.$refs.form.resetFields()
      this.form = {
        name: '',
        duration: 90,
        courseType: 1
      }
      this.$emit('on-close')
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 输出详细的请求信息
          console.log('=== 新增课程请求信息 ===')
          console.log('请求URL: POST /course')
          console.log('请求数据:', JSON.stringify(this.form, null, 2))
          console.log('请求头: Content-Type: application/json')
          console.log('基础URL:', process.env.VUE_APP_BASE_URL)
          console.log('完整请求URL:', process.env.VUE_APP_BASE_URL + '/course')
          console.log('========================')
          this.submitBtnLoading = true
          this.SaveCourse(this.form).then((res) => {
            console.log('=== 新增课程响应信息 ===')
            console.log('响应数据:', res)
            console.log('========================')
            this.submitBtnLoading = false
            this.$refs.form.resetFields()
            this.form.courseType = 1 // 重置后恢复默认值
            this.$emit('on-success', res)
          }).catch((error) => {
            console.log('=== 新增课程错误信息 ===')
            console.log('错误:', error)
            console.log('========================')
            this.submitBtnLoading = false
          })
        }
      })
    }
  },
  watch: {
    visible (val) {
      // 对话框打开时的处理
    }
  }
}
</script>
