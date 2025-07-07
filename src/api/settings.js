import { axios } from '@/util/request'

// 保存课表设置
export function saveCalendarSettings (data) {
  return axios({
    url: '/api/calendar-settings',
    method: 'post',
    data
  })
}

// 更新课表设置
export function updateCalendarSettings (data) {
  return axios({
    url: '/api/calendar-settings',
    method: 'put',
    data
  })
}
