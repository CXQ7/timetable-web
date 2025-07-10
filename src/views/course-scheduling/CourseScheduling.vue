<template>
  <div class="course-scheduling-container">
    <div class="course-scheduling-content">
      <el-row>
        <el-col :span="16">
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
                  :label="item.name"
                  :value="item.id"
                >
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ item.duration }}分钟
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
        <el-col :span="8">
          <div class="course-scheduling-buttons">
            <el-dropdown>
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
              @click="saveBatchCourseSchedulingVisible = true"
              >新增课程</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="batchDeleteCourseSchedulingVisible = true"
              >批量删除</el-button
            >
            <el-button
              type="primary"
              size="small"
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
      <div style="margin-bottom: 16px;">
      <FullCalendar
        ref="fullCalendar"
        :options="calendarOptions"
      ></FullCalendar>
      </div>
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
    <BatchDeleteCourseScheduling
      :visible="batchDeleteCourseSchedulingVisible"
      @on-close="batchDeleteCourseSchedulingVisible = false"
      @on-success="batchDeleteSuccess"
    >
    </BatchDeleteCourseScheduling>
  </div>
</template>
<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment'
import { mapActions, mapGetters, mapState } from 'vuex'
import SaveCourseScheduling from '@/views/course-scheduling/SaveCourseScheduling'
import ViewCourseScheduling from '@/views/course-scheduling/ViewCourseScheduling'
import BatchSaveCourseScheduling from '@/views/course-scheduling/BatchSaveCourseScheduling'
import ExportCourseScheduling from '@/views/course-scheduling/ExportCourseScheduling'
import ImportCourseScheduling from '@/views/course-scheduling/ImportCourseScheduling'
import BatchDeleteCourseScheduling from '@/views/course-scheduling/BatchDeleteCourseScheduling'

