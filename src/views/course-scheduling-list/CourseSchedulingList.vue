<template>
  <el-card shadow="never">
    <div slot="header" class="clearfix">
      <span>选课列表</span>
    </div>
    <div id="course-scheduling-list">
      <el-form inline label-width="80px">
        <el-form-item label="日期">
          <el-date-picker v-model="params.dates"
                          size="mini"
                          :picker-options="datePickerOptions"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          style="min-width: 300px; width: 100%; max-width: 340px;"
                          @change="handleDateChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上课时间">
          <el-time-select size="mini" class="form-item" v-model="params.attendTime" :picker-options="timePickerOptions">
          </el-time-select>
        </el-form-item>
        <el-form-item label="下课时间">
          <el-time-select size="mini" class="form-item" v-model="params.finishTime" :picker-options="timePickerOptions">
          </el-time-select>
        </el-form-item>
        <br/>
        <el-form-item label="教室">
          <el-select ref="classroomSelect" clearable multiple size="mini" class="form-item" v-model="params.classroomIdList">
            <el-option v-for="item in classroomData" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程">
          <el-select ref="courseSelect" clearable multiple size="mini" class="form-item" v-model="params.courseIdList">
            <el-option v-for="item in courseData" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="老师">
          <el-select ref="teacherSelect" clearable multiple size="mini" class="form-item" v-model="params.teacherIdList">
            <el-option v-for="item in teacherData" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div style="float: right; margin: 10px 0;">
      <el-button type="primary" size="small" @click="search">查询</el-button>
      <el-button type="primary" size="small" @click="reset">重置</el-button>
      <el-button slot="reference" type="danger" size="small" :disabled="!(idList && idList.length > 0)" @click="remove">删除</el-button>
    </div>
    <el-table stripe border :data="data" @selection-change="handleSelectionChange" :row-class-name="getRowClassName">
      <!-- <el-table-column type="selection" width="40"></el-table-column> -->
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="date" label="日期" width="140"></el-table-column>
      <el-table-column prop="attendTime" label="上课时间" width="120"></el-table-column>
      <el-table-column prop="finishTime" label="下课时间" width="120"></el-table-column>
      <el-table-column prop="classroomName" label="教室" width="150"></el-table-column>
      <el-table-column prop="courseName" label="课程" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.courseName }}</span>
          <el-tag
            :type="getCourseTypeTagType(scope.row)"
            size="mini"
            style="margin-left: 5px;">
            {{ getCourseTypeText(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="teacherName" label="老师" width="150"></el-table-column>
      <el-table-column prop="remarks" label="备注" show-overflow-tooltip></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'CourseSchedulingList',
  data () {
    return {
      currentVisible: false,
      data: [],
      classroomData: [],
      courseData: [],
      teacherData: [],
      params: {},
      idList: [],
      currentTheme: localStorage.getItem('theme') || 'default',
      datePickerOptions: {
        firstDayOfWeek: 1
      },
      timePickerOptions: {
        start: '07:00',
        step: '00:15',
        end: '20:00'
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.authentication.userInfo
    })
  },
  methods: {
    ...mapActions(['GetClassroomRefList', 'GetCourseRefList', 'GetTeacherRefList', 'GetCourseSchedulingList', 'RemoveCourseSchedulingByIdList']),
    init () {
      this.GetClassroomRefList().then(res => {
        if (res) {
          this.classroomData = res
        }
      }).catch(() => {
      })
      this.GetCourseRefList().then(res => {
        if (res) {
          this.courseData = res
        }
      }).catch(() => {
      })
      this.GetTeacherRefList().then(res => {
        if (res) {
          this.teacherData = res
        }
      }).catch(() => {
      })

      this.params.startDate = moment().startOf('month').format('YYYY-MM-DD')
      this.params.endDate = moment().endOf('month').format('YYYY-MM-DD')
      this.$set(this.params, 'dates', [this.params.startDate, this.params.endDate])
      this.search()
    },
    search () {
      if (this.params.dates && this.params.dates.length === 2) {
        this.params.startDate = this.params.dates[0]
        this.params.endDate = this.params.dates[1]
      }
      this.params.username = this.userInfo?.username || ''
      this.GetCourseSchedulingList(this.params).then(res => {
        if (res) {
          this.data = res
        }
      }).catch(() => {
      })
    },
    reset () {
      this.params = {}
      this.params.startDate = moment().startOf('month').format('YYYY-MM-DD')
      this.params.endDate = moment().endOf('month').format('YYYY-MM-DD')
      this.$set(this.params, 'dates', [this.params.startDate, this.params.endDate])
      this.search()
    },
    remove () {
      this.$confirm('确定要删除该选课吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const deleteData = {
          idList: this.idList,
          username: this.userInfo?.username || ''
        }
        this.RemoveCourseSchedulingByIdList(deleteData).then(() => {
          this.$message.success('删除成功')
          this.search()
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    handleSelectionChange (selection) {
      this.idList = selection.map(item => item.id)
    },
    handleDateChange (value) {
      console.log('日期选择器变化:', value)
      if (value && value.length === 2) {
        this.params.startDate = value[0]
        this.params.endDate = value[1]
        console.log('更新日期范围:', this.params.startDate, '至', this.params.endDate)
      }
    },
    getRowClassName ({ row, rowIndex }) {
      // 优先使用课程调度数据中的课程类型，如果没有则从课程数据中查找
      let courseType = row.courseType
      if (!courseType && row.courseId) {
        const course = this.courseData.find(c => c.id === row.courseId)
        courseType = course ? course.courseType : 1 // 默认为必修
      }
      const isRequired = courseType === 1 || courseType === '1'
      return isRequired ? 'required-course-row' : 'elective-course-row'
    },
    getCourseTypeText (row) {
      // 优先使用课程调度数据中的课程类型，如果没有则从课程数据中查找
      let courseType = row.courseType
      if (!courseType && row.courseId) {
        const course = this.courseData.find(c => c.id === row.courseId)
        courseType = course ? course.courseType : 1 // 默认为必修
      }
      return (courseType === 1 || courseType === '1') ? '必修' : '选修'
    },
    getCourseTypeTagType (row) {
      // 优先使用课程调度数据中的课程类型，如果没有则从课程数据中查找
      let courseType = row.courseType
      if (!courseType && row.courseId) {
        const course = this.courseData.find(c => c.id === row.courseId)
        courseType = course ? course.courseType : 1 // 默认为必修
      }
      return (courseType === 1 || courseType === '1') ? 'danger' : 'success'
    },
    applyTheme () {
      const body = document.body
      body.className = body.className.replace(/theme-\w+/g, '')
      if (this.currentTheme !== 'default') {
        body.classList.add(this.currentTheme)
      }
    }
  },
  mounted () {
    this.init()
    this.applyTheme()
    // 监听主题变化
    window.addEventListener('storage', (e) => {
      if (e.key === 'theme') {
        this.currentTheme = e.newValue || 'default'
        this.applyTheme()
      }
    })
  }
}
</script>

<style>
#course-scheduling-list .el-form-item {
  margin-bottom: 0;
}
#course-scheduling-list .form-item {
  width: 240px;
}

/* 日期选择器整体样式 */
#course-scheduling-list .el-date-editor {
  min-width: 300px !important;
  width: 100% !important;
  max-width: 340px !important;
  height: 32px !important;
  display: flex !important;
  align-items: center !important;
  border: 1px solid #dcdfe6 !important;
  border-radius: 4px !important;
  padding: 0 8px !important;
  background-color: #ffffff !important;
}

/* 日期选择器输入框样式 */
#course-scheduling-list .el-date-editor .el-range-input {
  width: 45% !important;
  height: 30px !important;
  line-height: 30px !important;
  font-size: 14px !important;
  padding: 0 4px !important;
  border: none !important;
  background: transparent !important;
  text-align: center !important;
  vertical-align: middle !important;
  outline: none !important;
}

/* "至"分隔符样式 */
#course-scheduling-list .el-date-editor .el-range-separator {
  width: 10% !important;
  height: 30px !important;
  line-height: 30px !important;
  font-size: 14px !important;
  color: #606266 !important;
  background: transparent !important;
  border: none !important;
  text-align: center !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 0 !important;
  padding: 0 !important;
  box-shadow: none !important;
}

