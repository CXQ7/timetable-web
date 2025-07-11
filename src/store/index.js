import Vue from 'vue'
import Vuex from 'vuex'
import teacher from '@/store/teacher'
import course from '@/store/course'
import classroom from '@/store/classroom'
import courseScheduling from '@/store/course-scheduling'
import authentication from './authentication'
import courseReminder from '@/store/course-reminder'
import settings from '@/store/settings'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    authentication,
    teacher,
    course,
    classroom,
    courseScheduling,
    courseReminder,
    settings
  }
})
