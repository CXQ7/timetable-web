<template>
  <el-card shadow="never" class="course-management">
    <div slot="header" class="clearfix">
      <span>课程</span>
    </div>
    <el-row class="search-container">
      <el-col :span="18">
      </el-col>
      <el-col :span="6">
        <el-button type="primary" size="small" class="operate-item" @click="saveCourseVisible=true">新增</el-button>
      </el-col>
    </el-row>

    <div v-loading="loading">
      <el-table stripe border :data="data.records">
        <el-table-column type="index" label="序号" width="150"></el-table-column>
        <el-table-column prop="name" label="名称" width="200"></el-table-column>
        <el-table-column prop="duration" label="时长" width="150"></el-table-column>
        <el-table-column label="课程类型" width="150">
          <template slot-scope="scope">
            <el-tag :type="(scope.row.courseType === 1 || scope.row.courseType === '1') ? 'success' : 'info'" size="mini">
              {{ (scope.row.courseType === 1 || scope.row.courseType === '1') ? '必修' : (scope.row.courseType === 2 || scope.row.courseType === '2') ? '选修' : '必修' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="背景颜色">
          <template slot-scope="scope">
            <div v-if="scope.row.backgroundColor" :style="{height: '23px', width: '100%', borderRadius: '5px', backgroundColor: scope.row.backgroundColor}"></div>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="130">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showUpdate(scope.row.id)">编辑</el-button>
            <el-switch v-model="scope.row.enableState"
                       :active-value="1" :inactive-value="2"
                       style="margin-left: 10px;"
                       @change="updateEnableState($event, scope.row.id)"></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="current"
          :page-sizes="$consts.PAGE_SIZES"
          :page-size="size"
          style="margin-top: 10px;"
          layout="total, sizes, prev, pager, next"
          :total="data.total">
      </el-pagination>
    </div>
    <SaveCourse :visible="saveCourseVisible"
                 @on-close="saveCourseVisible=false"
                 @on-success="saveSuccess">
    </SaveCourse>
    <UpdateCourse :visible="updateCourseVisible"
                   :id="id"
                   @on-close="updateCourseVisible=false"
                   @on-success="updateSuccess">
    </UpdateCourse>
  </el-card>
</template>
<script>
import { mapActions } from 'vuex'
import SaveCourse from '@/views/course/SaveCourse'
import UpdateCourse from '@/views/course/UpdateCourse'

export default {
  name: 'Course',
  components: { UpdateCourse, SaveCourse },
  data () {
    return {
      data: [],
      params: {},
      form: {},
      current: 1,
      size: 10,
      saveCourseVisible: false,
      updateCourseVisible: false,
      id: '',
      loading: false
    }
  },
  methods: {
    ...mapActions(['GetCoursePage', 'UpdateCourseEnableStateById']),
    init () {
      this.params.enableState = 1
    },
    search () {
      this.params.current = this.current
      this.params.size = this.size
      this.loading = true
      this.GetCoursePage(this.params).then(res => {
        this.loading = false
        if (res) {
          this.data = res
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.size = val
      this.search()
    },
    handleCurrentChange (val) {
      this.current = val
      this.search()
    },
    saveSuccess () {
      this.search()
      this.saveCourseVisible = false
    },
    showUpdate (id) {
      this.id = id
      this.updateCourseVisible = true
    },
    updateSuccess () {
      this.search()
      this.updateCourseVisible = false
    },
    updateEnableState (enableState, id) {
      this.UpdateCourseEnableStateById({ id, enableState }).then(res => {
        this.search()
      })
    }
  },
  mounted () {
    this.init()
    this.search()
  }
}
</script>

<style>
/* 课程管理页面主题化样式 */
.course-management .el-card__header {
  background: #409EFF !important;
  color: white !important;
}

.course-management .search-container {
  margin-bottom: 20px;
}

.course-management .operate-item {
  float: right;
  background: linear-gradient(135deg, #409EFF, #36A3F7);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  padding: 10px 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.course-management .operate-item:hover {
  background: linear-gradient(135deg, #36A3F7, #2d8cf0);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.course-management .el-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.course-management .el-table th {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #409EFF;
}

.course-management .el-table tbody tr:hover {
  background: linear-gradient(135deg, #f8fbff, #ecf5ff);
}

.course-management .el-button--mini {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.course-management .el-button--mini:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.course-management .el-tag {
  border-radius: 12px;
  font-weight: 500;
  padding: 4px 12px;
  border: none;
}

.course-management .el-tag--success {
  background: linear-gradient(135deg, #67c23a, #85ce61);
  color: white;
}

.course-management .el-tag--info {
  background: linear-gradient(135deg, #909399, #a6a9ad);
  color: white;
}

/* 暗色主题 */
.theme-dark .course-management .el-card__header {
  background: #666666 !important;
  color: white !important;
}

.theme-dark .course-management .el-table {
  background-color: #2d2d2d;
  color: #ffffff;
}

.theme-dark .course-management .el-table th {
  background: #3d3d3d !important;
  color: #ffffff !important;
  border-bottom-color: #666666 !important;
}

.theme-dark .course-management .el-table td {
  background-color: #2d2d2d !important;
  color: #ffffff !important;
  border-bottom-color: #404040 !important;
}

.theme-dark .course-management .el-table tbody tr:hover {
  background: #404040 !important;
}

.theme-dark .course-management .operate-item {
  background: linear-gradient(135deg, #666666, #808080);
}

.theme-dark .course-management .operate-item:hover {
  background: linear-gradient(135deg, #808080, #909399);
}

/* 马卡龙主题 */
.theme-macaron .course-management .el-card__header {
  background: #8b4789 !important;
  color: white !important;
}

.theme-macaron .course-management .operate-item {
  background: linear-gradient(135deg, #8b4789, #a05a9e);
}

.theme-macaron .course-management .operate-item:hover {
  background: linear-gradient(135deg, #a05a9e, #b66bb0);
}

/* 清新绿主题 */
.theme-fresh-green .course-management .el-card__header {
  background: #1e7e34 !important;
  color: white !important;
}

.theme-fresh-green .course-management .operate-item {
  background: linear-gradient(135deg, #1e7e34, #28a745);
}

.theme-fresh-green .course-management .operate-item:hover {
  background: linear-gradient(135deg, #28a745, #34ce57);
}

/* 复古黄主题 */
.theme-retro-yellow .course-management .el-card__header {
  background: #8b4513 !important;
  color: white !important;
}

.theme-retro-yellow .course-management .operate-item {
  background: linear-gradient(135deg, #8b4513, #a0522d);
}

.theme-retro-yellow .course-management .operate-item:hover {
  background: linear-gradient(135deg, #a0522d, #b8651f);
}
</style>
