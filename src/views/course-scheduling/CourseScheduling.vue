<template>
  <div id="course-scheduling">
    <div>
      <el-row>
        <el-col :span="20">
          <el-form inline>
            <el-form-item label="教室：">
              <el-select ref="classroomSelect" clearable multiple size="mini" style="width: 250px;" v-model="params.classroomIdList" @change="search">
                <el-option v-for="item in classroomData" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程：">
              <el-select ref="courseSelect" clearable multiple size="mini" style="width: 250px;" v-model="params.courseIdList" @change="search">
                <el-option v-for="item in courseData" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="老师：">
              <el-select ref="teacherSelect" clearable multiple size="mini" style="width: 250px;" v-model="params.teacherIdList" @change="search">
                <el-option v-for="item in teacherData" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="small" class="animated-button" style="float: right" @click="handleExportClick">导出</el-button>
          <el-button type="primary" size="small" class="animated-button" style="float: right; margin-right: 10px;" @click="handleBatchSchedulingClick">排课</el-button>
          <el-dropdown>
            <el-button type="primary" size="small" class="animated-button" style="float: right; margin-right: 10px;">
              主题风格<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="animated-dropdown-item" @click.native="switchTheme('default')">简约蓝白</el-dropdown-item>
              <el-dropdown-item class="animated-dropdown-item" @click.native="switchTheme('theme-macaron')">马卡龙</el-dropdown-item>
              <el-dropdown-item class="animated-dropdown-item" @click.native="switchTheme('theme-dark')">暗色风</el-dropdown-item>
              <el-dropdown-item class="animated-dropdown-item" @click.native="switchTheme('theme-fresh-green')">清新绿</el-dropdown-item>
              <el-dropdown-item class="animated-dropdown-item" @click.native="switchTheme('theme-retro-yellow')">复古黄</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      <FullCalendar ref="fullCalendar" :options="calendarOptions"></FullCalendar>
    </div>
    <transition name="fade" mode="out-in">
      <SaveCourseScheduling v-if="saveCourseSchedulingVisible"
                            :visible="saveCourseSchedulingVisible"
                            :date="currentDate"
                            :attendTime="currentAttendTime"
                            @on-close="saveCourseSchedulingVisible=false"
                            @on-success="saveSuccess">
      </SaveCourseScheduling>
    </transition>
    <transition name="fade" mode="out-in">
      <ViewCourseScheduling v-if="viewCourseSchedulingVisible"
                            :visible="viewCourseSchedulingVisible"
                            :id="id"
                            @on-success="updateSuccess"
                            @on-close="viewCourseSchedulingVisible=false"></ViewCourseScheduling>
    </transition>
    <transition name="fade" mode="out-in">
      <BatchSaveCourseScheduling v-if="saveBatchCourseSchedulingVisible"
                                 :visible="saveBatchCourseSchedulingVisible"
                                 @on-close="saveBatchCourseSchedulingVisible=false"
                                 @on-success="saveBatchSuccess">
      </BatchSaveCourseScheduling>
    </transition>
    <transition name="fade" mode="out-in">
      <ExportCourseScheduling v-if="exportCourseSchedulingVisible"
                              :visible="exportCourseSchedulingVisible"
                              @on-close="exportCourseSchedulingVisible=false"
                              @on-success="exportCourseSchedulingVisible=false">
      </ExportCourseScheduling>
    </transition>
  </div>
</template>
<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment'
import { mapActions } from 'vuex'
import SaveCourseScheduling from '@/views/course-scheduling/SaveCourseScheduling'
import ViewCourseScheduling from '@/views/course-scheduling/ViewCourseScheduling'
import BatchSaveCourseScheduling from '@/views/course-scheduling/BatchSaveCourseScheduling'
import ExportCourseScheduling from '@/views/course-scheduling/ExportCourseScheduling'