/* 日期选择器图标样式 */
#course-scheduling-list .el-date-editor .el-input__icon {
  line-height: 32px !important;
  color: #c0c4cc !important;
}

/* 确保容器有足够空间 */
#course-scheduling-list {
  padding: 20px;
  min-height: 200px;
}

/* 日期选择器容器样式 */
#course-scheduling-list .el-form-item:first-child {
  position: relative;
  z-index: 1000;
}

/* 课程类型行样式 */
.required-course-row {
  background-color: #f0f7ff !important;
  border-left: 4px solid #409EFF !important;
}

.required-course-row:hover > td {
  background-color: #e6f3ff !important;
}

.elective-course-row {
  background-color: #f5f5f5 !important;
  border-left: 4px solid #909399 !important;
}

.elective-course-row:hover > td {
  background-color: #ebebeb !important;
}

/* 确保条纹效果与课程类型样式兼容 */
.el-table--striped .required-course-row:nth-child(even) {
  background-color: #f0f7ff !important;
}

.el-table--striped .elective-course-row:nth-child(even) {
  background-color: #f5f5f5 !important;
}

.el-table--striped .required-course-row:nth-child(odd) {
  background-color: #f0f7ff !important;
}

.el-table--striped .elective-course-row:nth-child(odd) {
  background-color: #f5f5f5 !important;
}

