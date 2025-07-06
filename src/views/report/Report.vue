<template>
  <div class="report-container">
    <div class="date-picker-container">
      <el-date-picker :clearable="false"
                      :picker-options="pickerOptions"
                      v-model="dates"
                      type="daterange"
                      range-separator="至"
                      class="theme-date-picker">
      </el-date-picker>
    </div>
    <el-tabs active-name="teacherCourse" type="card" class="theme-tabs">
      <el-tab-pane label="老师上课数" name="teacherCourse">
        <TeacherCourseCountReport :startDate="startDate" :endDate="endDate"></TeacherCourseCountReport>
      </el-tab-pane>
      <el-tab-pane label="课程数" name="course">
        <CourseCountReport :startDate="startDate" :endDate="endDate"></CourseCountReport>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import moment from 'moment'
import TeacherCourseCountReport from '@/views/report/TeacherCourseCountReport'
import CourseCountReport from '@/views/report/CourseCountReport'

export default {
  name: 'Report',
  components: { CourseCountReport, TeacherCourseCountReport },
  computed: {
    startDate () {
      return moment(this.dates[0]).format('YYYY-MM-DD')
    },
    endDate () {
      return moment(this.dates[1]).format('YYYY-MM-DD')
    }
  },
  data () {
    return {
      pickerOptions: {
        firstDayOfWeek: 1,
        shortcuts: [
          {
            text: '本周',
            onClick (picker) {
              picker.$emit('pick', [moment().week(moment().week()).startOf('isoweek'), moment().week(moment().week()).endOf('isoweek')])
            }
          },
          {
            text: '本月',
            onClick (picker) {
              picker.$emit('pick', [moment().month(moment().month()).startOf('month'), moment().month(moment().month()).endOf('month')])
            }
          },
          {
            text: '本年',
            onClick (picker) {
              picker.$emit('pick', [moment().year(moment().year()).startOf('year'), moment().year(moment().year()).endOf('year')])
            }
          }
        ]
      },
      data: [],
      dates: [],
      loading: false
    }
  },
  methods: {
    ...mapActions([]),
    init () {
      this.$set(this, 'dates', [moment().month(moment().month()).startOf('month'), moment().month(moment().month()).endOf('month')])
    },
    search () {

    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
.report-container {
  padding: 20px;
}

.date-picker-container {
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.date-picker-container:hover {
  border-color: #409EFF;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.theme-date-picker {
  width: 100%;
}

.theme-tabs {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* 深色主题样式 */
.theme-dark .date-picker-container {
  background: #2d2d2d;
  border-color: #404040;
}

.theme-dark .date-picker-container:hover {
  border-color: #409EFF;
}

.theme-dark .theme-tabs {
  background: #2d2d2d;
}
</style>