export default {
  name: 'CourseScheduling',
  components: {
    ExportCourseScheduling,
    BatchSaveCourseScheduling,
    ViewCourseScheduling,
    SaveCourseScheduling,
    FullCalendar
  },
  data () {
    return {
      courseCountObj: {},
      weekList: [],
      classroomData: [],
      courseData: [],
      teacherData: [],
      params: {},
      saveCourseSchedulingVisible: false,
      viewCourseSchedulingVisible: false,
      saveBatchCourseSchedulingVisible: false,
      exportCourseSchedulingVisible: false,
      id: 0,
      currentDate: '',
      currentAttendTime: '',
      currentTheme: localStorage.getItem('theme') || 'default',
      calendarEvents: []
    }
  },
  computed: {
    calendarOptions () {
      return {
        plugins: [dayGridPlugin, listPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek',
        locale: 'zh',
        // 每周开始是周几，Sunday=0, Monday=1
        firstDay: '1',
        // 时间轴间距
        slotMinTime: '07:00',
        slotMaxTime: '21:00',
        slotDuration: '00:' + this.$consts.COURSE_DURATION_STEP_MINUTE + ':00',
        // 是否显示第几周
        // weekNumbers: true,
        // weekText: '周',
        // 是否显示当前时间标记
        nowIndicator: true,
        // 是否显示全天插槽
        allDaySlot: false,
        // 日期否可点击
        navLinks: true,
        // 月视图，是否为指定周数高度，true 6周高度
        fixedWeekCount: false,
        // 月视图，是否显示非本月日期
        showNonCurrentDates: false,
        // 月视图，限制每天显示最大事件数，不包括+more链接，false 全部显示，true 限制为日单元格的高度，number 限制为指定行数高度
        dayMaxEvents: true,
        // 与dayMaxEvents类似，区别为包括+more链接
        // dayMaxEventRows: true,
        // 是否可拖拽
        editable: true,
        events: this.calendarEvents,
        customButtons: {
          addCourse: {
            text: '新增课程',
            click: this.handleAddCourseClick
          }
        },
        headerToolbar: {
          start: 'addCourse prev,next today',
          center: 'title',
          end: 'timeGridDay,timeGridWeek,dayGridMonth'
        },
        buttonText: {
          today: '今天',
          month: '月',
          week: '周',
          day: '日',
          list: '周列表'
        },
        slotLabelFormat: {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        },
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        },
        datesSet: this.datesSet,
        dayHeaderContent: this.dayHeaderContent,
        eventClick: this.handleEventClick,
        dateClick: this.handleDateClick,
        // 当事件拖动时触发
        eventDragStart: this.eventDragStart,
        // 当事件拖动停止时触发
        eventDragStop: this.eventDragStop,
        // 当拖动停止并且事件移动到不同的日子/时间时触发
        eventDrop: this.eventDrop,
        // 当外部可拖动元素或来自另一个日历的事件被拖放到该日历中时调用
        drop: this.drop,
        // 当带有关联事件数据的外部可拖动元素拖放到日历中时调用，或来自另一个日历的事件
        eventReceive: this.eventReceive,
        // 当一个日历上的事件即将拖放到另一个日历上时触发
        eventLeave: this.eventLeave,
        // 开始缩放时触发
        eventResizeStart: this.eventResizeStart,
        // 停止缩放时触发
        eventResizeStop: this.eventResizeStop,
        // 当缩放停止且事件持续时间发生更改时触发
        eventResize: this.eventResize
      }
    }
  },
  methods: {
    ...mapActions(['GetClassroomRefList', 'GetCourseRefList', 'GetTeacherRefList', 'GetCourseSchedulingList', 'UpdateCourseSchedulingTimeById', 'GetCourseSchedulingCourseCount']),
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
      this.search()
    },
    search () {
      this.params.startDate = moment(this.$refs.fullCalendar.getApi().view.currentStart).format('YYYY-MM-DD')
      this.params.endDate = moment(this.$refs.fullCalendar.getApi().view.currentEnd).endOf('month').format('YYYY-MM-DD')
      this.GetCourseSchedulingList(this.params).then(res => {
        if (res) {
          this.calendarEvents = []
          res.forEach(item => {
            this.calendarEvents.push({
              id: item.id,
              title: item.courseName + ' ' + item.classroomName + ' ' + item.teacherName,
              start: item.date + ' ' + item.attendTime,
              end: item.date + ' ' + item.finishTime,
              extendedProps: item,
              backgroundColor: item.backgroundColor
            })
          })
        }
      }).catch(() => {
      })
      this.GetCourseSchedulingCourseCount(this.params).then(res => {
        if (res) {
          this.courseCountObj = res
        }
      }).catch(() => {
      })
    },
    saveSuccess () {
      this.$message.success('课程添加成功！')
      this.search()
      this.saveCourseSchedulingVisible = false
    },
    saveBatchSuccess () {
      this.$message.success('批量排课成功！')
      this.search()
      this.saveBatchCourseSchedulingVisible = false
    },
    updateSuccess () {
      this.$message.success('课程更新成功！')
      this.search()
      this.viewCourseSchedulingVisible = false
    },
    datesSet (info) {
      this.search()
    },
    dayHeaderContent (info) {
      if (info.view.type === 'dayGridMonth') {
        return { html: `<div class="fc-scrollgrid-sync-inner"><a class="fc-col-header-cell-cushion">${info.text}</a></div>` }
      } else if (info.view.type === 'timeGridWeek') {
        return {
          html: `<div class="fc-scrollgrid-sync-inner">
                    <a class="fc-col-header-cell-cushion"
                        data-navlink="{&quot;date&quot;:&quot;${moment(info.date).format('YYYY-MM-DD')}&quot;,&quot;type&quot;:&quot;day&quot;}" tabindex="0">${info.text}</a>
                    <span id="tams-course-count-${moment(info.date).format('YYYY-MM-DD')}" style="cursor: default;">${this.getCourseCount(info.date)}</span>节课
                </div>`
        }
      } else if (info.view.type === 'timeGridDay') {
        return {
          html: `<div class="fc-scrollgrid-sync-inner">
                     <a class="fc-col-header-cell-cushion">${info.text}</a>
                     <span id="tams-course-count-${moment(info.date).format('YYYY-MM-DD')}" style="cursor: default;">${this.getCourseCount(info.date)}</span>节课
                 </div>`
        }
      } else if (info.view.type === 'listWeek') {
        return {
          html: `<a class="fc-list-day-text"
                      data-navlink="${info.navLinkData.replace(/"/g, '&quot;')}" tabindex="0">${info.text}</a>
                 <a class="fc-list-day-side-text"
                      data-navlink="${info.navLinkData.replace(/"/g, '&quot;')}" tabindex="0">${info.sideText}</a>`
        }
      }
      return 'unknown view type'
    },
    getCourseCount (date) {
      const count = this.courseCountObj[moment(date).format('YYYY-MM-DD')]
      return count || 0
    },
    handleEventClick (info) {
      this.id = info.event.id
      this.viewCourseSchedulingVisible = true
    },
    handleDateClick (info) {
      this.currentDate = moment(info.date).format('YYYY-MM-DD')
      const infoDate = moment(info.date)
      if (infoDate.hour() > 0) {
        this.currentAttendTime = infoDate.format('HH:mm')
      }
      this.saveCourseSchedulingVisible = true
    },
    handleAddCourseClick () {
      // 设置默认日期为今天
      this.currentDate = moment().format('YYYY-MM-DD')
      // 设置默认时间为上午8点
      this.currentAttendTime = '08:00'
      this.saveCourseSchedulingVisible = true
    },

    handleExportClick () {
      this.$message.info('正在准备导出...')
      setTimeout(() => {
        this.exportCourseSchedulingVisible = true
      }, 300)
    },
    handleBatchSchedulingClick () {
      this.$message.info('正在打开排课界面...')
      setTimeout(() => {
        this.saveBatchCourseSchedulingVisible = true
      }, 300)
    },
    eventDragStart (info) {
      console.log('eventDragStart', info)
    },
    eventDragStop (info) {
      console.log('eventDragStop', info)
    },
    eventDrop (info) {
      console.log('eventDrop', info)
      this.UpdateCourseSchedulingTimeById({
        id: info.event.id,
        data: {
          date: moment(info.event.start).format('YYYY-MM-DD'),
          attendTime: moment(info.event.start).format('HH:mm:ss'),
          finishTime: moment(info.event.end).format('HH:mm:ss')
        }
      }).then(res => {
        this.search()
      }).catch(() => {
        this.search()
      })
    },
    drop (info) {
      console.log('drop', info)
    },
    eventReceive (info) {
      console.log('eventReceive', info)
    },
    eventLeave (info) {
      console.log('eventLeave', info)
    },
    eventResizeStart (info) {
      console.log('eventResizeStart', info)
    },
    eventResizeStop (info) {
      console.log('eventResizeStop', info)
    },
    eventResize (info) {
      console.log('eventResize', info)
      this.UpdateCourseSchedulingTimeById({
        id: info.event.id,
        data: {
          date: moment(info.event.start).format('YYYY-MM-DD'),
          attendTime: moment(info.event.start).format('HH:mm:ss'),
          finishTime: moment(info.event.end).format('HH:mm:ss')
        }
      }).then(res => {
        this.search()
      }).catch(() => {
        this.search()
      })
    },
    switchTheme (themeClass) {
      this.currentTheme = themeClass
      localStorage.setItem('theme', themeClass)

      // 添加切换动画效果
      document.body.style.transition = 'all 0.3s ease'

      this.applyTheme(themeClass)

      // 显示主题切换成功的提示
      const themeNames = {
        default: '简约蓝白',
        'theme-macaron': '马卡龙',
        'theme-dark': '暗色风',
        'theme-fresh-green': '清新绿',
        'theme-retro-yellow': '复古黄'
      }
      this.$message.success(`已切换到${themeNames[themeClass]}主题`)
      // 移除过渡效果
      setTimeout(() => {
        document.body.style.transition = ''
      }, 300)
    },
    applyTheme (themeClass) {
      document.body.className = ''
      if (themeClass && themeClass !== 'default') {
        document.body.classList.add(themeClass)
      }
    }
  },
  mounted () {
    this.init()
    this.applyTheme(this.currentTheme)
  }
}
</script>

