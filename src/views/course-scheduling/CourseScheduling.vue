<template>
  <div id="course-scheduling">
    <div>
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="18">
          <el-form inline>
            <el-form-item label="教室：">
              <el-select
                ref="classroomSelect"
                clearable
                multiple
                size="mini"
                style="width: 200px"
                v-model="params.classroomIdList"
                @change="search"
              >
                <el-option
                  v-for="item in classroomData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程：">
              <el-select
                ref="courseSelect"
                clearable
                multiple
                size="mini"
                style="width: 200px"
                v-model="params.courseIdList"
                @change="search"
              >
                <el-option
                  v-for="item in courseData"
                  :key="item.id"
                  :value="item.id"
                >
                  <span>{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 11px">
                    {{
                      item.courseType === 1 || item.courseType === "1"
                        ? "必修"
                        : item.courseType === 2 || item.courseType === "2"
                        ? "选修"
                        : "必修"
                    }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="老师：">
              <el-select
                ref="teacherSelect"
                clearable
                multiple
                size="mini"
                style="width: 200px"
                v-model="params.teacherIdList"
                @change="search"
              >
                <el-option
                  v-for="item in teacherData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <div style="text-align: right; white-space: nowrap">
            <el-dropdown style="margin-right: 8px; display: inline-block">
              <el-button type="primary" size="small">
                主题风格<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="switchTheme('default')"
                  >简约蓝白</el-dropdown-item
                >
                <el-dropdown-item @click.native="switchTheme('theme-macaron')"
                  >马卡龙</el-dropdown-item
                >
                <el-dropdown-item @click.native="switchTheme('theme-dark')"
                  >暗色风</el-dropdown-item
                >
                <el-dropdown-item
                  @click.native="switchTheme('theme-fresh-green')"
                  >清新绿</el-dropdown-item
                >
                <el-dropdown-item
                  @click.native="switchTheme('theme-retro-yellow')"
                  >复古黄</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              type="primary"
              size="small"
              style="margin-right: 8px"
              @click="saveBatchCourseSchedulingVisible = true"
              >新增课程</el-button
            >
            <el-button
              type="primary"
              size="small"
              style="margin-right: 8px"
              @click="importCourseSchedulingVisible = true"
              >导入</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="exportCourseSchedulingVisible = true"
              >导出</el-button
            >
          </div>
        </el-col>
      </el-row>
      <FullCalendar
        ref="fullCalendar"
        :options="calendarOptions"
      ></FullCalendar>
    </div>
    <SaveCourseScheduling
      :visible="saveCourseSchedulingVisible"
      :date="currentDate"
      :attendTime="currentAttendTime"
      @on-close="saveCourseSchedulingVisible = false"
      @on-success="saveSuccess"
    >
    </SaveCourseScheduling>
    <ViewCourseScheduling
      :visible="viewCourseSchedulingVisible"
      :id="id"
      @on-success="updateSuccess"
      @on-close="viewCourseSchedulingVisible = false"
    ></ViewCourseScheduling>
    <BatchSaveCourseScheduling
      :visible="saveBatchCourseSchedulingVisible"
      @on-close="saveBatchCourseSchedulingVisible = false"
      @on-success="saveBatchSuccess"
    >
    </BatchSaveCourseScheduling>
    <ExportCourseScheduling
      :visible="exportCourseSchedulingVisible"
      @on-close="exportCourseSchedulingVisible = false"
      @on-success="exportCourseSchedulingVisible = false"
    >
    </ExportCourseScheduling>
    <ImportCourseScheduling
      :visible="importCourseSchedulingVisible"
      @on-close="importCourseSchedulingVisible = false"
      @on-success="importSuccess"
    >
    </ImportCourseScheduling>
  </div>
</template>
<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import SaveCourseScheduling from '@/views/course-scheduling/SaveCourseScheduling'
import ViewCourseScheduling from '@/views/course-scheduling/ViewCourseScheduling'
import BatchSaveCourseScheduling from '@/views/course-scheduling/BatchSaveCourseScheduling'
import ExportCourseScheduling from '@/views/course-scheduling/ExportCourseScheduling'
import ImportCourseScheduling from '@/views/course-scheduling/ImportCourseScheduling'

export default {
  name: 'CourseScheduling',
  components: {
    ExportCourseScheduling,
    ImportCourseScheduling,
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
      importCourseSchedulingVisible: false,
      id: 0,
      currentDate: '',
      currentAttendTime: '',
      currentTheme: localStorage.getItem('theme') || 'default',
      searchTimeout: null,
      calendarOptions: {
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
        events: [],
        headerToolbar: {
          start: 'prev,next today',
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
        eventResize: this.eventResize,
        // 自定义事件显示内容
        eventContent: this.eventContent,
        dayCellDidMount: this.handleDayCellDidMount
      }
    }
  },
  computed: {
    ...mapGetters('settings', [
      'getShowTeacher',
      'getShowClassroom',
      'getShowSaturday',
      'getShowSunday',
      'getShowNonCurrentWeek',
      'getScheduleSettings'
    ]),
    calendarHiddenDays () {
      const hidden = []
      if (!this.getShowSunday) hidden.push(0)
      if (!this.getShowSaturday) hidden.push(6)
      return hidden
    },
    calendarShowNonCurrentDates () {
      return !!this.getShowNonCurrentWeek
    },
    firstWeekDayDate () {
      // 取settings里的firstWeekDay，格式化为YYYY-MM-DD
      const d = this.getScheduleSettings.firstWeekDay
      console.log('firstWeekDay raw value:', d, typeof d)
      if (!d) {
        console.log('firstWeekDay is empty')
        return null
      }

      let date
      if (typeof d === 'string') {
        // 如果是字符串，直接取前10位
        date = d.slice(0, 10)
      } else if (d instanceof Date) {
        // 如果是Date对象
        date = moment(d).format('YYYY-MM-DD')
      } else {
        // 其他情况，尝试用moment解析
        date = moment(d).format('YYYY-MM-DD')
      }

      console.log('firstWeekDay formatted:', date)
      return date
    }
  },
  watch: {
    calendarHiddenDays: {
      handler (val) {
        this.calendarOptions.hiddenDays = val
      },
      immediate: true
    },
    calendarShowNonCurrentDates: {
      handler (val) {
        this.calendarOptions.showNonCurrentDates = val
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions([
      'GetClassroomRefList',
      'GetCourseRefList',
      'GetTeacherRefList',
      'GetCourseSchedulingList',
      'UpdateCourseSchedulingTimeById',
      'GetCourseSchedulingCourseCount'
    ]),
    init () {
      this.GetClassroomRefList()
        .then((res) => {
          if (res) {
            this.classroomData = res
          }
        })
        .catch(() => {})
      this.GetCourseRefList()
        .then((res) => {
          if (res) {
            this.courseData = res
          }
        })
        .catch(() => {})
      this.GetTeacherRefList()
        .then((res) => {
          if (res) {
            this.teacherData = res
          }
        })
        .catch(() => {})
      // 延迟搜索，确保FullCalendar已经完全初始化
      this.$nextTick(() => {
        setTimeout(() => {
          this.search()
        }, 200)
      })
    },
    search () {
      // 检查FullCalendar是否已经初始化
      if (!this.$refs.fullCalendar || !this.$refs.fullCalendar.getApi) {
        return
      }

      try {
        const calendarApi = this.$refs.fullCalendar.getApi()
        this.params.startDate = moment(calendarApi.view.currentStart).format(
          'YYYY-MM-DD'
        )
        this.params.endDate = moment(calendarApi.view.currentEnd)
          .endOf('month')
          .format('YYYY-MM-DD')

        this.GetCourseSchedulingList(this.params)
          .then((res) => {
            if (res && this.$refs.fullCalendar) {
              // 使用FullCalendar API来更新事件，避免频闪
              const calendarApi = this.$refs.fullCalendar.getApi()

              // 移除所有现有事件
              calendarApi.removeAllEvents()

              // 批量添加新事件
              const newEvents = res.map((item) => ({
                id: item.id,
                title: `${item.courseName} - ${item.classroomName} - ${item.teacherName}`,
                start: item.date + ' ' + item.attendTime,
                end: item.date + ' ' + item.finishTime,
                extendedProps: {
                  ...item,
                  courseName: item.courseName,
                  classroomName: item.classroomName,
                  teacherName: item.teacherName,
                  remarks: item.remarks
                },
                backgroundColor: item.backgroundColor,
                borderColor: item.backgroundColor
              }))

              // 批量添加事件
              newEvents.forEach((event) => {
                calendarApi.addEvent(event)
              })
            }
          })
          .catch(() => {})

        this.GetCourseSchedulingCourseCount(this.params)
          .then((res) => {
            if (res) {
              this.courseCountObj = res
            }
          })
          .catch(() => {})
      } catch (error) {
        console.warn('Calendar API not ready:', error)
      }
    },
    saveSuccess () {
      this.search()
      this.saveCourseSchedulingVisible = false
    },
    saveBatchSuccess () {
      this.search()
      this.saveBatchCourseSchedulingVisible = false
    },
    updateSuccess () {
      this.search()
      this.viewCourseSchedulingVisible = false
    },
    importSuccess () {
      this.search()
      this.importCourseSchedulingVisible = false
    },
    datesSet (info) {
      // 添加防抖，避免频繁调用
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {
        this.search()
      }, 100)
    },
    dayHeaderContent (info) {
      if (info.view.type === 'dayGridMonth') {
        return {
          html: `<div class="fc-scrollgrid-sync-inner"><a class="fc-col-header-cell-cushion">${info.text}</a></div>`
        }
      } else if (info.view.type === 'timeGridWeek') {
        // 自定义日期格式: 6月30 星期一
        const dateText = moment(info.date).format('M月D日 dddd')
        return {
          html: `<div class="fc-scrollgrid-sync-inner">
                    <a class="fc-col-header-cell-cushion"
                        data-navlink="{&quot;date&quot;:&quot;${moment(
                          info.date
                        ).format(
                          'YYYY-MM-DD'
                        )}&quot;,&quot;type&quot;:&quot;day&quot;}" tabindex="0">${dateText}</a>
                    <div style="font-size: 12px; color: #999; margin-top: 2px;">${this.getCourseCount(
                      info.date
                    )}节课</div>
                </div>`
        }
      } else if (info.view.type === 'timeGridDay') {
        // 自定义日期格式: 6月30 星期一
        const dateText = moment(info.date).format('M月D日 dddd')
        return {
          html: `<div class="fc-scrollgrid-sync-inner">
                     <a class="fc-col-header-cell-cushion">${dateText}</a>
                     <div style="font-size: 12px; color: #999; margin-top: 2px;">${this.getCourseCount(
                       info.date
                     )}节课</div>
                 </div>`
        }
      } else if (info.view.type === 'listWeek') {
        return {
          html: `<a class="fc-list-day-text"
                      data-navlink="${info.navLinkData.replace(
                        /"/g,
                        '&quot;'
                      )}" tabindex="0">${info.text}</a>
                 <a class="fc-list-day-side-text"
                      data-navlink="${info.navLinkData.replace(
                        /"/g,
                        '&quot;'
                      )}" tabindex="0">${info.sideText}</a>`
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
      })
        .then((res) => {
          this.search()
        })
        .catch(() => {
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
      })
        .then((res) => {
          this.search()
        })
        .catch(() => {
          this.search()
        })
    },
    switchTheme (themeClass) {
      this.currentTheme = themeClass
      localStorage.setItem('theme', themeClass)
      this.applyTheme(themeClass)
    },
    applyTheme (themeClass) {
      document.body.className = ''
      if (themeClass && themeClass !== 'default') {
        document.body.classList.add(themeClass)
      }
    },
    // 自定义事件显示内容
    eventContent (info) {
      const event = info.event
      const extendedProps = event.extendedProps || {}
      const viewType = info.view.type
      // 获取时间信息
      const startTime = moment(event.start).format('HH:mm')
      const endTime = moment(event.end).format('HH:mm')
      // 创建自定义HTML结构
      const eventElement = document.createElement('div')
      eventElement.className = `custom-event-content ${viewType}-view`
      // 控制显示内容
      const showTeacher = this.getShowTeacher
      const showClassroom = this.getShowClassroom
      // 根据视图类型调整布局
      let detailsHtml = ''
      detailsHtml += `<div class="event-course"><i class="el-icon-reading"></i><span>${
        extendedProps.courseName || ''
      }</span></div>`
      if (showClassroom) {
        detailsHtml += `<div class="event-location"><i class="el-icon-location-outline"></i><span>${
          extendedProps.classroomName || ''
        }</span></div>`
      }
      if (showTeacher) {
        detailsHtml += `<div class="event-teacher"><i class="el-icon-user"></i><span>${
          extendedProps.teacherName || ''
        }</span></div>`
      }
      if (extendedProps.remarks) {
        detailsHtml += `<div class="event-remarks"><i class="el-icon-document"></i><span>${extendedProps.remarks}</span></div>`
      }
      if (viewType === 'timeGridDay') {
        eventElement.innerHTML = `<div class="event-time">${startTime} - ${endTime}</div><div class="event-details-grid">${detailsHtml}</div>`
      } else {
        eventElement.innerHTML = `<div class="event-time">${startTime} - ${endTime}</div><div class="event-details">${detailsHtml}</div>`
      }
      return { domNodes: [eventElement] }
    },
    // 日历单元格挂载时，标注第一周的第一天
    handleDayCellDidMount (arg) {
      if (!this.firstWeekDayDate) {
        console.log('firstWeekDayDate is null, skipping')
        return
      }
      const cellDate = moment(arg.date).format('YYYY-MM-DD')
      console.log(
        'cellDate:',
        cellDate,
        'firstWeekDayDate:',
        this.firstWeekDayDate,
        'match:',
        cellDate === this.firstWeekDayDate
      )
      if (cellDate === this.firstWeekDayDate) {
        console.log('Adding first week day indicator to:', cellDate)
        // 创建红线和箭头
        const marker = document.createElement('div')
        marker.className = 'first-weekday-indicator'
        marker.innerHTML = '<div class="fw-arrow"></div>'
        arg.el.style.position = 'relative'
        arg.el.appendChild(marker)
      }
    }
  },
  mounted () {
    this.init()
    this.applyTheme(this.currentTheme)
  },
  beforeDestroy () {
    // 清除定时器
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  }
}
</script>

<style>
/* 自定义时间轴样式 - 适应主题变化 */
.fc-timegrid-slot-label {
  min-width: 90px !important;
  width: 90px !important;
  font-weight: bold !important;
  font-size: 18px !important;
  color: var(--primary-color) !important;
  text-align: center !important;
  padding: 8px 12px !important;
  background: linear-gradient(
    135deg,
    var(--card-bg) 0%,
    rgba(255, 255, 255, 0.1) 100%
  ) !important;
  border-right: 2px solid var(--primary-color) !important;
  transition: all 0.3s ease !important;
  position: relative !important;
  overflow: hidden !important;
}

.fc-timegrid-slot-label::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--primary-color) 50%,
    transparent 100%
  ) !important;
  opacity: 0.6;
}