/* 课程类型标签样式优化 */
.el-tag--danger {
  background-color: #409EFF !important;
  border-color: #409EFF !important;
  color: #ffffff !important;
  font-weight: bold !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  min-width: 40px !important;
  height: 22px !important;
  line-height: 1 !important;
  padding: 0 8px !important;
  border-radius: 4px !important;
  box-shadow: none !important;
}

.el-tag--success {
  background-color: #909399 !important;
  border-color: #909399 !important;
  color: #ffffff !important;
  font-weight: 500 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  min-width: 40px !important;
  height: 22px !important;
  line-height: 1 !important;
  padding: 0 8px !important;
  border-radius: 4px !important;
  box-shadow: none !important;
}

/* 暗色风主题特定标签样式 */
.theme-dark .el-tag--danger {
  background-color: #4a4a4a !important;
  border-color: #4a4a4a !important;
  color: #ffffff !important;
}

.theme-dark .el-tag--success {
  background-color: #999999 !important;
  border-color: #999999 !important;
  color: #ffffff !important;
}

/* 暗色风主题行样式 */
.theme-dark .required-course-row {
  background-color: #3a3a3a !important;
  border-left: 4px solid #4a4a4a !important;
}

.theme-dark .required-course-row:hover > td {
  background-color: #444444 !important;
}

.theme-dark .elective-course-row {
  background-color: #2a2a2a !important;
  border-left: 4px solid #999999 !important;
}

.theme-dark .elective-course-row:hover > td {
  background-color: #333333 !important;
}

/* 暗色风主题 - 日期选择器样式 */
.theme-dark #course-scheduling-list .el-date-editor {
  background-color: #2d2d2d !important;
  border-color: #606266 !important;
  color: #ffffff !important;
}

.theme-dark #course-scheduling-list .el-date-editor:hover {
  border-color: #999999 !important;
}

.theme-dark #course-scheduling-list .el-date-editor.is-active {
  border-color: #666666 !important;
}

.theme-dark #course-scheduling-list .el-date-editor .el-range-input {
  background-color: transparent !important;
  color: #ffffff !important;
}

.theme-dark #course-scheduling-list .el-date-editor .el-range-separator {
  background-color: transparent !important;
  color: #ffffff !important;
}

.theme-dark #course-scheduling-list .el-date-editor .el-input__icon {
  color: #c0c4cc !important;
}
</style>
