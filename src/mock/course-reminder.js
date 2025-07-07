import { axios } from '../util/request'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios, { delayResponse: 500 })

// 模拟数据库：用户信息（username -> user object）
const userMap = {
  admin: {
    username: 'admin',
    password: '123456',
    name: '管理员',
    email: 'admin@example.com',
    phone: '12345678901'
  }
}

// 模拟数据库：每个用户的提醒设置
const userSettingsMap = {
  admin: { inSite: true, email: false }
}

// 模拟课程提醒数据
const upcomingReminders = {
  admin: [
    { message: '30 分钟后在 1 号教室有 数学 课程', remindTime: '2025-07-02 14:30' }
  ]
}

//
// 登录接口（GET /user/username/:username）
//
mock.onGet(new RegExp('/user/username/.*')).reply(config => {
  const username = config.url.split('/').pop()
  const user = userMap[username]
  if (user) {
    return [200, { code: 0, data: user }]
  } else {
    return [404, { code: 1, message: '用户不存在' }]
  }
})

//
// 注册接口（POST /user/register）
//
mock.onPost('/user/register').reply(config => {
  const body = JSON.parse(config.data)
  const { username, password, email, name } = body

  if (!username || !password) {
    return [400, { code: 1, message: '用户名或密码不能为空' }]
  }

  if (userMap[username]) {
    return [409, { code: 1, message: '用户名已存在' }]
  }

  // 新建用户
  userMap[username] = {
    username,
    password,
    name: name || username,
    email: email || '',
    phone: ''
  }

  // 初始化提醒设置
  userSettingsMap[username] = { inSite: false, email: false }
  upcomingReminders[username] = []

  return [200, {
    code: 0,
    message: '注册成功',
    data: {
      userInfo: userMap[username],
      token: '模拟token值'
    }
  }]
})

//
// 修改用户信息（POST /user/update）
//
mock.onPost('/user/update').reply(config => {
  const body = JSON.parse(config.data)
  const { username } = body
  if (!userMap[username]) {
    return [404, { code: 1, message: '用户不存在' }]
  }
  userMap[username] = { ...userMap[username], ...body }
  return [200, { code: 0, data: userMap[username] }]
})

//
// 获取提醒设置（GET /course-reminder/settings?username=xxx）
//
mock.onGet('/course-reminder/settings').reply(config => {
  const { username } = config.params || {}
  if (username && userSettingsMap[username]) {
    return [200, { code: 0, data: userSettingsMap[username] }]
  } else {
    return [404, { code: 1, message: '用户未找到' }]
  }
})

//
// 更新提醒设置（PUT /course-reminder/settings）
//
mock.onPut('/course-reminder/settings').reply(config => {
  const body = JSON.parse(config.data)
  const { username, inSite, email } = body

  if (!username || !userMap[username]) {
    return [400, { code: 1, message: '无效的用户名' }]
  }

  userSettingsMap[username] = {
    inSite: !!inSite,
    email: !!email
  }

  return [200, { code: 0, data: userSettingsMap[username] }]
})

//
// 获取即将提醒（GET /course-reminder/upcoming?username=xxx&limit=n）
//
mock.onGet('/course-reminder/upcoming').reply(config => {
  const { username, limit = 1 } = config.params || {}
  const allReminders = upcomingReminders[username] || []
  const records = allReminders.slice(0, limit)
  return [200, { code: 0, data: { records } }]
})

export default mock