/* 时间轴容器样式 */
.fc-timegrid-axis {
  min-width: 90px !important;
  width: 90px !important;
  background: linear-gradient(
    135deg,
    var(--card-bg) 0%,
    rgba(255, 255, 255, 0.05) 100%
  ) !important;
  transition: all 0.3s ease !important;
}

/* 时间轴文本样式 */
.fc-timegrid-axis-cushion {
  font-weight: bold !important;
  font-size: 18px !important;
  color: var(--primary-color) !important;
  text-align: center !important;
  padding: 8px 12px !important;
  transition: all 0.3s ease !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
}

/* 时间轴边框样式 */
.fc-timegrid-axis-frame {
  border-right: 2px solid var(--primary-color) !important;
  background: linear-gradient(
    135deg,
    var(--card-bg) 0%,
    rgba(255, 255, 255, 0.05) 100%
  ) !important;
  transition: all 0.3s ease !important;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1) !important;
}

/* 时间轴整体列宽度 */
.fc-timegrid-col-frame {
  border-right: 1px solid rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;
}

/* 时间轴文字悬停效果 */
.fc-timegrid-slot-label:hover {
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    rgba(255, 255, 255, 0.2) 100%
  ) !important;
  color: #fff !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
}

.fc-timegrid-slot-label:hover::before {
  opacity: 1 !important;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #ffffff 50%,
    transparent 100%
  ) !important;
}

