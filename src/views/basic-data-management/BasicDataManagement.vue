<template>
  <el-card shadow="never" class="basic-data-management">
    <div slot="header" class="clearfix">
      <span>基础数据管理</span>
    </div>
    <el-tabs v-model="activeTab" type="card" class="management-tabs">
      <!-- 教室管理 -->
      <el-tab-pane name="classroom">
        <span slot="label" class="tab-label">
          <i class="el-icon-office-building"></i>
          教室管理
        </span>
        <div class="tab-content">
          <el-row class="search-container">
            <el-col :span="24">
              <el-button type="primary" size="small" class="operate-item" @click="saveClassroomVisible=true">
                <i class="el-icon-plus"></i>
                新增教室
              </el-button>
            </el-col>
          </el-row>

          <div v-loading="classroomLoading">
            <el-table stripe border :data="classroomData.records">
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <el-table-column prop="name" label="教室名称" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column
                  fixed="right"
                  label="操作"
                  width="100">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="showUpdateClassroom(scope.row.id)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
                background
                @size-change="handleClassroomSizeChange"
                @current-change="handleClassroomCurrentChange"
                :current-page="classroomCurrent"
                :page-sizes="$consts.PAGE_SIZES"
                :page-size="classroomSize"
                style="margin-top: 10px;"
                layout="total, sizes, prev, pager, next"
                :total="classroomData.total">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>

      <!-- 课程管理 -->
      <el-tab-pane name="course">
        <span slot="label" class="tab-label">
          <i class="el-icon-reading"></i>
          课程管理
        </span>
        <div class="tab-content">
          <el-row class="search-container">
            <el-col :span="24">
              <el-button type="primary" size="small" class="operate-item" @click="saveCourseVisible=true">
                <i class="el-icon-plus"></i>
                新增课程
              </el-button>
            </el-col>
          </el-row>

          <div v-loading="courseLoading">
            <el-table stripe border :data="courseData.records">
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <el-table-column prop="name" label="课程名称" width="180" show-overflow-tooltip></el-table-column>
              <el-table-column prop="duration" label="时长(分钟)" width="100"></el-table-column>
              <el-table-column label="课程类型" width="90">
                <template slot-scope="scope">
                  <el-tag
                    :type="getCourseTypeTagType(scope.row.courseType)"
                    size="mini"
                    class="course-type-tag">
                    {{ getCourseTypeText(scope.row.courseType) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                  fixed="right"
                  label="操作"
                  width="100">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="showUpdateCourse(scope.row.id)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
                background
                @size-change="handleCourseSizeChange"
                @current-change="handleCourseCurrentChange"
                :current-page="courseCurrent"
                :page-sizes="$consts.PAGE_SIZES"
                :page-size="courseSize"
                style="margin-top: 10px;"
                layout="total, sizes, prev, pager, next"
                :total="courseData.total">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>

      <!-- 老师管理 -->
      <el-tab-pane name="teacher">
        <span slot="label" class="tab-label">
          <i class="el-icon-user"></i>
          老师管理
        </span>
        <div class="tab-content">
          <el-row class="search-container">
            <el-col :span="24">
              <el-button type="primary" size="small" class="operate-item" @click="saveTeacherVisible=true">
                <i class="el-icon-plus"></i>
                新增老师
              </el-button>
            </el-col>
          </el-row>

          <div v-loading="teacherLoading">
            <el-table stripe border :data="teacherData.records">
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <el-table-column prop="name" label="老师姓名" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="showUpdateTeacher(scope.row.id)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              @size-change="handleTeacherSizeChange"
              @current-change="handleTeacherCurrentChange"
              :current-page="teacherCurrent"
              :page-sizes="$consts.PAGE_SIZES"
              :page-size="teacherSize"
              style="margin-top: 10px;"
              layout="total, sizes, prev, pager, next"
              :total="teacherData.total">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 教室相关弹窗 -->
    <SaveClassroom :visible="saveClassroomVisible"
                   @on-close="saveClassroomVisible=false"
                   @on-success="saveClassroomSuccess">
    </SaveClassroom>
    <UpdateClassroom :visible="updateClassroomVisible"
                     :id="classroomId"
                     @on-close="updateClassroomVisible=false"
                     @on-success="updateClassroomSuccess">
    </UpdateClassroom>

    <!-- 课程相关弹窗 -->
    <SaveCourse :visible="saveCourseVisible"
                @on-close="saveCourseVisible=false"
                @on-success="saveCourseSuccess">
    </SaveCourse>
    <UpdateCourse :visible="updateCourseVisible"
                  :id="courseId"
                  @on-close="updateCourseVisible=false"
                  @on-success="updateCourseSuccess">
    </UpdateCourse>

    <!-- 老师相关弹窗 -->
    <SaveTeacher :visible="saveTeacherVisible"
                 @on-close="saveTeacherVisible=false"
                 @on-success="saveTeacherSuccess">
    </SaveTeacher>
    <UpdateTeacher :visible="updateTeacherVisible"
                   :id="teacherId"
                   @on-close="updateTeacherVisible=false"
                   @on-success="updateTeacherSuccess">
    </UpdateTeacher>
  </el-card>
</template>

<script>
import { mapActions } from 'vuex'
import SaveClassroom from '@/views/classroom/SaveClassroom'
import UpdateClassroom from '@/views/classroom/UpdateClassroom'
import SaveCourse from '@/views/course/SaveCourse'
import UpdateCourse from '@/views/course/UpdateCourse'
import SaveTeacher from '@/views/teacher/SaveTeacher'
import UpdateTeacher from '@/views/teacher/UpdateTeacher'

export default {
  name: 'BasicDataManagement',
  components: {
    SaveClassroom,
    UpdateClassroom,
    SaveCourse,
    UpdateCourse,
    SaveTeacher,
    UpdateTeacher
  },
  data () {
    return {
      activeTab: 'classroom',
      // 教室管理相关
      classroomData: [],
      classroomParams: {
        page: 1,
        size: 10,
        name: ''
      },
      classroomCurrent: 1,
      classroomSize: 10,
      classroomLoading: false,
      saveClassroomVisible: false,
      updateClassroomVisible: false,
      classroomId: '',
      // 课程管理相关
      courseData: [],
      courseParams: {},
      courseCurrent: 1,
      courseSize: 10,
      courseLoading: false,
      saveCourseVisible: false,
      updateCourseVisible: false,
      courseId: '',
      // 老师管理相关
      teacherData: [],
      teacherParams: {},
      teacherCurrent: 1,
      teacherSize: 10,
      teacherLoading: false,
      saveTeacherVisible: false,
      updateTeacherVisible: false,
      teacherId: ''
    }
  },
  methods: {
    ...mapActions([
      'GetClassroomPage', 'UpdateClassroomEnableStateById',
      'GetCoursePage', 'UpdateCourseEnableStateById',
      'GetTeacherPage', 'UpdateTeacherEnableStateById'
    ]),
    // 初始化方法
    init () {
      this.searchClassroom()
    },
    // 教室管理相关方法
    searchClassroom () {
      this.classroomParams.current = this.classroomCurrent
      this.classroomParams.size = this.classroomSize
      this.classroomLoading = true
      this.GetClassroomPage(this.classroomParams).then(res => {
        this.classroomLoading = false
        if (res) {
          this.classroomData = res
        }
      }).catch(() => {
        this.classroomLoading = false
      })
    },
    handleClassroomSizeChange (val) {
      this.classroomSize = val
      this.searchClassroom()
    },
    handleClassroomCurrentChange (val) {
      this.classroomCurrent = val
      this.searchClassroom()
    },
    saveClassroomSuccess () {
      this.searchClassroom()
      this.saveClassroomVisible = false
    },
    showUpdateClassroom (id) {
      this.classroomId = id
      this.updateClassroomVisible = true
    },
    updateClassroomSuccess () {
      this.searchClassroom()
      this.updateClassroomVisible = false
    },
    // 课程管理相关方法
    searchCourse () {
      this.courseParams.current = this.courseCurrent
      this.courseParams.size = this.courseSize
      this.courseLoading = true
      this.GetCoursePage(this.courseParams).then(res => {
        this.courseLoading = false
        if (res) {
          this.courseData = res
        }
      }).catch(() => {
        this.courseLoading = false
      })
    },
    handleCourseSizeChange (val) {
      this.courseSize = val
      this.searchCourse()
    },
    handleCourseCurrentChange (val) {
      this.courseCurrent = val
      this.searchCourse()
    },
    saveCourseSuccess () {
      this.searchCourse()
      this.saveCourseVisible = false
    },
    showUpdateCourse (id) {
      this.courseId = id
      this.updateCourseVisible = true
    },
    updateCourseSuccess () {
      this.searchCourse()
      this.updateCourseVisible = false
    },
    // 老师管理相关方法
    searchTeacher () {
      this.teacherParams.current = this.teacherCurrent
      this.teacherParams.size = this.teacherSize
      this.teacherLoading = true
      this.GetTeacherPage(this.teacherParams).then(res => {
        this.teacherLoading = false
        if (res) {
          this.teacherData = res
        }
      }).catch(() => {
        this.teacherLoading = false
      })
    },
    handleTeacherSizeChange (val) {
      this.teacherSize = val
      this.searchTeacher()
    },
    handleTeacherCurrentChange (val) {
      this.teacherCurrent = val
      this.searchTeacher()
    },
    saveTeacherSuccess () {
      this.searchTeacher()
      this.saveTeacherVisible = false
    },
    showUpdateTeacher (id) {
      this.teacherId = id
      this.updateTeacherVisible = true
    },
    updateTeacherSuccess () {
      this.searchTeacher()
      this.updateTeacherVisible = false
    },
    getCourseTypeTagType (courseType) {
      if (courseType === 1 || courseType === '1') {
        return 'success'
      } else if (courseType === 2 || courseType === '2') {
        return 'info'
      } else {
        return 'success'
      }
    },
    getCourseTypeText (courseType) {
      if (courseType === 1 || courseType === '1') {
        return '必修'
      } else if (courseType === 2 || courseType === '2') {
        return '选修'
      } else {
        return '必修'
      }
    }
  },
  watch: {
    activeTab (newTab) {
      // 当切换标签页时，加载对应的数据
      if (newTab === 'classroom' && this.classroomData.length === 0) {
        this.searchClassroom()
      } else if (newTab === 'course' && this.courseData.length === 0) {
        this.searchCourse()
      } else if (newTab === 'teacher' && this.teacherData.length === 0) {
        this.searchTeacher()
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style>
/* 基础数据管理页面样式 */
.basic-data-management .el-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
}

.basic-data-management .management-tabs {
  margin-top: 20px;
}

.basic-data-management .tab-content {
  padding: 20px 0;
}

.basic-data-management .search-container {
  margin-bottom: 20px;
}

.basic-data-management .operate-item {
  float: right;
}

/* 标签页样式优化 */
.basic-data-management .management-tabs .el-tabs__header {
  margin-bottom: 20px;
}

.basic-data-management .management-tabs .el-tabs__item {
  padding: 0 30px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.basic-data-management .management-tabs .el-tabs__item.is-active {
  color: white;
  border-radius: 4px 4px 0 0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 标签页标题主题化 */
.basic-data-management .tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
}

.basic-data-management .tab-label i {
  font-size: 16px;
  margin-right: 4px;
}

/* 默认主题 */
.basic-data-management .management-tabs .el-tabs__item:not(.is-active) .tab-label {
  color: #409EFF !important;
}

.basic-data-management .management-tabs .el-tabs__item.is-active {
  background: linear-gradient(135deg, #409EFF, #36A3F7) !important;
  color: white !important;
}

.basic-data-management .management-tabs .el-tabs__item:hover:not(.is-active) {
  background: linear-gradient(135deg, #ecf5ff, #e6f7ff) !important;
}

.basic-data-management .management-tabs .el-tabs__item:hover:not(.is-active) .tab-label {
  color: #409EFF !important;
}

/* 暗色主题 */
.theme-dark .basic-data-management .management-tabs .el-tabs__item:not(.is-active) .tab-label {
  color: #ffffff !important;
}

.theme-dark .basic-data-management .management-tabs .el-tabs__item.is-active {
  background: linear-gradient(135deg, #666666, #808080) !important;
  color: white !important;
}

.theme-dark .basic-data-management .management-tabs .el-tabs__item:hover:not(.is-active) {
  background: linear-gradient(135deg, #404040, #505050) !important;
}

.theme-dark .basic-data-management .management-tabs .el-tabs__item:hover:not(.is-active) .tab-label {
  color: #ffffff !important;
}

/* 马卡龙主题 */
.theme-macaron .basic-data-management .management-tabs .el-tabs__item:not(.is-active) .tab-label {
  color: #8b4789 !important;
}

.theme-macaron .basic-data-management .management-tabs .el-tabs__item.is-active {
  background: linear-gradient(135deg, #8b4789, #a05a9e) !important;
  color: white !important;
}

.theme-macaron .basic-data-management .management-tabs .el-tabs__item:hover:not(.is-active) {
  background: linear-gradient(135deg, #f8f4f8, #f0e6f0) !important;
}

.theme-macaron .basic-data-management .management-tabs .el-tabs__item:hover:not(.is-active) .tab-label {
  color: #8b4789 !important;
}

/* 清新绿主题 */
.theme-fresh-green .basic-data-management .management-tabs .el-tabs__item:not(.is-active) .tab-label {
  color: #1e7e34 !important;
}

.theme-fresh-green .basic-data-management .management-tabs .el-tabs__item.is-active {
  background: linear-gradient(135deg, #1e7e34, #28a745) !important;
  color: white !important;
}

.theme-fresh-green .basic-data-management .management-tabs .el-tabs__item:hover:not(.is-active) {
  background: linear-gradient(135deg, #f0fff4, #e8f5e8) !important;
}

.theme-fresh-green .basic-data-management .management-tabs .el-tabs__item:hover:not(.is-active) .tab-label {
  color: #1e7e34 !important;
}

/* 复古黄主题 */
.theme-retro-yellow .basic-data-management .management-tabs .el-tabs__item:not(.is-active) .tab-label {
  color: #8b4513 !important;
}

.theme-retro-yellow .basic-data-management .management-tabs .el-tabs__item.is-active {
  background: linear-gradient(135deg, #8b4513, #a0522d) !important;
  color: white !important;
}

.theme-retro-yellow .basic-data-management .management-tabs .el-tabs__item:hover:not(.is-active) {
  background: linear-gradient(135deg, #fdf6e3, #f3ecd4) !important;
}

.theme-retro-yellow .basic-data-management .management-tabs .el-tabs__item:hover:not(.is-active) .tab-label {
  color: #8b4513 !important;
}

/* 课程类型标签优化 */
.basic-data-management .course-type-tag {
  border-radius: 12px;
  font-weight: 600;
  padding: 6px 12px;
  font-size: 12px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  text-align: center;
}

/* 表格样式优化 */
.basic-data-management .el-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.basic-data-management .el-table th {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #409EFF;
}

.basic-data-management .el-table td {
  border-bottom: 1px solid #f0f0f0;
}

.basic-data-management .el-table tbody tr:hover {
  background: linear-gradient(135deg, #f8fbff, #ecf5ff);
}

/* 按钮样式优化 */
.basic-data-management .operate-item {
  background: linear-gradient(135deg, #409EFF, #36A3F7);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  padding: 10px 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.basic-data-management .operate-item:hover {
  background: linear-gradient(135deg, #36A3F7, #2d8cf0);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.basic-data-management .el-button--mini {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.basic-data-management .el-button--mini:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

/* 分页样式优化 */
.basic-data-management .el-pagination {
  text-align: center;
  margin-top: 20px;
}

.basic-data-management .el-pagination .btn-next,
.basic-data-management .el-pagination .btn-prev {
  border-radius: 6px;
}

.basic-data-management .el-pagination .el-pager li {
  border-radius: 6px;
  margin: 0 2px;
}

.basic-data-management .el-pagination .el-pager li.active {
  background: linear-gradient(135deg, #409EFF, #36A3F7);
  color: white;
}

/* 标签样式优化 */
.basic-data-management .el-tag {
  border-radius: 12px;
  font-weight: 500;
  padding: 4px 12px;
  border: none;
}

.basic-data-management .el-tag--success {
  background: linear-gradient(135deg, #67c23a, #85ce61);
  color: white;
}

.basic-data-management .el-tag--info {
  background: linear-gradient(135deg, #909399, #a6a9ad);
  color: white;
}

/* 暗色主题 - 按钮样式 */
.theme-dark .basic-data-management .operate-item {
  background: linear-gradient(135deg, #666666, #808080);
}

.theme-dark .basic-data-management .operate-item:hover {
  background: linear-gradient(135deg, #808080, #909399);
}

/* 马卡龙主题 - 按钮样式 */
.theme-macaron .basic-data-management .operate-item {
  background: linear-gradient(135deg, #8b4789, #a05a9e);
}

.theme-macaron .basic-data-management .operate-item:hover {
  background: linear-gradient(135deg, #a05a9e, #b66bb0);
}

/* 清新绿主题 - 按钮样式 */
.theme-fresh-green .basic-data-management .operate-item {
  background: linear-gradient(135deg, #1e7e34, #28a745);
}

.theme-fresh-green .basic-data-management .operate-item:hover {
  background: linear-gradient(135deg, #28a745, #34ce57);
}

/* 复古黄主题 - 按钮样式 */
.theme-retro-yellow .basic-data-management .operate-item {
  background: linear-gradient(135deg, #8b4513, #a0522d);
}

.theme-retro-yellow .basic-data-management .operate-item:hover {
  background: linear-gradient(135deg, #a0522d, #b8651f);
}

/* 暗色主题 - 表格和其他元素 */
.theme-dark .basic-data-management .el-table {
  background-color: #2d2d2d;
  color: #ffffff;
}

.theme-dark .basic-data-management .el-table th {
  background: #3d3d3d !important;
  color: #ffffff !important;
  border-bottom-color: #666666 !important;
}

.theme-dark .basic-data-management .el-table td {
  background-color: #2d2d2d !important;
  color: #ffffff !important;
  border-bottom-color: #404040 !important;
}

.theme-dark .basic-data-management .el-table tbody tr:hover {
  background: #404040 !important;
}

.theme-dark .basic-data-management .el-pagination {
  color: #ffffff;
}

.theme-dark .basic-data-management .el-pagination .el-pager li {
  background: #404040;
  color: #ffffff;
  border-color: #606266;
}

.theme-dark .basic-data-management .el-pagination .el-pager li:hover {
  background: #666666;
  color: #ffffff;
}

.theme-dark .basic-data-management .el-pagination .el-pager li.active {
  background: linear-gradient(135deg, #666666, #808080);
  color: white;
}

.theme-dark .basic-data-management .el-pagination .btn-prev,
.theme-dark .basic-data-management .el-pagination .btn-next {
  background: #404040;
  color: #ffffff;
}

.theme-dark .basic-data-management .el-pagination .btn-prev:hover,
.theme-dark .basic-data-management .el-pagination .btn-next:hover {
  background: #666666;
  color: #ffffff;
}

/* 马卡龙主题 - 表格和其他元素 */
.theme-macaron .basic-data-management .el-table th {
  border-bottom-color: #8b4789 !important;
}

.theme-macaron .basic-data-management .el-pagination .el-pager li.active {
  background: linear-gradient(135deg, #8b4789, #a05a9e);
  color: white;
}

/* 清新绿主题 - 表格和其他元素 */
.theme-fresh-green .basic-data-management .el-table th {
  border-bottom-color: #1e7e34 !important;
}

.theme-fresh-green .basic-data-management .el-pagination .el-pager li.active {
  background: linear-gradient(135deg, #1e7e34, #28a745);
  color: white;
}

/* 复古黄主题 - 表格和其他元素 */
.theme-retro-yellow .basic-data-management .el-table th {
  border-bottom-color: #8b4513 !important;
}

.theme-retro-yellow .basic-data-management .el-pagination .el-pager li.active {
  background: linear-gradient(135deg, #8b4513, #a0522d);
  color: white;
}
</style>
