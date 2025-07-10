<template>
  <el-dialog title="导入课表" width="500px"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :visible.sync="dialogVisible"
             :before-close="handleClose">
    <div class="import-container">
      <el-upload
        ref="upload"
        class="upload-demo"
        drag
        action="#"
        :auto-upload="false"
        :limit="1"
        :on-change="handleFileChange"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :http-request="customUpload"
        accept=".xlsx,.xls">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将Excel文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          <p>支持.xlsx和.xls格式文件，文件大小不超过10MB</p>
        </div>
      </el-upload>

      <el-alert
        title="Excel文件格式要求"
        type="info"
        :closable="false"
        style="margin-top: 20px;">
        <div slot="description">
          <p>Excel文件应包含以下列（按顺序）：</p>
          <p><strong>日期、开始时间、结束时间、课程名称、授课教师、是否必修、上课地址</strong></p>
          <div style="color: #f56c6c; margin-top: 10px;">
            <p><strong>重要提示：</strong></p>
            <p>1. 所有单元格必须设置为<strong>文本格式</strong></p>
            <p>2. 时间格式示例：10:10, 11:50（不要使用时间格式）</p>
            <p>3. 日期格式示例：2025/06/30（不要使用日期格式）</p>
            <p>4. 选中所有数据 → 右键 → 设置单元格格式 → 文本</p>
          </div>
          <div style="margin-top: 10px;">
            <p><strong>数据示例：</strong></p>
            <table style="border-collapse: collapse; width: 100%; font-size: 12px;">
              <tr style="background-color: #f5f5f5;">
                <td style="border: 1px solid #ddd; padding: 4px;">日期</td>
                <td style="border: 1px solid #ddd; padding: 4px;">开始时间</td>
                <td style="border: 1px solid #ddd; padding: 4px;">结束时间</td>
                <td style="border: 1px solid #ddd; padding: 4px;">课程名称</td>
                <td style="border: 1px solid #ddd; padding: 4px;">授课教师</td>
                <td style="border: 1px solid #ddd; padding: 4px;">是否必修</td>
                <td style="border: 1px solid #ddd; padding: 4px;">上课地址</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 4px;">2025/06/30</td>
                <td style="border: 1px solid #ddd; padding: 4px;">10:10</td>
                <td style="border: 1px solid #ddd; padding: 4px;">11:50</td>
                <td style="border: 1px solid #ddd; padding: 4px;">高等语文</td>
                <td style="border: 1px solid #ddd; padding: 4px;">新可老师</td>
                <td style="border: 1px solid #ddd; padding: 4px;">1</td>
                <td style="border: 1px solid #ddd; padding: 4px;">西武山区2号楼</td>
              </tr>
            </table>
          </div>
        </div>
      </el-alert>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button
        type="primary"
        @click="uploadFile"
        :loading="uploading"
        :disabled="!selectedFile">
        上传并导入
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { axios } from '@/util/request'