export default {
  name: 'CourseScheduling',
  components: {
    ExportCourseScheduling,
    ImportCourseScheduling,
    BatchSaveCourseScheduling,
    ViewCourseScheduling,
    SaveCourseScheduling,
    FullCalendar,
    BatchDeleteCourseScheduling
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
      batchDeleteCourseSchedulingVisible: false,
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
        slotDuration: '00:15:00',
        // 确保事件对齐到时间槽
        snapDuration: '00:15:00',
        // 事件显示设置
        displayEventTime: true,
        displayEventEnd: true,
        // 事件高度和对齐设置
        eventMinHeight: 15,
        forceEventDuration: true,
        // 事件内容渲染设置
        eventDisplay: 'block',
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
          start: 'today',
          center: 'prev,title,next',
          end: 'timeGridDay,timeGridWeek,dayGridMonth'
        },
        titleFormat: function (date) {
          const start = moment(date.start)
          const end = moment(date.end).subtract(1, 'day') // 减去1天，因为currentEnd是下一天的开始
          // 判断视图类型
          if (date.view && date.view.type) {
            if (date.view.type === 'dayGridMonth' || date.view.type === 'dayGridMonth') {
              // 月视图
              return `${start.year()}年 ${start.month() + 1}月`
            } else if (date.view.type === 'timeGridDay' || date.view.type === 'dayGridDay') {
              // 日视图 - 只显示当前日期，不显示日期范围
              // 使用当前日期而不是日期范围
              const currentDate = moment(date.date || date.start)
              return `${currentDate.year()}年${currentDate.month() + 1}月${currentDate.date()}日`
            } else if (date.view.type === 'timeGridWeek' || date.view.type === 'dayGridWeek' || date.view.type === 'listWeek') {
              // 周视图 - 确保开始日期在前，结束日期在后
              // 检查日期顺序，确保开始日期小于结束日期
              if (start.isAfter(end)) {
                // 如果开始日期在结束日期之后，交换它们
                return `${end.year()}年 ${end.month() + 1}月${end.date()}日 - ${start.month() + 1}月${start.date()}日`
              } else {
                return `${start.year()}年 ${start.month() + 1}月${start.date()}日 - ${end.month() + 1}月${end.date()}日`
              }
            }
          }
          // 默认周视图 - 同样确保日期顺序正确
          if (start.isAfter(end)) {
            return `${end.year()}年 ${end.month() + 1}月${end.date()}日 - ${start.month() + 1}月${start.date()}日`
          } else {
            return `${start.year()}年 ${start.month() + 1}月${start.date()}日 - ${end.month() + 1}月${end.date()}日`
          }
        },
        buttonText: {
          today: '今天',
          month: '月',
          week: '星期',
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
    ...mapState({
      userInfo: (state) => state.authentication.userInfo
    }),
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
        // 修复日期范围计算问题
        const viewStart = moment(calendarApi.view.currentStart)
        const viewEnd = moment(calendarApi.view.currentEnd).subtract(1, 'day') // 减去1天，因为currentEnd是下一天的开始
        this.params.startDate = viewStart.format('YYYY-MM-DD')
        this.params.endDate = viewEnd.format('YYYY-MM-DD')
        // 添加当前用户的username
        this.params.username = this.userInfo?.username || ''
        console.log('搜索参数:', {
          startDate: this.params.startDate,
          endDate: this.params.endDate,
          username: this.params.username
        })
        // 先获取课程列表，再获取统计数据，确保使用相同的参数
        this.GetCourseSchedulingList(this.params)
          .then((res) => {
            if (res && this.$refs.fullCalendar) {
              // 使用FullCalendar API来更新事件，避免频闪
              const calendarApi = this.$refs.fullCalendar.getApi()
              // 移除所有现有事件
              calendarApi.removeAllEvents()
              // 批量添加新事件
              const newEvents = res.map((item) => {
                // 判断课程类型（必修/选修）
                // 优先使用课程调度数据中的课程类型，如果没有则从课程数据中查找
                let courseType = item.courseType
                if (!courseType && item.courseId) {
                  const course = this.courseData.find(c => c.id === item.courseId)
                  courseType = course ? course.courseType : 1 // 默认为必修
                }
                const isRequired = courseType === 1 || courseType === '1'
                // 根据课程类型设置不同的颜色深浅
                let eventColor = item.backgroundColor || '#409EFF'
                if (isRequired) {
                  // 必修课程使用深色
                  eventColor = this.getRequiredColor(eventColor)
                } else {
                  // 选修课程使用浅色
                  eventColor = this.getElectiveColor(eventColor)
                }
                // 确保时间格式正确
                const startDateTime = moment(item.date + ' ' + item.attendTime)
                const endDateTime = moment(item.date + ' ' + item.finishTime)
                // 调试信息：检查时间格式
                console.log('课程时间信息:', {
                  courseName: item.courseName,
                  date: item.date,
                  attendTime: item.attendTime,
                  finishTime: item.finishTime,
                  startDateTime: startDateTime.format('YYYY-MM-DD HH:mm:ss'),
                  endDateTime: endDateTime.format('YYYY-MM-DD HH:mm:ss'),
                  isValid: startDateTime.isValid() && endDateTime.isValid()
                })
                return {
                  id: item.id,
                  title: `${item.courseName} - ${item.classroomName} - ${item.teacherName}`,
                  start: startDateTime.isValid() ? startDateTime.toISOString() : item.date + ' ' + item.attendTime,
                  end: endDateTime.isValid() ? endDateTime.toISOString() : item.date + ' ' + item.finishTime,
                  extendedProps: {
                    ...item,
                    courseName: item.courseName,
                    classroomName: item.classroomName,
                    teacherName: item.teacherName,
                    courseType: courseType,
                    remarks: item.remarks,
                    isRequired: isRequired
                  },
                  backgroundColor: eventColor,
                  borderColor: eventColor,
                  // 添加自定义类名用于样式控制
                  classNames: isRequired ? ['required-course-event'] : ['elective-course-event']
                }
              })

              // 批量添加事件
              newEvents.forEach((event) => {
                calendarApi.addEvent(event)
              })
            }
            // 在课程列表加载完成后再获取统计数据，确保数据一致性
            return this.GetCourseSchedulingCourseCount(this.params)
          })
          .then((res) => {
            if (res) {
              console.log('课程统计数据:', res)
              this.courseCountObj = res
            }
          })
          .catch((error) => {
            console.error('获取课程数据失败:', error)
          })
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
      // 立即刷新课表数据
      this.search()
      // 关闭弹窗
      this.viewCourseSchedulingVisible = false
      // 确保数据完全同步，延迟再次刷新
      setTimeout(() => {
        this.search()
      }, 300)
    },
    importSuccess () {
      this.search()
      this.importCourseSchedulingVisible = false
    },
    datesSet (info) {
      console.log('datesSet 触发 - 视图类型:', info.view.type, '开始日期:', info.start, '结束日期:', info.end)
      // 添加防抖，避免频繁调用
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      // 清空当前的统计数据，避免显示过期数据
      this.courseCountObj = {}
      this.searchTimeout = setTimeout(() => {
        console.log('防抖后执行搜索')
        this.search()
      }, 150) // 稍微增加延迟时间，确保视图完全切换
    },
    dayHeaderContent (info) {
      if (info.view.type === 'dayGridMonth') {
        return {
          html: `<div class="fc-scrollgrid-sync-inner"><a class="fc-col-header-cell-cushion">${info.text}</a></div>`
        }
      } else if (info.view.type === 'timeGridWeek') {
        // 自定义日期格式: 6月30 星期一 (不显示课程数量)
        const dateText = moment(info.date).format('M月D日 dddd')
        return {
          html: `<div class="fc-scrollgrid-sync-inner">
                    <a class="fc-col-header-cell-cushion"
                        data-navlink="{&quot;date&quot;:&quot;${moment(
                          info.date
                        ).format(
                          'YYYY-MM-DD'
                        )}&quot;,&quot;type&quot;:&quot;day&quot;}" tabindex="0">${dateText}</a>
                </div>`
        }
      } else if (info.view.type === 'timeGridDay') {
        // 自定义日期格式: 仅显示年月日，不显示星期几
        const dateText = moment(info.date).format('YYYY年M月D日')
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
      const dateKey = moment(date).format('YYYY-MM-DD')
      const count = this.courseCountObj[dateKey]

      // 添加调试信息
      console.log(`获取课程数量 - 日期: ${dateKey}, 统计数据:`, this.courseCountObj, `结果: ${count || 0}`)

      // 如果统计数据为空或者找不到对应日期的数据，使用备用方案
      if (!this.courseCountObj || typeof this.courseCountObj !== 'object' || count === undefined) {
        console.warn(`课程统计数据异常，使用备用方案计算 ${dateKey}`)
        return this.calculateCourseCountFromEvents(date)
      }

      return count || 0
    },
    // 根据当前日历中的事件计算课程统计（备用方案）
    calculateCourseCountFromEvents (date) {
      const dateKey = moment(date).format('YYYY-MM-DD')

      if (!this.$refs.fullCalendar) {
        return 0
      }

      try {
        const calendarApi = this.$refs.fullCalendar.getApi()
        const events = calendarApi.getEvents()

        // 统计指定日期的课程数量
        const dayEvents = events.filter(event => {
          const eventDate = moment(event.start).format('YYYY-MM-DD')
          return eventDate === dateKey
        })

        console.log(`从事件计算 ${dateKey} 的课程数量:`, dayEvents.length)
        return dayEvents.length
      } catch (error) {
        console.error('从事件计算课程数量失败:', error)
        return 0
      }
    },
    // 统一同步更新所有日期的课程统计
    syncAllCourseCount () {
      console.log('开始统一同步课程统计数据')

      if (!this.$refs.fullCalendar) {
        console.warn('日历组件未准备好，跳过同步')
        return
      }

      try {
        const calendarApi = this.$refs.fullCalendar.getApi()
        const events = calendarApi.getEvents()

        // 从事件中重新计算所有日期的统计数据
        const eventCountMap = {}
        events.forEach(event => {
          const dateKey = moment(event.start).format('YYYY-MM-DD')
          eventCountMap[dateKey] = (eventCountMap[dateKey] || 0) + 1
        })

        console.log('同步后的统计数据:', eventCountMap)

        // 更新统计数据
        this.courseCountObj = eventCountMap

        // 强制更新视图以重新渲染所有日期头部
        this.$forceUpdate()

        console.log('课程统计数据同步完成')
      } catch (error) {
        console.error('同步课程统计数据时出错:', error)
      }
    },
    // 验证并修复课程统计数据
    validateAndFixCourseCount () {
      console.log('开始验证统计数据完整性')

      // 延迟执行，确保事件完全加载
      setTimeout(() => {
        if (!this.$refs.fullCalendar) {
          console.warn('日历组件未准备好，跳过验证')
          return
        }

        try {
          const calendarApi = this.$refs.fullCalendar.getApi()
          const events = calendarApi.getEvents()

          console.log('当前日历中的事件数量:', events.length)

          // 从事件中重新计算统计数据
          const eventCountMap = {}
          events.forEach(event => {
            const dateKey = moment(event.start).format('YYYY-MM-DD')
            eventCountMap[dateKey] = (eventCountMap[dateKey] || 0) + 1
          })

          console.log('从事件计算的统计数据:', eventCountMap)
          console.log('API返回的统计数据:', this.courseCountObj)

          // 检查是否有不一致的情况
          let hasInconsistency = false
          const allDates = new Set([...Object.keys(eventCountMap), ...Object.keys(this.courseCountObj)])

          for (const date of allDates) {
            const eventCount = eventCountMap[date] || 0
            const apiCount = this.courseCountObj[date] || 0

            if (eventCount !== apiCount) {
              console.warn(`日期 ${date} 统计不一致: 事件数量=${eventCount}, API数量=${apiCount}`)
              hasInconsistency = true
            }
          }

          // 如果发现不一致，使用事件数据作为准确数据
          if (hasInconsistency) {
            console.log('发现统计数据不一致，使用事件数据修复')
            this.courseCountObj = eventCountMap
            // 强制更新视图
            this.$forceUpdate()
          } else {
            console.log('统计数据验证通过')
          }
        } catch (error) {
          console.error('验证统计数据时出错:', error)
        }
      }, 500) // 延迟500ms执行
    },
    // 强制刷新统计数据
    forceRefreshCourseCount (retryCount = 0) {
      console.log('强制刷新统计数据，重试次数:', retryCount)
      if (this.params && this.params.startDate && this.params.endDate) {
        this.GetCourseSchedulingCourseCount(this.params)
          .then((res) => {
            if (res && Object.keys(res).length > 0) {
              console.log('强制刷新后的统计数据:', res)
              this.courseCountObj = res
              // 强制更新视图以重新渲染日期头部
              this.$forceUpdate()
            } else if (retryCount < 3) {
              // 如果数据仍然为空且重试次数小于3，继续重试
              console.warn('统计数据仍为空，1秒后重试')
              setTimeout(() => {
                this.forceRefreshCourseCount(retryCount + 1)
              }, 1000)
            } else {
              console.error('多次重试后统计数据仍为空')
            }
          })
          .catch((error) => {
            console.error('强制刷新统计数据失败:', error)
            if (retryCount < 3) {
              // 如果出错且重试次数小于3，继续重试
              setTimeout(() => {
                this.forceRefreshCourseCount(retryCount + 1)
              }, 1000)
            }
          })
      }
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
      // 切换主题后重新加载课程数据以更新颜色
      this.$nextTick(() => {
        this.search()
      })
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
      // 判断课程类型（必修/选修）
      const courseType = extendedProps.courseType
      const isRequired = courseType === 1 || courseType === '1'
      const courseTypeClass = isRequired ? 'course-required' : 'course-elective'
      const courseTypeText = isRequired ? '必修' : '选修'
      // 控制显示内容
      const showTeacher = this.getShowTeacher
      const showClassroom = this.getShowClassroom
      // 根据视图类型调整布局
      let detailsHtml = ''
      detailsHtml += `<div class="event-course ${courseTypeClass}"><i class="el-icon-reading"></i><span>${
        extendedProps.courseName || ''
      }</span><span class="course-type-badge">${courseTypeText}</span></div>`
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
    },
    batchDeleteSuccess () {
      this.search()
      this.batchDeleteCourseSchedulingVisible = false
    },
    // 获取必修课程颜色（深色）
    getRequiredColor (color) {
      if (!color) return '#2d5aa0'
      // 根据当前主题设置不同的深色
      const currentTheme = this.currentTheme || 'default'
      // 主题特定的深色
      const themeColors = {
        default: '#2d5aa0',
        'theme-dark': '#4a4a4a',
        'theme-macaron': '#8b4789',
        'theme-fresh-green': '#1e7e34',
        'theme-retro-yellow': '#8b4513'
      }
      // 如果有主题特定的颜色，优先使用
      if (themeColors[currentTheme]) {
        return themeColors[currentTheme]
      }
      // 否则使用通用的深色处理
      try {
        if (color.startsWith('#')) {
          const hex = color.replace('#', '')
          const r = parseInt(hex.substr(0, 2), 16)
          const g = parseInt(hex.substr(2, 2), 16)
          const b = parseInt(hex.substr(4, 2), 16)
          // 加深颜色（减少亮度，增加对比度）
          const darkerR = Math.max(0, r - 100)
          const darkerG = Math.max(0, g - 100)
          const darkerB = Math.max(0, b - 100)
          return `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`
        }
        if (color.startsWith('rgb')) {
          const rgb = color.match(/\d+/g)
          if (rgb && rgb.length >= 3) {
            const r = Math.max(0, parseInt(rgb[0]) - 100)
            const g = Math.max(0, parseInt(rgb[1]) - 100)
            const b = Math.max(0, parseInt(rgb[2]) - 100)
            return `rgb(${r}, ${g}, ${b})`
          }
        }
        return color
      } catch (e) {
        return color
      }
    },
    // 获取选修课程颜色（浅色）
    getElectiveColor (color) {
      if (!color) return '#87ceeb'
      // 根据当前主题设置不同的浅色
      const currentTheme = this.currentTheme || 'default'
      // 主题特定的浅色
      const themeColors = {
        default: '#87ceeb',
        'theme-dark': '#999999',
        'theme-macaron': '#d4a5d4',
        'theme-fresh-green': '#7dd87d',
        'theme-retro-yellow': '#d4b483'
      }
      // 如果有主题特定的颜色，优先使用
      if (themeColors[currentTheme]) {
        return themeColors[currentTheme]
      }
      // 否则使用通用的浅色处理
      try {
        if (color.startsWith('#')) {
          const hex = color.replace('#', '')
          const r = parseInt(hex.substr(0, 2), 16)
          const g = parseInt(hex.substr(2, 2), 16)
          const b = parseInt(hex.substr(4, 2), 16)
          // 变浅颜色（增加亮度，减少饱和度）
          const lighterR = Math.min(255, r + 100)
          const lighterG = Math.min(255, g + 100)
          const lighterB = Math.min(255, b + 100)
          return `#${lighterR.toString(16).padStart(2, '0')}${lighterG.toString(16).padStart(2, '0')}${lighterB.toString(16).padStart(2, '0')}`
        }
        if (color.startsWith('rgb')) {
          const rgb = color.match(/\d+/g)
          if (rgb && rgb.length >= 3) {
            const r = Math.min(255, parseInt(rgb[0]) + 100)
            const g = Math.min(255, parseInt(rgb[1]) + 100)
            const b = Math.min(255, parseInt(rgb[2]) + 100)
            return `rgb(${r}, ${g}, ${b})`
          }
        }
        return color
      } catch (e) {
        return color
      }
    }
  },
  mounted () {
    this.init()
    this.applyTheme(this.currentTheme)
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo) {
      this.$store.commit('SET_USER_INFO', userInfo)
    }
    // 添加额外的统计数据检查，确保在组件完全加载后统计数据正确
    this.$nextTick(() => {
      setTimeout(() => {
        if (!this.courseCountObj || Object.keys(this.courseCountObj).length === 0) {
          console.log('mounted 后检查：统计数据为空，尝试重新获取')
          this.forceRefreshCourseCount()
        }
      }, 2000) // 2秒后检查
    })
  },
  beforeDestroy () {
    // 清除所有定时器
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
    // 清除可能存在的其他定时器
    const timers = ['searchTimeout', 'retryTimer', 'checkTimer']
    timers.forEach(timer => {
      if (this[timer]) {
        clearTimeout(this[timer])
      }
    })
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

/* 自定义事件显示样式 - 简化以允许自然高度 */
.custom-event-content {
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  font-size: 15px;
  line-height: 1.4;
  word-wrap: break-word;
  overflow: hidden;
  box-sizing: border-box;
}

/* 课程类型标签样式 */
.course-type-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: bold;
  margin-left: 6px;
  text-align: center;
  min-width: 30px;
  line-height: 1.2;
  opacity: 0.9;
  transition: all 0.2s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.course-required .course-type-badge {
  background-color: rgba(255, 255, 255, 0.4);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.6);
  font-weight: bold;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.course-elective .course-type-badge {
  background-color: rgba(255, 255, 255, 0.25);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 课程名称样式调整 */
.event-course {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.event-course span:first-child {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 必修课程事件样式 */
.required-course-event {
  border-width: 2px !important;
  border-style: solid !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
  font-weight: 600 !important;
}

.required-course-event .custom-event-content {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1)) !important;
}

.required-course-event .event-time {
  background: rgba(255, 255, 255, 0.4) !important;
  font-weight: bold !important;
}

.required-course-event .course-type-badge {
  background-color: rgba(255, 255, 255, 0.4) !important;
  border: 2px solid rgba(255, 255, 255, 0.6) !important;
  font-weight: bold !important;
}

/* 选修课程事件样式 */
.elective-course-event {
  border-width: 1px !important;
  border-style: solid !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2) !important;
  font-weight: 500 !important;
  opacity: 0.9 !important;
}

.elective-course-event .custom-event-content {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05)) !important;
}

