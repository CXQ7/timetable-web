<template>
  <el-card shadow="never" class="classroom-management">
    <div slot="header" class="clearfix">
      <span>教室</span>
    </div>
    <el-row class="search-container">
      <el-col :span="18">
        <el-radio-group v-model="params.enableState" size="small" @change="search">
          <el-radio-button :label="1">启用</el-radio-button>
          <el-radio-button :label="2">停用</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" size="small" class="operate-item" @click="saveClassroomVisible=true">新增</el-button>
      </el-col>
    </el-row>

    <div v-loading="loading">
      <el-table stripe border :data="data.records">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
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
    <SaveClassroom :visible="saveClassroomVisible"
                 @on-close="saveClassroomVisible=false"
                 @on-success="saveSuccess">
    </SaveClassroom>
    <UpdateClassroom :visible="updateClassroomVisible"
                   :id="id"
                   @on-close="updateClassroomVisible=false"
                   @on-success="updateSuccess">
    </UpdateClassroom>
  </el-card>
</template>
<script>
import { mapActions } from 'vuex'
import SaveClassroom from '@/views/classroom/SaveClassroom'
import UpdateClassroom from '@/views/classroom/UpdateClassroom'

export default {
  name: 'Classroom',
  components: { UpdateClassroom, SaveClassroom },
  data () {
    return {
      data: [],
      params: {},
      form: {},
      current: 1,
      size: 10,
      saveClassroomVisible: false,
      updateClassroomVisible: false,
      id: '',
      loading: false
    }
  },
  methods: {
    ...mapActions(['GetClassroomPage', 'UpdateClassroomEnableStateById']),
    init () {
      this.params.enableState = 1
    },
    search () {
      this.params.current = this.current
      this.params.size = this.size
      this.loading = true
      this.GetClassroomPage(this.params).then(res => {
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
      this.saveClassroomVisible = false
    },
    showUpdate (id) {
      this.id = id
      this.updateClassroomVisible = true
    },
    updateSuccess () {
      this.search()
      this.updateClassroomVisible = false
    },
    updateEnableState (enableState, id) {
      this.UpdateClassroomEnableStateById({ id, enableState }).then(res => {
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
/* 教室管理页面主题化样式 */
.classroom-management .el-card__header {
  background: #409EFF !important;
  color: white !important;
}

.classroom-management .search-container {
  margin-bottom: 20px;
}

.classroom-management .operate-item {
  float: right;
  background: linear-gradient(135deg, #409EFF, #36A3F7);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  padding: 10px 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.classroom-management .operate-item:hover {
  background: linear-gradient(135deg, #36A3F7, #2d8cf0);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.classroom-management .el-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.classroom-management .el-table th {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #409EFF;
}

.classroom-management .el-table tbody tr:hover {
  background: linear-gradient(135deg, #f8fbff, #ecf5ff);
}

.classroom-management .el-button--mini {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.classroom-management .el-button--mini:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

/* 暗色主题 */
.theme-dark .classroom-management .el-card__header {
  background: #666666 !important;
  color: white !important;
}

.theme-dark .classroom-management .el-table {
  background-color: #2d2d2d;
  color: #ffffff;
}

.theme-dark .classroom-management .el-table th {
  background: #3d3d3d !important;
  color: #ffffff !important;
  border-bottom-color: #666666 !important;
}

.theme-dark .classroom-management .el-table td {
  background-color: #2d2d2d !important;
  color: #ffffff !important;
  border-bottom-color: #404040 !important;
}

.theme-dark .classroom-management .el-table tbody tr:hover {
  background: #404040 !important;
}

.theme-dark .classroom-management .operate-item {
  background: linear-gradient(135deg, #666666, #808080);
}

.theme-dark .classroom-management .operate-item:hover {
  background: linear-gradient(135deg, #808080, #909399);
}

/* 马卡龙主题 */
.theme-macaron .classroom-management .el-card__header {
  background: #8b4789 !important;
  color: white !important;
}

.theme-macaron .classroom-management .operate-item {
  background: linear-gradient(135deg, #8b4789, #a05a9e);
}

.theme-macaron .classroom-management .operate-item:hover {
  background: linear-gradient(135deg, #a05a9e, #b66bb0);
}

/* 清新绿主题 */
.theme-fresh-green .classroom-management .el-card__header {
  background: #1e7e34 !important;
  color: white !important;
}

.theme-fresh-green .classroom-management .operate-item {
  background: linear-gradient(135deg, #1e7e34, #28a745);
}

.theme-fresh-green .classroom-management .operate-item:hover {
  background: linear-gradient(135deg, #28a745, #34ce57);
}

/* 复古黄主题 */
.theme-retro-yellow .classroom-management .el-card__header {
  background: #8b4513 !important;
  color: white !important;
}

.theme-retro-yellow .classroom-management .operate-item {
  background: linear-gradient(135deg, #8b4513, #a0522d);
}

.theme-retro-yellow .classroom-management .operate-item:hover {
  background: linear-gradient(135deg, #a0522d, #b8651f);
}
</style>
