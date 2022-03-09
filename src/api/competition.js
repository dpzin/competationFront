import request from '@/utils/request'

// 获取赛事列表
export const getCompetitionList = params => {
  return request.post('/listCompetition', { params })
}

// 新增赛事
export const addCompetition = (params) => {
  return request.post('/createCompetition', { ...params })
}

// 删除赛事
export const deleteCompetition = (params) => {
  return request.post('/deleteCompetition', { ...params })
}

// 获取赛事详情
export const getCompetitionDetail = (params) => {
  return request.post('/getCompetition', { ...params })
}

// 更新赛事
export const updateCompetition = (params) => {
  return request.post('/updateCompetition', { ...params })
}

// 获取赛事项目
export const getCompetitionProject = (params) => {
  return request.post('/listCompetitionProject', { ...params })
}

// 新增选手
export const addCompetitionMember = (params) => {
  return request.post('/createCompetitionMember', { ...params })
}

// 获取赛事选手列表
export const getCompetitionMember = (params) => {
  return request.post('/listCompetitionMember', { ...params })
}

// 选手签到
export const memberSign = (params) => {
  return request.post('/sign', { ...params })
}