.elective-course-event .event-time {
  background: rgba(255, 255, 255, 0.25) !important;
  font-weight: 500 !important;
}

.elective-course-event .course-type-badge {
  background-color: rgba(255, 255, 255, 0.25) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  font-weight: 500 !important;
}

/* 主题特定的颜色优化 */
/* 简约蓝白主题 */
body:not([class*="theme-"]) .required-course-event {
  background-color: #2d5aa0 !important;
  border-color: #1e3a6b !important;
}

body:not([class*="theme-"]) .elective-course-event {
  background-color: #87ceeb !important;
  border-color: #5ba3c7 !important;
}

/* 暗色主题 */
.theme-dark .required-course-event {
  background-color: #4a4a4a !important;
  border-color: #333333 !important;
}

.theme-dark .elective-course-event {
  background-color: #999999 !important;
  border-color: #777777 !important;
}

/* 马卡龙主题 */
.theme-macaron .required-course-event {
  background-color: #8b4789 !important;
  border-color: #6b356b !important;
}

.theme-macaron .elective-course-event {
  background-color: #d4a5d4 !important;
  border-color: #b385b3 !important;
}

/* 清新绿主题 */
.theme-fresh-green .required-course-event {
  background-color: #1e7e34 !important;
  border-color: #0f4d1a !important;
}

