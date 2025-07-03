import { axios } from '@/util/request'

// 获取用户提醒设置
export const getReminderSettings = () => {
  return axios({
    url: 'course-reminder/settings',
    method: 'get'
  })
}

// 更新用户提醒设置（inSite, email）
export const updateReminderSettings = (data) => {
  return axios({
    url: 'course-reminder/settings',
    method: 'put',
    data
  })
}

// 获取即将在30分钟内开始的课程提醒列表
export const getUpcomingReminders = (params) => {
  return axios({
    url: 'course-reminder/upcoming',
    method: 'get',
    params
  })
}
