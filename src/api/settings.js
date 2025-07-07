import { axios } from '@/util/request'

// 保存课表设置
export function saveCalendarSettings (data) {
  return axios({
    url: '/settings/save',
    method: 'post',
    data
  })
}

// 更新课表设置
export function updateCalendarSettings (data) {
  return axios({
    url: '/settings/update',
    method: 'put',
    data
  })
}

// 获取课表设置
export function getCalendarSettings () {
  return axios({
    url: '/settings/search',
    method: 'get'
  })
}