/* 针对暗色主题的特殊处理 */
.theme-dark .fc-timegrid-col-frame {
  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.theme-dark .fc-timegrid-slot-label,
.theme-dark .fc-timegrid-axis-cushion {
  color: #ffffff !important;
  font-family: "Consolas", "Monaco", monospace !important;
  font-weight: 500 !important;
  font-size: 18px !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.theme-dark .fc-timegrid-slot-label {
  background: linear-gradient(
    135deg,
    #2c3e50 0%,
    rgba(255, 255, 255, 0.05) 100%
  ) !important;
}

.theme-dark .fc-timegrid-slot-label:hover {
  background: linear-gradient(
    135deg,
    #666666 0%,
    rgba(255, 255, 255, 0.1) 100%
  ) !important;
  color: #ffffff !important;
}

/* 针对马卡龙主题的特殊处理 */
.theme-macaron .fc-timegrid-slot-label,
.theme-macaron .fc-timegrid-axis-cushion {
  color: #8b4789 !important;
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  letter-spacing: 0.5px !important;
}

.theme-macaron .fc-timegrid-slot-label:hover {
  background-color: #ffb6b9 !important;
  color: #ffffff !important;
}

/* 针对清新绿主题的特殊处理 */
.theme-fresh-green .fc-timegrid-slot-label,
.theme-fresh-green .fc-timegrid-axis-cushion {
  color: #1e7e34 !important;
  font-family: "PingFang SC", "Hiragino Sans GB", sans-serif !important;
  font-weight: 600 !important;
  font-size: 16px !important;
}

.theme-fresh-green .fc-timegrid-slot-label:hover {
  background-color: #28c76f !important;
  color: #ffffff !important;
}

/* 针对复古黄主题的特殊处理 */
.theme-retro-yellow .fc-timegrid-slot-label,
.theme-retro-yellow .fc-timegrid-axis-cushion {
  color: #8b4513 !important;
  font-family: "Times New Roman", "SimSun", serif !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1) !important;
}

.theme-retro-yellow .fc-timegrid-slot-label:hover {
  background-color: #c29f42 !important;
  color: #ffffff !important;
}

/* 针对默认主题的特殊处理 */
.fc-timegrid-slot-label,
.fc-timegrid-axis-cushion {
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif !important;
}

body:not([class*="theme-"]) .fc-timegrid-slot-label:hover {
  background-color: var(--primary-color) !important;
  color: #ffffff !important;
}

/* 暗色主题 - 整体字体风格 */
.theme-dark .fc-toolbar-title,
.theme-dark .fc-button,
.theme-dark .fc-col-header-cell-cushion,
.theme-dark .fc-event-title,
.theme-dark .fc-list-day-text,
.theme-dark .fc-list-day-side-text,
.theme-dark .fc-daygrid-day-number {
  font-family: "Consolas", "Monaco", monospace !important;
  font-weight: 500 !important;
  font-size: 16px !important;
}

.theme-dark .fc-toolbar-title {
  color: #ffffff !important;
  font-size: 1.8em !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
}

.theme-dark .fc-col-header-cell-cushion {
  color: #ffffff !important;
  font-weight: 600 !important;
  font-size: 16px !important;
}

/* 马卡龙主题 - 整体字体风格 */
.theme-macaron .fc-toolbar-title,
.theme-macaron .fc-button,
.theme-macaron .fc-col-header-cell-cushion,
.theme-macaron .fc-event-title,
.theme-macaron .fc-list-day-text,
.theme-macaron .fc-list-day-side-text,
.theme-macaron .fc-daygrid-day-number {
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  letter-spacing: 0.3px !important;
}

.theme-macaron .fc-toolbar-title {
  color: #8b4789 !important;
  font-size: 1.9em !important;
  text-shadow: 0 1px 3px rgba(255, 182, 185, 0.5) !important;
}

.theme-macaron .fc-col-header-cell-cushion {
  color: #8b4789 !important;
  font-weight: 700 !important;
  font-size: 16px !important;
}

.theme-macaron .fc-event-title {
  color: #ffffff !important;
  font-weight: 600 !important;
}

/* 清新绿主题 - 整体字体风格 */
.theme-fresh-green .fc-toolbar-title,
.theme-fresh-green .fc-button,
.theme-fresh-green .fc-col-header-cell-cushion,
.theme-fresh-green .fc-event-title,
.theme-fresh-green .fc-list-day-text,
.theme-fresh-green .fc-list-day-side-text,
.theme-fresh-green .fc-daygrid-day-number {
  font-family: "PingFang SC", "Hiragino Sans GB", sans-serif !important;
  font-weight: 600 !important;
  font-size: 16px !important;
}

.theme-fresh-green .fc-toolbar-title {
  color: #1e7e34 !important;
  font-size: 1.8em !important;
  text-shadow: 0 1px 2px rgba(40, 199, 111, 0.3) !important;
}

.theme-fresh-green .fc-col-header-cell-cushion {
  color: #1e7e34 !important;
  font-weight: 700 !important;
  font-size: 16px !important;
}

.theme-fresh-green .fc-event-title {
  color: #ffffff !important;
  font-weight: 600 !important;
}

/* 复古黄主题 - 整体字体风格 */
.theme-retro-yellow .fc-toolbar-title,
.theme-retro-yellow .fc-button,
.theme-retro-yellow .fc-col-header-cell-cushion,
.theme-retro-yellow .fc-event-title,
.theme-retro-yellow .fc-list-day-text,
.theme-retro-yellow .fc-list-day-side-text,
.theme-retro-yellow .fc-daygrid-day-number {
  font-family: "Times New Roman", "SimSun", serif !important;
  font-weight: 600 !important;
  font-size: 16px !important;
}

.theme-retro-yellow .fc-toolbar-title {
  color: #8b4513 !important;
  font-size: 1.9em !important;
  text-shadow: 0 2px 3px rgba(194, 159, 66, 0.4) !important;
}

.theme-retro-yellow .fc-col-header-cell-cushion {
  color: #8b4513 !important;
  font-weight: 700 !important;
  font-size: 16px !important;
}

.theme-retro-yellow .fc-event-title {
  color: #ffffff !important;
  font-weight: 600 !important;
}

/* 默认主题 - 整体字体风格 */
body:not([class*="theme-"]) .fc-toolbar-title,
body:not([class*="theme-"]) .fc-button,
body:not([class*="theme-"]) .fc-col-header-cell-cushion,
body:not([class*="theme-"]) .fc-event-title,
body:not([class*="theme-"]) .fc-list-day-text,
body:not([class*="theme-"]) .fc-list-day-side-text,
body:not([class*="theme-"]) .fc-daygrid-day-number {
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif !important;
  font-size: 16px !important;
}

body:not([class*="theme-"]) .fc-toolbar-title {
  color: var(--primary-color) !important;
  font-weight: 600 !important;
  font-size: 1.8em !important;
}

body:not([class*="theme-"]) .fc-col-header-cell-cushion {
  color: var(--primary-color) !important;
  font-weight: 600 !important;
  font-size: 16px !important;
}

/* 通用样式优化 */
.fc-toolbar-title {
  transition: all 0.3s ease !important;
}

.fc-col-header-cell-cushion {
  transition: all 0.3s ease !important;
}

.fc-event-title {
  transition: all 0.3s ease !important;
}

/* 暗色主题 - 页面其他元素字体 */
.theme-dark .el-button,
.theme-dark .el-form-item__label,
.theme-dark .el-select .el-input__inner,
.theme-dark .el-dropdown-item {
  font-family: "Consolas", "Monaco", monospace !important;
  font-weight: 500 !important;
  font-size: 16px !important;
}

.theme-dark .el-button--primary {
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  font-size: 16px !important;
}

/* 马卡龙主题 - 页面其他元素字体 */
.theme-macaron .el-button,
.theme-macaron .el-form-item__label,
.theme-macaron .el-select .el-input__inner,
.theme-macaron .el-dropdown-item {
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  letter-spacing: 0.3px !important;
}

.theme-macaron .el-button--primary {
  font-weight: 700 !important;
  border-radius: 18px !important;
  font-size: 16px !important;
}

.theme-macaron .el-form-item__label {
  color: #8b4789 !important;
  font-weight: 700 !important;
  font-size: 16px !important;
}

/* 清新绿主题 - 页面其他元素字体 */
.theme-fresh-green .el-button,
.theme-fresh-green .el-form-item__label,
.theme-fresh-green .el-select .el-input__inner,
.theme-fresh-green .el-dropdown-item {
  font-family: "PingFang SC", "Hiragino Sans GB", sans-serif !important;
  font-weight: 600 !important;
  font-size: 16px !important;
}

.theme-fresh-green .el-button--primary {
  font-weight: 700 !important;
  border-radius: 8px !important;
  font-size: 16px !important;
}

.theme-fresh-green .el-form-item__label {
  color: #1e7e34 !important;
  font-weight: 700 !important;
  font-size: 16px !important;
}

/* 复古黄主题 - 页面其他元素字体 */
.theme-retro-yellow .el-button,
.theme-retro-yellow .el-form-item__label,
.theme-retro-yellow .el-select .el-input__inner,
.theme-retro-yellow .el-dropdown-item {
  font-family: "Times New Roman", "SimSun", serif !important;
  font-weight: 600 !important;
  font-size: 16px !important;
}

.theme-retro-yellow .el-button--primary {
  font-weight: 700 !important;
  border-radius: 4px !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
  font-size: 16px !important;
}

.theme-retro-yellow .el-form-item__label {
  color: #8b4513 !important;
  font-weight: 700 !important;
  font-size: 16px !important;
}

/* 默认主题 - 页面其他元素字体 */
body:not([class*="theme-"]) .el-button,
body:not([class*="theme-"]) .el-form-item__label,
body:not([class*="theme-"]) .el-select .el-input__inner,
body:not([class*="theme-"]) .el-dropdown-item {
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif !important;
  font-size: 16px !important;
}

body:not([class*="theme-"]) .el-form-item__label {
  color: var(--primary-color) !important;
  font-weight: 600 !important;
  font-size: 16px !important;
}

/* 全局字体过渡效果 */
.el-button,
.el-form-item__label,
.el-select .el-input__inner,
.el-dropdown-item {
  transition: all 0.3s ease !important;
  font-size: 16px !important;
}

/* 自定义事件显示样式 */
.custom-event-content {
  padding: 6px 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 15px;
  line-height: 1.4;
  word-wrap: break-word;
  overflow: hidden;
}

.custom-event-content .event-time {
  text-align: center;
  font-weight: bold;
  font-size: 17px;
  color: #fff;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 3px 6px;
  margin-bottom: 4px;
  white-space: nowrap;
}

.custom-event-content .event-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-height: 0;
}

