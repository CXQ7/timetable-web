import { axios } from '@/util/request'

export const getLogin = (data) => {
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}
