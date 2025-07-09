import { axios } from '@/util/request'

export const getCourseSchedulingList = (params) => {
  return axios({
    url: 'course-scheduling/list',
    method: 'post',
    data: params
  })
}

export const getCourseSchedulingById = (id) => {
  return axios({
    url: 'course-scheduling/' + id,
    method: 'get'
  })
}

export const getCourseSchedulingCourseCount = (params) => {
  return axios({
    url: 'course-scheduling/course/count',
    method: 'post',
    data: params
  })
}

export const saveCourseScheduling = (data) => {
  return axios({
    url: 'course-scheduling',
    method: 'post',
    data
  })
}

export const batchSaveCourseScheduling = (data) => {
  return axios({
    url: 'course-scheduling/batch',
    method: 'post',
    data
  })
}

export const importCourseScheduling = (data) => {
  return axios({
    url: 'course-scheduling/import',
    method: 'post',
    data
  })
}

export const updateCourseSchedulingById = (id, data) => {
  return axios({
    url: '/course-scheduling/' + id,
    method: 'put',
    data
  })
}

export const updateCourseSchedulingTimeById = (id, data) => {
  return axios({
    url: '/course-scheduling/' + id + '/time',
    method: 'put',
    data
  })
}

export const removeCourseSchedulingById = (id, username) => {
  console.log('删除课程API调用，ID:', id, '用户�?', username)
  return axios({
    url: '/course-scheduling/' + id,
    method: 'delete',
    data: { username }
  })
}

export const removeCourseSchedulingByIdList = (data) => {
  console.log('批量删除课程API调用，参�?', data)
  return axios({
    url: '/course-scheduling/batch',
    method: 'delete',
    data
  })
}