export default {
  name: 'ImportCourseScheduling',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: false,
      selectedFile: null,
      fileList: [],
      uploading: false
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.authentication.userInfo
    })
  },
  methods: {
    handleFileChange (file) {
      this.selectedFile = file
      this.fileList = [file]
    },

    handleExceed () {
      this.$message.warning('最多只能选择1个文件')
    },

    customUpload (event) {
      // 阻止默认上传行为，我们使用自定义上传
      return false
    },

    uploadFile () {
      if (!this.selectedFile) {
        this.$message.error('请先选择文件')
        return
      }

      this.uploading = true
      // 使用FormData格式发送文件
      const formData = new FormData()
      formData.append('file', this.selectedFile.raw)
      formData.append('username', this.userInfo?.username || '')
      // 输出详细的请求信息
      console.log('=== 导入课程调度请求信息 ===')
      console.log('请求URL: POST /course-scheduling/import')
      console.log('文件信息:', {
        name: this.selectedFile.name,
        size: this.selectedFile.size,
        type: this.selectedFile.raw.type,
        lastModified: new Date(this.selectedFile.raw.lastModified).toLocaleString()
      })
      console.log('用户名:', this.userInfo?.username || '')
      console.log('基础URL:', process.env.VUE_APP_BASE_URL || 'http://localhost:12011')
      console.log('完整请求URL:', (process.env.VUE_APP_BASE_URL || 'http://localhost:12011') + '/course-scheduling/import')
      console.log('请求方式: multipart/form-data')
      console.log('FormData内容检查:')
      for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`  ${pair[0]}: [File] ${pair[1].name} (${pair[1].size} bytes)`)
        } else {
          console.log(`  ${pair[0]}: ${pair[1]}`)
        }
      }
      console.log('========================')

      // 使用axios发送FormData
      axios({
        url: '/course-scheduling/import',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        // 检查响应数据，提供更详细的成功信息
        if (response && response.data) {
          const importResult = response.data
          console.log('导入结果详情:', importResult)
          // 根据导入结果显示不同的成功消息
          if (typeof importResult === 'number') {
            this.$message({
              type: 'success',
              message: `导入成功！共导入 ${importResult} 条课程记录`,
              duration: 4000
            })
          } else if (importResult.success !== undefined) {
            this.$message({
              type: 'success',
              message: `导入成功！共导入 ${importResult.success} 条课程记录`,
              duration: 4000
            })
          } else {
            this.$message({
              type: 'success',
              message: '课程导入成功！',
              duration: 3000
            })
          }
        } else {
          this.$message({
            type: 'success',
            message: '课程导入成功！',
            duration: 3000
          })
        }
        // 触发成功回调，让父组件刷新数据
        this.$emit('on-success', response.data)
        this.close()
      }).catch(error => {
        console.log('=== 导入课程调度错误信息 ===')
        console.log('错误:', error)
        console.log('========================')
        let errorMessage = '导入失败：'
        // 检查是否是重复导入冲突
        if (error.code === 100001 || (error.msg && error.msg.includes('冲突'))) {
          // 处理冲突错误
          this.$msgbox({
            title: '导入冲突',
            message: this.$createElement('div', {
              style: 'text-align: left; line-height: 1.5;'
            }, [
              this.$createElement('p', { style: 'color: #f56c6c; font-weight: bold; margin-bottom: 10px;' }, '检测到课程时间冲突'),
              this.$createElement('p', { style: 'margin-bottom: 10px;' }, error.msg || '部分课程与现有课程时间冲突，无法导入'),
              this.$createElement('p', { style: 'margin-bottom: 10px;' }, '建议：'),
              this.$createElement('ol', { style: 'margin-left: 20px;' }, [
                this.$createElement('li', '检查Excel文件中的时间安排'),
                this.$createElement('li', '确认是否存在重复的课程安排'),
                this.$createElement('li', '如需覆盖现有课程，请先删除冲突的课程'),
                this.$createElement('li', '或修改Excel文件中的时间安排后重新导入')
              ]),
              this.$createElement('p', { style: 'color: #909399; font-size: 12px; margin-top: 10px;' }, '提示：系统会自动检测同一时间段、同一教室的课程冲突')
            ]),
            type: 'warning',
            confirmButtonText: '我知道了'
          })
        } else if (error.msg && error.msg.includes('Cannot get a STRING value from a NUMERIC cell')) {
          // 处理Excel格式错误
          errorMessage = '导入失败：Excel文件格式错误！\n\n解决方案：\n1. 打开Excel文件\n2. 选中所有数据区域\n3. 右键 → 设置单元格格式 → 文本\n4. 保存文件后重新上传'
          this.$msgbox({
            title: 'Excel格式错误',
            message: this.$createElement('div', {
              style: 'text-align: left; line-height: 1.5;'
            }, [
              this.$createElement('p', { style: 'color: #f56c6c; font-weight: bold; margin-bottom: 10px;' }, '文件格式错误：Excel中包含数字格式的单元格'),
              this.$createElement('p', { style: 'margin-bottom: 10px;' }, '解决步骤：'),
              this.$createElement('ol', { style: 'margin-left: 20px;' }, [
                this.$createElement('li', '打开Excel文件'),
                this.$createElement('li', '选中所有数据区域（包括标题行）'),
                this.$createElement('li', '右键 → 设置单元格格式 → 文本'),
                this.$createElement('li', '保存文件后重新上传')
              ]),
              this.$createElement('p', { style: 'color: #909399; font-size: 12px; margin-top: 10px;' }, '特别注意：时间和日期也必须设置为文本格式，如 "10:10" 和 "2025/06/30"')
            ]),
            type: 'error',
            confirmButtonText: '我知道了'
          })
        } else if (error.msg) {
          // 处理其他已知错误
          errorMessage += error.msg
          this.$message({
            type: 'error',
            message: errorMessage,
            duration: 5000
          })
        } else if (error.message) {
          // 处理网络或其他错误
          errorMessage += error.message
          this.$message({
            type: 'error',
            message: errorMessage,
            duration: 5000
          })
        } else {
          // 处理未知错误
          errorMessage += '请检查网络连接和文件格式'
          this.$message({
            type: 'error',
            message: errorMessage,
            duration: 5000
          })
        }
      }).finally(() => {
        this.uploading = false
      })
    },

    close () {
      this.resetData()
      this.$emit('on-close')
      this.dialogVisible = false
    },

    resetData () {
      this.selectedFile = null
      this.fileList = []
      this.uploading = false
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
    },

    handleClose (done) {
      this.resetData()
      this.$emit('on-close')
      done()
    }
  },

  watch: {
    visible (val) {
      if (val) {
        this.dialogVisible = val
      }
    }
  }
}
</script>

<style scoped>
.import-container {
  padding: 20px 0;
}

.dialog-footer {
  text-align: right;
}
</style>
