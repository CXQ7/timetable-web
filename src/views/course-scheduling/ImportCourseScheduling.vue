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
        :auto-upload="false"
        :limit="1"
        :on-change="handleFileChange"
        :on-exceed="handleExceed"
        :file-list="fileList"
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
          <p>Excel文件应包含以下列：</p>
          <p><strong>日期、上课时间、下课时间、课程名称、教室名称、教师名称</strong></p>
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

    uploadFile () {
      if (!this.selectedFile) {
        this.$message.error('请先选择文件')
        return
      }

      this.uploading = true
      const formData = new FormData()
      formData.append('file', this.selectedFile.raw)
      formData.append('username', this.userInfo?.username || '')

      // 使用axios直接上传文件
      this.$axios.post('/course-scheduling/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        this.$message.success('导入成功')
        this.$emit('on-success')
        this.close()
      }).catch(error => {
        this.$message.error('导入失败：' + (error.response?.data?.message || error.message))
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