.custom-event-content .event-details > div {
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  font-size: 14px;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-event-content .event-details > div:last-child {
  margin-bottom: 0;
}

.custom-event-content .event-details i {
  margin-right: 4px;
  font-size: 15px;
  flex-shrink: 0;
  opacity: 0.9;
}

.custom-event-content .event-details span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.custom-event-content .event-course {
  font-weight: bold;
}

.custom-event-content .event-location {
  font-style: italic;
}

.custom-event-content .event-teacher {
  font-weight: 500;
}

.custom-event-content .event-remarks {
  font-size: 13px;
  opacity: 0.9;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding-top: 3px;
  margin-top: 3px;
}

/* 针对不同视图的优化 */
.fc-timeGridWeek-view .custom-event-content,
.fc-timeGridDay-view .custom-event-content {
  font-size: 15px;
}

.fc-timeGridWeek-view .custom-event-content .event-time,
.fc-timeGridDay-view .custom-event-content .event-time {
  font-size: 17px;
}

.fc-timeGridWeek-view .custom-event-content .event-details > div,
.fc-timeGridDay-view .custom-event-content .event-details > div {
  font-size: 14px;
}

.fc-timeGridWeek-view .custom-event-content .event-details i,
.fc-timeGridDay-view .custom-event-content .event-details i {
  font-size: 15px;
}

/* 日视图特殊布局 - 网格分布 */
.timeGridDay-view .custom-event-content {
  padding: 8px 10px;
}

.timeGridDay-view .event-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 6px;
  margin-top: 6px;
  height: calc(100% - 40px);
}

