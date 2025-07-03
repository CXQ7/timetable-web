import { axios } from '../util/request'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios, { delayResponse: 500 })

// 模拟 GET 设置
mock.onGet('/course-reminder/settings').reply(200, {
  code: 0,
  data: { inSite: true, email: false }
})

// 模拟 PUT 设置
mock.onPut('/course-reminder/settings').reply(config => {
  const body = JSON.parse(config.data)
  console.log('[mock] 更新提醒设置：', body)
  return [200, { code: 0, data: { ...body } }]
})

// 模拟 upcoming 提醒
mock.onGet('/course-reminder/upcoming').reply(200, {
  code: 0,
  data: {
    records: [
      { message: '30 分钟后在 1 号教室有 数学 课程', remindTime: '2025-07-02 14:30' },
      { message: '30 分钟后在 2 号教室有 英语 课程', remindTime: '2025-07-02 15:00' }
    ]
  }
})

export default mock
