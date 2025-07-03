import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '@/views/Main.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/authentication/Login.vue')
  },
  {
    path: '/register',
    component: () => import('@/views/authentication/Register.vue')
  },
  {
    path: '/main',
    redirect: '/course-scheduling',
    component: Main,
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: '/course-scheduling',
        component: () => import('@/views/course-scheduling/CourseScheduling.vue')
      },
      {
        path: '/course-scheduling-list',
        component: () => import('@/views/course-scheduling-list/CourseSchedulingList.vue')
      },
      {
        path: '/classroom',
        component: () => import('@/views/classroom/Classroom.vue')
      },
      {
        path: '/course',
        component: () => import('@/views/course/Course.vue')
      },
      {
        path: '/teacher',
        component: () => import('@/views/teacher/Teacher.vue')
      },
      {
        path: '/report',
        component: () => import('@/views/report/Report.vue')
      },
      {
        path: '/course-reminder',
        component: () => import('@/views/course-reminder/CourseReminder.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    const isAuthenticated = localStorage.getItem('token')
    if (!isAuthenticated) {
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