.timeGridDay-view .event-details-grid > div {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4px 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.timeGridDay-view .event-details-grid > div:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.02);
}

.timeGridDay-view .event-details-grid .event-course {
  grid-column: 1 / -1;
  font-weight: bold;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.15);
}

.timeGridDay-view .event-details-grid .event-location {
  grid-column: 1 / 2;
}

.timeGridDay-view .event-details-grid .event-teacher {
  grid-column: 2 / 3;
}

.timeGridDay-view .event-details-grid .event-remarks {
  grid-column: 1 / -1;
  font-size: 11px;
  opacity: 0.9;
  background: rgba(255, 255, 255, 0.08);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.timeGridDay-view .event-details-grid i {
  margin-right: 4px;
  font-size: 14px;
  flex-shrink: 0;
}

.timeGridDay-view .event-details-grid span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.fc-dayGridMonth-view .custom-event-content {
  font-size: 13px;
}

.fc-dayGridMonth-view .custom-event-content .event-time {
  font-size: 14px;
}

.fc-dayGridMonth-view .custom-event-content .event-details > div {
  font-size: 12px;
}

.fc-dayGridMonth-view .custom-event-content .event-details i {
  font-size: 13px;
}

.fc-dayGridMonth-view .custom-event-content .event-remarks {
  font-size: 11px;
}

/* 主题适配 */
.theme-dark .custom-event-content .event-time {
  background: rgba(255, 255, 255, 0.2);
}

.theme-dark .custom-event-content .event-remarks {
  border-top-color: rgba(255, 255, 255, 0.4);
}

.theme-macaron .custom-event-content .event-time {
  background: rgba(139, 71, 137, 0.3);
}

.theme-macaron .custom-event-content .event-remarks {
  border-top-color: rgba(255, 255, 255, 0.4);
}

.theme-fresh-green .custom-event-content .event-time {
  background: rgba(30, 126, 52, 0.3);
}

.theme-fresh-green .custom-event-content .event-remarks {
  border-top-color: rgba(255, 255, 255, 0.4);
}

.theme-retro-yellow .custom-event-content .event-time {
  background: rgba(139, 69, 19, 0.3);
}

.theme-retro-yellow .custom-event-content .event-remarks {
  border-top-color: rgba(255, 255, 255, 0.4);
}

/* 增强事件的可读性 */
.fc-event {
  border-radius: 6px !important;
  border-width: 1px !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.2s ease !important;
}

.fc-event:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
  transform: translateY(-1px) !important;
}

/* 确保事件内容不会被截断 */
.fc-event-main {
  padding: 0 !important;
}

.fc-event-main-frame {
  padding: 0 !important;
}

.fc-event-title-container {
  padding: 0 !important;
}

.fc-event-title {
  padding: 0 !important;
  margin: 0 !important;
}

.first-weekday-indicator {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 0;
  z-index: 10;
}
.first-weekday-indicator::before {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  top: 12px;
  height: 2px;
  background: #e74c3c;
  z-index: 11;
}
.fw-arrow {
  position: absolute;
  left: 50%;
  top: 2px;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 10px solid #e74c3c;
  transform: translateX(-50%);
  z-index: 12;
}
</style>
