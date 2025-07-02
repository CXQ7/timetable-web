import { axios } from '@/util/request'

export const getUserByUsername = (username) => {
  return axios({
    url: 'user/username/' + username,
    method: 'get'
  })
}

export const saveRegister = (data) => {
  return axios({
    url: 'user/register',
    method: 'post',
    data
  })
}
