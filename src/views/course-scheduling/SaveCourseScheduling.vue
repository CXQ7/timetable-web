<template>
  <div>
    <el-dialog title="新增" width="790px"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="dialogVisible"
               :before-close="handleClose" >
    <el-form ref="form" :model="form" :rules="rules" inline label-width="80px" class="tams-form-container">
      <el-form-item label="日期" prop="date">
        <el-input v-model="form.date" class="tams-form-item" disabled></el-input>
      </el-form-item>
      <br/>
      <el-form-item label="教室" prop="classroomId">
        <el-select v-model="form.classroomId" class="tams-form-item" @change="classroomChange" placeholder="请选择教室">
          <el-option v-for="item in classroomData" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
          <el-option key="add-new-classroom" :value="'add-new-classroom'" style="color: #409EFF;">
            <i class="el-icon-plus"></i> 新增教室
          </el-option>
        </el-select>
      </el-form-item>
      <br/>
      <el-form-item label="课程" prop="courseId">
        <el-select v-model="currentCourse" value-key="id" class="tams-form-item" @change="courseChange" placeholder="请选择课程">
          <el-option v-for="item in courseData" :key="item.id" :value="item">
            <span>{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 12px;">
              {{ (item.courseType === 1 || item.courseType === '1') ? '必修' : (item.courseType === 2 || item.courseType === '2') ? '选修' : '必修' }}
            </span>
          </el-option>
          <el-option key="add-new-course" :value="'add-new-course'" style="color: #409EFF;">
            <i class="el-icon-plus"></i> 新增课程
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师" prop="teacherId">
        <el-select v-model="form.teacherId" class="tams-form-item" @change="teacherChange" placeholder="请选择老师">
          <el-option v-for="item in teacherData" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
          <el-option key="add-new-teacher" :value="'add-new-teacher'" style="color: #409EFF;">
            <i class="el-icon-plus"></i> 新增老师
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间" prop="attendTime">
        <el-time-select :clearable="false"
                        style="width: 210px;"
                        v-model="form.attendTime"
                        :disabled="!(form.courseId&&form.courseId>0)"
                        :picker-options="pickerOptions"
                        :key="attendTimeSelectKey"
                        @change="calcFinishTime">
        </el-time-select>
      </el-form-item>
      <el-form-item>
        <el-input-number v-model="courseDuration"
                         style="width: 150px;"
                         :step="$consts.COURSE_DURATION_STEP_MINUTE"
                         :min="0"
                         :max="360"
                         :disabled="!(form.courseId&&form.courseId>0)"
                         @change="calcFinishTime"></el-input-number>
      </el-form-item>
      <el-form-item prop="finishTime">
        <el-input v-model="form.finishTime"
                  :disabled="!(form.courseId&&form.courseId>0)"
                  readonly
                  style="width: 210px;"></el-input>
      </el-form-item>
      <br/>
      <el-form-item label="备注" style="width: 100%;">
        <el-input v-model="form.remarks"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入备注信息、待办事项或注意事项"
                  style="width: 100%;">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="submitBtnLoading" @click="submit">确定</el-button>
    </div>
  </el-dialog>

  <!-- 新增教室对话框 -->
  <SaveClassroom :visible="saveClassroomVisible"
                 @on-close="saveClassroomVisible=false"
                 @on-success="saveClassroomSuccess">
  </SaveClassroom>

  <!-- 新增课程对话框 -->
  <SaveCourse :visible="saveCourseVisible"
              @on-close="saveCourseVisible=false"
              @on-success="saveCourseSuccess">
  </SaveCourse>

  <!-- 新增老师对话框 -->
  <SaveTeacher :visible="saveTeacherVisible"
               @on-close="saveTeacherVisible=false"
               @on-success="saveTeacherSuccess">
  </SaveTeacher>
  </div>
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'
import SaveClassroom from '@/views/classroom/SaveClassroom'
import SaveCourse from '@/views/course/SaveCourse'
import SaveTeacher from '@/views/teacher/SaveTeacher'

export default {
  name: 'SaveCourseScheduling',
  components: {
    SaveClassroom,
    SaveCourse,
    SaveTeacher
  },
  props: {
    visible: {
      type: Boolean
    },
    date: String,
    attendTime: String
  },
  data () {
    return {
      dialogVisible: false,
      classroomData: [],
      courseData: [],
      teacherData: [],
      form: {},
      currentCourse: null,
      courseDuration: 0,
      attendTimeSelectKey: new Date().getTime(),
      pickerOptions: {
        start: '07:00',
        step: '00:' + this.$consts.COURSE_DURATION_STEP_MINUTE,
        end: '20:00'
      },
      rules: {
        date: [
          {
            required: true,
            message: '日期不能为空',
            trigger: 'blur'
          }
        ],
        classroomId: [
          {
            required: true,
            message: '教室不能为空',
            trigger: 'blur'
          }
        ],
        courseId: [
          {
            required: true,
            message: '课程不能为空',
            trigger: 'blur'
          }
        ],
        teacherId: [
          {
            required: true,
            message: '老师不能为空',
            trigger: 'blur'
          }
        ],
        attendTime: [
          {
            required: true,
            message: '上课时间不能为空',
            trigger: 'blur'
          }
        ],
        finishTime: [
          {
            required: true,
            message: '下课时间不能为空',
            trigger: 'blur'
          }
        ]
      },
      submitBtnLoading: false,
      saveClassroomVisible: false,
      saveCourseVisible: false,
      saveTeacherVisible: false
    }
  },
  methods: {
    ...mapActions(['GetClassroomRefList', 'GetCourseRefList', 'GetTeacherRefList', 'SaveCourseScheduling']),
    init () {
      this.$set(this.form, 'date', this.date)
      this.$set(this.form, 'attendTime', this.attendTime)
      this.attendTimeSelectKey = new Date().getTime()
      this.GetClassroomRefList().then(res => {
        if (res) {
          this.classroomData = res
        }
      }).catch(() => {
      })
      this.GetCourseRefList().then(res => {
        if (res) {
          this.courseData = res
          console.log('获取的课程数据：', res)
        }
      }).catch(() => {
      })
      this.GetTeacherRefList().then(res => {
        if (res) {
          this.teacherData = res
        }
      }).catch(() => {
      })
    },
    resetData () {
      this.$refs.form.resetFields()
      this.form = {}
      this.courseDuration = 0
      this.currentCourse = null
      this.classroomData = []
      this.courseData = []
      this.teacherData = []
    },
    handleClose (done) {
      this.resetData()
      this.$emit('on-close')
      done()
    },
    close () {
      this.resetData()
      this.$emit('on-close')
      this.dialogVisible = false
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitBtnLoading = true
          this.form.attendTime = moment(this.form.attendTime, 'HH:mm').format('HH:mm:ss')
          this.form.finishTime = moment(this.form.finishTime, 'HH:mm').format('HH:mm:ss')
          this.SaveCourseScheduling(this.form).then(() => {
            this.submitBtnLoading = false
            this.resetData()
            this.$emit('on-success')
            this.dialogVisible = false
          }).catch(() => {
            this.form.attendTime = moment(this.form.attendTime, 'HH:mm:ss').format('HH:mm')
            this.form.finishTime = moment(this.form.finishTime, 'HH:mm:ss').format('HH:mm')
            this.submitBtnLoading = false
          })
        }
      })
    },
    courseChange (val) {
      if (val === 'add-new-course') {
        this.saveCourseVisible = true
        this.currentCourse = null
      } else {
        this.form.courseId = val.id
        if (val.duration && val.duration > 0) {
          this.courseDuration = val.duration
          if (this.form.attendTime) {
            this.$set(this.form, 'finishTime', moment(this.form.attendTime, 'HH:mm').add(this.courseDuration, 'm').format('HH:mm'))
          }
        }
      }
    },
    classroomChange (val) {
      if (val === 'add-new-classroom') {
        this.saveClassroomVisible = true
        this.form.classroomId = null
      }
    },
    teacherChange (val) {
      if (val === 'add-new-teacher') {
        this.saveTeacherVisible = true
        this.form.teacherId = null
      }
    },
    calcFinishTime () {
      if (this.form.attendTime) {
        this.$set(this.form, 'finishTime', moment(this.form.attendTime, 'HH:mm').add(this.courseDuration, 'm').format('HH:mm'))
      }
    },
    saveClassroomSuccess (data) {
      this.saveClassroomVisible = false
      // 刷新教室列表
      this.GetClassroomRefList().then(res => {
        if (res) {
          this.classroomData = res
          // 自动选中新创建的教室
          if (data && data.id) {
            this.form.classroomId = data.id
          }
        }
      }).catch(() => {
      })
    },
    saveCourseSuccess (data) {
      this.saveCourseVisible = false
      // 刷新课程列表
      this.GetCourseRefList().then(res => {
        if (res) {
          this.courseData = res
          // 自动选中新创建的课程
          if (data && data.id) {
            const newCourse = res.find(item => item.id === data.id)
            if (newCourse) {
              this.currentCourse = newCourse
              this.form.courseId = newCourse.id
              if (newCourse.duration && newCourse.duration > 0) {
                this.courseDuration = newCourse.duration
                if (this.form.attendTime) {
                  this.$set(this.form, 'finishTime', moment(this.form.attendTime, 'HH:mm').add(this.courseDuration, 'm').format('HH:mm'))
                }
              }
            }
          }
        }
      }).catch(() => {
      })
    },
    saveTeacherSuccess (data) {
      this.saveTeacherVisible = false
      // 刷新老师列表
      this.GetTeacherRefList().then(res => {
        if (res) {
          this.teacherData = res
          // 自动选中新创建的老师
          if (data && data.id) {
            this.form.teacherId = data.id
          }
        }
      }).catch(() => {
      })
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.init()
        this.dialogVisible = val
      }
    }
  }
}
</script>
