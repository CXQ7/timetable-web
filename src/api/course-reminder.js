import { axios } from '@/util/request'

// 获取用户提醒设置 参数为username
export const getReminderSettings = (params) => {
  return axios({
    url: '/course-reminder/settings',
    method: 'get',
    params
  })
}

// 更新用户提醒设置 传username +（inSite, email�?
export const updateReminderSettings = (data) => {
  return axios({
    url: '/course-reminder/settings',
    method: 'put',
    data
  })
}

// 获取即将�?0分钟内开始的课程提醒列表 传username（实际上还传了一个limit�?，限制只�?条，但可以不用）
export const getUpcomingReminders = (params) => {
  return axios({
    url: '/course-reminder/upcoming',
    method: 'get',
    params
  })
}
