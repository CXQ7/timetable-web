<template>
  <div>
    <el-dialog title="修改" width="790px"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="dialogVisible"
               :before-close="handleClose" >
      <el-form ref="form" :model="form" :rules="rules" inline label-width="80px" class="form-container">
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="form.date"
                          type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
            class="form-item"></el-date-picker>
        </el-form-item>
        <br/>
              <el-form-item label="教室" prop="classroomId">
          <el-select v-model="form.classroomId" class="form-item" @change="classroomChange" placeholder="请选择教室">
            <el-option
              v-for="item in classrooms"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
          <el-option key="add-new-classroom" :value="'add-new-classroom'" style="color: #409EFF;">
            <i class="el-icon-plus"></i> 新增教室
          </el-option>
        </el-select>
      </el-form-item>
        <br/>
              <el-form-item label="课程" prop="courseId">
          <el-select v-model="currentCourse" value-key="id" class="form-item" @change="courseChange" placeholder="请选择课程">
            <el-option
              v-for="item in courses"
              :key="item.id"
              :label="item.name"
              :value="item">
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
          <el-select v-model="form.teacherId" class="form-item" @change="teacherChange" placeholder="请选择老师">
            <el-option
              v-for="item in teachers"
              :key="item.id"
              :label="item.name"
              :value="item.id">
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
                           @change="calcFinishTime"></el-input-number>
        </el-form-item>
        <el-form-item prop="finishTime">
          <el-input v-model="form.finishTime"
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
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
import SaveClassroom from '@/views/classroom/SaveClassroom'
import SaveCourse from '@/views/course/SaveCourse'
import SaveTeacher from '@/views/teacher/SaveTeacher'

export default {
  name: 'UpdateCourseScheduling',
  components: {
    SaveClassroom,
    SaveCourse,
    SaveTeacher
  },
  props: {
    visible: {
      type: Boolean
    },
    id: {
      type: Number
    }
  },
  data () {
    return {
      dialogVisible: false,
      classrooms: [],
      courses: [],
      teachers: [],
      form: {},
      currentCourse: null,
      courseDuration: 0,
      attendTimeSelectKey: new Date().getTime(),
      datesPickerOptions: {
        firstDayOfWeek: 1
      },
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
  computed: {
    ...mapState({
      userInfo: state => state.authentication.userInfo
    })
  },
  methods: {
    ...mapActions(['GetClassroomRefList', 'GetCourseRefList', 'GetTeacherRefList', 'GetCourseSchedulingById', 'UpdateCourseSchedulingById']),
    init () {
      this.attendTimeSelectKey = new Date().getTime()
      Promise.all([
        this.GetClassroomRefList(),
        this.GetCourseRefList(),
        this.GetTeacherRefList()
      ]).then((res) => {
        console.log(res)
        this.classrooms = res[0]
        this.courses = res[1]
        console.log(this.courses)
        this.teachers = res[2]
        this.search()
      }).catch()
    },
    search () {
      this.GetCourseSchedulingById(this.id).then(res => {
        if (res) {
          this.form = res
          this.form.attendTime = moment(this.form.attendTime, 'HH:mm:ss').format('HH:mm')
          this.form.finishTime = moment(this.form.finishTime, 'HH:mm:ss').format('HH:mm')
          this.courseDuration = this.form.duration
          this.currentCourse = {
            id: res.courseId,
            name: res.courseName
          }
        }
      }).catch(() => {
      })
    },
    resetData () {
      this.$refs.form.resetFields()
      this.form = {}
      this.courseDuration = 0
      this.currentCourse = null
      this.classrooms = []
      this.courses = []
      this.teachers = []
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
          this.form.username = this.userInfo?.username || ''
          this.UpdateCourseSchedulingById({
            id: this.id,
            data: this.form
          }).then(() => {
            this.submitBtnLoading = false
            this.$refs.form.resetFields()
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
      this.GetClassroomRefList().then(res => {
        if (res) {
          this.classrooms = res
          if (data && data.id) {
            this.form.classroomId = data.id
          }
        }
      }).catch(() => {
      })
    },
    saveCourseSuccess (data) {
      this.saveCourseVisible = false
      this.GetCourseRefList().then(res => {
        if (res) {
          this.courses = res
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
      this.GetTeacherRefList().then(res => {
        if (res) {
          this.teachers = res
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