.theme-fresh-green .elective-course-event {
  background-color: #7dd87d !important;
  border-color: #5ba35b !important;
}

/* 复古黄主题 */
.theme-retro-yellow .required-course-event {
  background-color: #8b4513 !important;
  border-color: #6b3510 !important;
}

.theme-retro-yellow .elective-course-event {
  background-color: #d4b483 !important;
  border-color: #b3946b !important;
}

/* 悬停效果 */
.required-course-event:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
}

.elective-course-event:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
  opacity: 1 !important;
}

/* 必修课程特殊标识 */
.required-course-event::before {
  content: "★";
  position: absolute;
  top: 2px;
  right: 2px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  z-index: 10;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 选修课程特殊标识 */
.elective-course-event::before {
  content: "○";
  position: absolute;
  top: 2px;
  right: 2px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  z-index: 10;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 确保事件有相对定位以便显示标识 */
.fc-event {
  position: absolute !important;
}

/* 删除过度的时间网格事件样式，让FullCalendar自然计算高度 */

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
  display: flex;
  flex-direction: column;
  gap: 2px;
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

/* 日视图特殊布局 - 简化网格分布 */
.timeGridDay-view .custom-event-content {
  padding: 8px 10px;
}

.timeGridDay-view .event-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 6px;
  margin-top: 6px;
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

/* 简化事件样式，避免干扰高度计算 */
.fc-event {
  border-radius: 6px !important;
  border-width: 1px !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
}

.fc-event:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
}

/* 简化事件内容样式，让FullCalendar自行计算高度 */
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

/* 日历导航按钮样式 */
.fc-toolbar-chunk {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 中间的导航区域 */
.fc-toolbar-chunk:nth-child(2) {
  position: relative !important;
}
.fc-toolbar-chunk:nth-child(2) .fc-prev-button {
  position: absolute !important;
  left: -20% !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}
.fc-toolbar-chunk:nth-child(2) .fc-next-button {
  position: absolute !important;
  right: -20% !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

/* 让按钮组水平排列 */
.fc-toolbar-chunk:nth-child(2) .fc-button-group {
  display: inline-flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 0 !important;
}

/* 标题在中间 */
.fc-toolbar-chunk:nth-child(2) .fc-toolbar-title {
  order: 1;
  margin: 0 20px;
}

/* 前一个按钮在左边 */
.fc-toolbar-chunk:nth-child(2) .fc-prev-button {
  order: 0;
}

/* 后一个按钮在右边 */
.fc-toolbar-chunk:nth-child(2) .fc-next-button {
  order: 2;
}

.fc-toolbar-chunk .fc-button-group .fc-button {
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.fc-toolbar-chunk .fc-button::before,
.fc-prev-button::before,
.fc-next-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.fc-toolbar-chunk .fc-button:hover::before,
.fc-prev-button:hover::before,
.fc-next-button:hover::before {
  left: 100%;
}

.fc-toolbar-chunk .fc-button:hover,
.fc-prev-button:hover,
.fc-next-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.fc-toolbar-chunk .fc-button:active,
.fc-prev-button:active,
.fc-next-button:active {
  transform: scale(0.95);
}

/* 默认主题导航按钮 */
body:not([class*="theme-"]) .fc-toolbar-chunk .fc-button,
body:not([class*="theme-"]) .fc-prev-button,
body:not([class*="theme-"]) .fc-next-button {
  background: linear-gradient(135deg, #409EFF, #36A3F7);
  color: white;
}

body:not([class*="theme-"]) .fc-toolbar-chunk .fc-button:hover,
body:not([class*="theme-"]) .fc-prev-button:hover,
body:not([class*="theme-"]) .fc-next-button:hover {
  background: linear-gradient(135deg, #36A3F7, #2d8cf0);
}

body:not([class*="theme-"]) .fc-toolbar-chunk .fc-button:disabled,
body:not([class*="theme-"]) .fc-prev-button:disabled,
body:not([class*="theme-"]) .fc-next-button:disabled {
  background: #c0c4cc;
  color: #ffffff;
  cursor: not-allowed;
  transform: none;
}

/* 暗色主题导航按钮 */
.theme-dark .fc-toolbar-chunk .fc-button,
.theme-dark .fc-prev-button,
.theme-dark .fc-next-button {
  background: linear-gradient(135deg, #666666, #808080);
  color: #ffffff;
  border: 1px solid #555555;
}

.theme-dark .fc-toolbar-chunk .fc-button:hover,
.theme-dark .fc-prev-button:hover,
.theme-dark .fc-next-button:hover {
  background: linear-gradient(135deg, #808080, #909399);
  border-color: #777777;
}

.theme-dark .fc-toolbar-chunk .fc-button:disabled,
.theme-dark .fc-prev-button:disabled,
.theme-dark .fc-next-button:disabled {
  background: #444444;
  color: #888888;
  border-color: #333333;
  cursor: not-allowed;
  transform: none;
}

/* 马卡龙主题导航按钮 */
.theme-macaron .fc-toolbar-chunk .fc-button,
.theme-macaron .fc-prev-button,
.theme-macaron .fc-next-button {
  background: linear-gradient(135deg, #ffb6b9, #fae3d9);
  color: #8b4789;
  border: 2px solid #ffb6b9;
}

.theme-macaron .fc-toolbar-chunk .fc-button:hover,
.theme-macaron .fc-prev-button:hover,
.theme-macaron .fc-next-button:hover {
  background: linear-gradient(135deg, #fae3d9, #bbded6);
  border-color: #8ac6d1;
  color: #61a5c2;
}

.theme-macaron .fc-toolbar-chunk .fc-button:disabled,
.theme-macaron .fc-prev-button:disabled,
.theme-macaron .fc-next-button:disabled {
  background: #f0f0f0;
  color: #cccccc;
  border-color: #dddddd;
  cursor: not-allowed;
  transform: none;
}

/* 清新绿主题导航按钮 */
.theme-fresh-green .fc-toolbar-chunk .fc-button,
.theme-fresh-green .fc-prev-button,
.theme-fresh-green .fc-next-button {
  background: linear-gradient(135deg, #28c76f, #48da89);
  color: white;
  border: 1px solid #1e7e34;
}

.theme-fresh-green .fc-toolbar-chunk .fc-button:hover,
.theme-fresh-green .fc-prev-button:hover,
.theme-fresh-green .fc-next-button:hover {
  background: linear-gradient(135deg, #48da89, #34ce57);
  border-color: #28a745;
}

.theme-fresh-green .fc-toolbar-chunk .fc-button:disabled,
.theme-fresh-green .fc-prev-button:disabled,
.theme-fresh-green .fc-next-button:disabled {
  background: #a8e6cf;
  color: #ffffff;
  border-color: #7fcdcd;
  cursor: not-allowed;
  transform: none;
}

/* 复古黄主题导航按钮 */
.theme-retro-yellow .fc-toolbar-chunk .fc-button,
.theme-retro-yellow .fc-prev-button,
.theme-retro-yellow .fc-next-button {
  background: linear-gradient(135deg, #c29f42, #d4af37);
  color: white;
  border: 1px solid #8b4513;
}

.theme-retro-yellow .fc-toolbar-chunk .fc-button:hover,
.theme-retro-yellow .fc-prev-button:hover,
.theme-retro-yellow .fc-next-button:hover {
  background: linear-gradient(135deg, #d4af37, #b8651f);
  border-color: #a0522d;
}

.theme-retro-yellow .fc-toolbar-chunk .fc-button:disabled,
.theme-retro-yellow .fc-prev-button:disabled,
.theme-retro-yellow .fc-next-button:disabled {
  background: #ddd8b8;
  color: #ffffff;
  border-color: #c9c299;
  cursor: not-allowed;
  transform: none;
}

/* 标题样式优化 */
.fc-toolbar-title {
  font-size: 1.8em !important;
  font-weight: 600 !important;
  margin: 0 20px !important;
  text-align: center !important;
  transition: all 0.3s ease !important;
}

/* 工具栏整体布局 */
.fc-toolbar {
  padding: 15px 0 !important;
  background: rgba(255, 255, 255, 0.8) !important;
  border-radius: 12px !important;
  margin-bottom: 20px !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1) !important;
  backdrop-filter: blur(10px) !important;
}

.theme-dark .fc-toolbar {
  background: rgba(44, 62, 80, 0.9) !important;
}

.theme-macaron .fc-toolbar {
  background: rgba(255, 182, 185, 0.2) !important;
}

.theme-fresh-green .fc-toolbar {
  background: rgba(40, 199, 111, 0.1) !important;
}

.theme-retro-yellow .fc-toolbar {
  background: rgba(194, 159, 66, 0.1) !important;
}

/* 视图切换按钮样式 */
.fc-toolbar-chunk:last-child .fc-button-group .fc-button {
  border-radius: 8px !important;
  min-width: 60px !important;
  height: 36px !important;
  font-size: 14px !important;
  margin: 0 2px !important;
}

.fc-toolbar-chunk:last-child .fc-button-group .fc-button.fc-button-active {
  transform: scale(1.05) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
}

/* 今天按钮样式 */
.fc-toolbar-chunk:first-child .fc-button {
  border-radius: 20px !important;
  min-width: 80px !important;
  height: 36px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
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

/* 仅在时间轴视图使用绝对定位，避免月视图事件重叠 */
.fc-timeGridWeek-view .fc-event,
.fc-timeGridDay-view .fc-event {
  position: absolute !important;
}
/* dayGrid(例如月视图) 保持默认相对定位 */

/* 周视图：让事件内容随高度拉伸 */
.fc-timeGridWeek-view .custom-event-content {
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
}

.fc-timeGridWeek-view .custom-event-content .event-details {
  flex: 1 1 auto !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-around !important;
}

/* 日视图：让事件内容随高度拉伸 */
.fc-timeGridDay-view .custom-event-content {
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
}

.fc-timeGridDay-view .custom-event-content .event-details {
  flex: 1 1 auto !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-around !important;
}
</style>
