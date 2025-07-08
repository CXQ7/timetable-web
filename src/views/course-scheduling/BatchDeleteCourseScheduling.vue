<template>
  <div>
    <el-dialog
      v-if="visible"
      title="批量删除课程"
      :visible="visible"
      width="600px"
      @close="close"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="batch-delete-dialog"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="form.endDate"
            type="date"
            placeholder="选择结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="筛选条件" prop="filterType">
          <el-radio-group v-model="form.filterType">
            <el-radio label="all">删除所有课程</el-radio>
            <el-radio label="course">按课程筛选</el-radio>
            <el-radio label="teacher">按教师筛选</el-radio>
            <el-radio label="classroom">按教室筛选</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.filterType === 'course'"
          label="选择课程"
          prop="courseId"
        >
          <el-select
            v-model="form.courseId"
            placeholder="请选择课程"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="course in courseData"
              :key="course.id"
              :label="course.name"
              :value="course.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.filterType === 'teacher'"
          label="选择教师"
          prop="teacherId"
        >
          <el-select
            v-model="form.teacherId"
            placeholder="请选择教师"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="teacher in teacherData"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.filterType === 'classroom'"
          label="选择教室"
          prop="classroomId"
        >
          <el-select
            v-model="form.classroomId"
            placeholder="请选择教室"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="classroom in classroomData"
              :key="classroom.id"
              :label="classroom.name"
              :value="classroom.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-alert
            title="警告"
            type="warning"
            :closable="false"
            show-icon
          >
            <template slot="title">
              <span style="color: #e6a23c; font-weight: bold;">
                此操作将永久删除指定日期范围内的课程，无法恢复！
              </span>
            </template>
          </el-alert>
        </el-form-item>
        <el-form-item v-if="previewCount > 0">
          <el-alert
            :title="`预计删除 ${previewCount} 个课程`"
            type="info"
            :closable="false"
            show-icon
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button
          type="primary"
          @click="previewDelete"
          :loading="previewLoading"
        >
          预览删除
        </el-button>
        <el-button
          type="danger"
          @click="confirmBatchDelete"
          :disabled="previewCount === 0"
          :loading="deleteLoading"
        >
          确认删除
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'BatchDeleteCourseScheduling',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        startDate: '',
        endDate: '',
        filterType: 'all',
        courseId: '',
        teacherId: '',
        classroomId: ''
      },
      rules: {
        startDate: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结束日期', trigger: 'change' }
        ],
        courseId: [
          { required: true, message: '请选择课程', trigger: 'change' }
        ],
        teacherId: [
          { required: true, message: '请选择教师', trigger: 'change' }
        ],
        classroomId: [
          { required: true, message: '请选择教室', trigger: 'change' }
        ]
      },
      previewCount: 0,
      previewLoading: false,
      deleteLoading: false,
      courseData: [],
      teacherData: [],
      classroomData: []
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.authentication.userInfo
    })
  },
  watch: {
    visible (val) {
      if (val) {
        this.resetForm()
        this.loadSelectData()
      }
    },
    'form.startDate' () {
      this.previewCount = 0
    },
    'form.endDate' () {
      this.previewCount = 0
    },
    'form.filterType' () {
      this.previewCount = 0
      this.resetFilterFields()
    },
    'form.courseId' () {
      this.previewCount = 0
    },
    'form.teacherId' () {
      this.previewCount = 0
    },
    'form.classroomId' () {
      this.previewCount = 0
    }
  },
  methods: {
    ...mapActions([
      'GetCourseSchedulingList',
      'RemoveCourseSchedulingByIdList',
      'GetCourseRefList',
      'GetTeacherRefList',
      'GetClassroomRefList'
    ]),
    resetForm () {
      this.form = {
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().add(7, 'days').format('YYYY-MM-DD'),
        filterType: 'all',
        courseId: '',
        teacherId: '',
        classroomId: ''
      }
      this.previewCount = 0
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
    resetFilterFields () {
      this.form.courseId = ''
      this.form.teacherId = ''
      this.form.classroomId = ''
    },
    async loadSelectData () {
      try {
        const [courseRes, teacherRes, classroomRes] = await Promise.all([
          this.GetCourseRefList(),
          this.GetTeacherRefList(),
          this.GetClassroomRefList()
        ])
        this.courseData = courseRes || []
        this.teacherData = teacherRes || []
        this.classroomData = classroomRes || []
      } catch (error) {
        console.error('加载选择数据失败:', error)
        this.$message.error('加载数据失败')
      }
    },
    async previewDelete () {
      try {
        // 只验证日期字段
        await this.$refs.form.validateField(['startDate', 'endDate'])
        // 根据筛选类型验证相应字段
        if (this.form.filterType === 'course') {
          await this.$refs.form.validateField('courseId')
        } else if (this.form.filterType === 'teacher') {
          await this.$refs.form.validateField('teacherId')
        } else if (this.form.filterType === 'classroom') {
          await this.$refs.form.validateField('classroomId')
        }
        if (moment(this.form.endDate).isBefore(this.form.startDate)) {
          this.$message.error('结束日期不能早于开始日期')
          return
        }
        this.previewLoading = true
        const params = {
          username: this.userInfo.username,
          startDate: this.form.startDate,
          endDate: this.form.endDate
        }
        // 根据筛选类型添加参数
        if (this.form.filterType === 'course' && this.form.courseId) {
          params.courseId = this.form.courseId
        } else if (this.form.filterType === 'teacher' && this.form.teacherId) {
          params.teacherId = this.form.teacherId
        } else if (this.form.filterType === 'classroom' && this.form.classroomId) {
          params.classroomId = this.form.classroomId
        }
        const result = await this.GetCourseSchedulingList(params)
        this.previewCount = result ? result.length : 0
        if (this.previewCount === 0) {
          this.$message.info('在指定条件下没有找到需要删除的课程')
        } else {
          this.$message.success(`找到 ${this.previewCount} 个课程可以删除`)
        }
      } catch (error) {
        console.error('预览删除失败:', error)
        this.$message.error('预览失败')
      } finally {
        this.previewLoading = false
      }
    },
    async confirmBatchDelete () {
      if (this.previewCount === 0) {
        this.$message.warning('请先预览删除')
        return
      }
      try {
        await this.$confirm(
          `确定要删除 ${this.previewCount} 个课程吗？此操作无法撤销！`,
          '确认批量删除',
          {
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            type: 'warning',
            dangerouslyUseHTMLString: false
          }
        )
        this.deleteLoading = true
        const params = {
          username: this.userInfo.username,
          startDate: this.form.startDate,
          endDate: this.form.endDate
        }
        // 根据筛选类型添加参数
        if (this.form.filterType === 'course' && this.form.courseId) {
          params.courseId = this.form.courseId
        } else if (this.form.filterType === 'teacher' && this.form.teacherId) {
          params.teacherId = this.form.teacherId
        } else if (this.form.filterType === 'classroom' && this.form.classroomId) {
          params.classroomId = this.form.classroomId
        }
        // 先获取要删除的课程列表
        const courseList = await this.GetCourseSchedulingList(params)
        console.log('获取到的课程列表:', courseList)
        if (!courseList || courseList.length === 0) {
          this.$message.warning('没有找到需要删除的课程')
          return
        }
        // 提取课程ID列表，确保ID是数字类型
        const idList = courseList.map(course => {
          const id = parseInt(course.id)
          console.log('课程ID转换:', course.id, '->', id)
          return id
        }).filter(id => !isNaN(id))
        console.log('提取的课程ID列表:', idList)
        if (idList.length === 0) {
          this.$message.error('无效的课程ID，无法删除')
          return
        }
        // 构造删除参数 - 尝试不同的格式
        const deleteData = {
          idList: idList,
          username: this.userInfo.username
        }
        console.log('删除参数(对象格式):', deleteData)
        // 也尝试简单数组格式
        const simpleDeleteData = idList
        console.log('删除参数(数组格式):', simpleDeleteData)
        try {
          // 先尝试对象格式
          await this.RemoveCourseSchedulingByIdList(deleteData)
        } catch (error) {
          console.log('对象格式失败，尝试数组格式:', error)
          // 如果对象格式失败，尝试数组格式
          await this.RemoveCourseSchedulingByIdList(simpleDeleteData)
        }
        this.$message.success(`成功删除 ${courseList.length} 个课程`)
        this.close()
        this.$emit('on-success')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('批量删除失败:', error)
          this.$message.error('批量删除失败：' + (error.message || '服务器错误'))
        }
      } finally {
        this.deleteLoading = false
      }
    },
    close () {
      this.resetForm()
      this.$emit('on-close')
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

.dialog-footer .el-button {
  margin-left: 10px;
}

.el-alert {
  margin-bottom: 0;
}
</style>