<style scoped>
/* 按钮动画效果 */
.animated-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  transform: translateZ(0);
}

.animated-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.animated-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* 按钮点击涟漪效果 */
.animated-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

.animated-button:active::after {
  width: 120%;
  height: 120%;
}

/* 下拉菜单项动画效果 */
.animated-dropdown-item {
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.animated-dropdown-item:hover {
  background: linear-gradient(90deg, #409EFF, #66B1FF);
  color: white;
  transform: translateX(5px);
}

.animated-dropdown-item:active {
  transform: translateX(2px);
}

/* 弹窗过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 日历事件悬停效果 */
.fc-event:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

/* 日历按钮悬停效果 */
.fc-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.fc-button:active {
  transform: translateY(0);
}

/* 加载动画效果 */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
.pulse-animation {
  animation: pulse 1s infinite;
}
/* 成功动画效果 */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.bounce-animation {
  animation: bounce 0.6s ease;
}
/* 主题切换过渡效果 */
body {
  transition: background-color 0.3s ease, color 0.3s ease;
}
/* 选择器悬停效果 */
.el-select:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}
/* 表单项标签动画效果 */
.el-form-item__label {
  transition: all 0.2s ease;
}
.el-form-item:hover .el-form-item__label {
  color: #409EFF;
  transform: translateX(2px);
}
/* 响应式动画 */
@media (max-width: 768px) {
  .animated-button:hover {
    transform: none;
    box-shadow: none;
  }
  .animated-dropdown-item:hover {
    transform: none;
  }
}
</style>
