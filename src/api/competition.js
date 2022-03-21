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

// 新增裁判
export const addProjectJudge = (params) => {
  return request.post('/createJudge', { ...params })
}

// 获取裁判列表的接口
export const getJudgesList = (params) => {
  return request.post('/listJudge', { ...params })
}

// 删除裁判
export const deleteJudge = (params) => {
  return request.post('/deleteJudge', { ...params })
}

// 新增选手
export const addProjectMember = (params) => {
  return request.post('/createCompetitionMember', { ...params })
}

// 获取赛事项目选手列表
export const getProjectMember = (params) => {
  return request.post('/listCompetitionMember', { ...params })
}

// 选手签到
export const memberSign = (params) => {
  return request.post('/sign', { ...params })
}

// 删除选手
export const deleteMember = (params) => {
  return request.post('/deleteCompetitionMember', { ...params })
}

// 裁判打分
export const inputScore = (params) => {
  return request.post('/inputMemberScore', { ...params })
}

// 获取对战步骤表
export const listBattleTask = (params) => {
  return request.post('/listBattleTask', { ...params })
}

// 获取对战成员表
export const listBattleInfo = (params) => {
  return request.post('/listBattleInfo', { ...params })
}

// 生成对战图
export const generateBattleInfo = (params) => {
  return request.post('/generateBattleInfo', { ...params })
}

// 二海选手
export const updateAudition2Result = (params) => {
  return request.post('/updateAudition2Result', { ...params })
}

// 判决
export const judgeWinner = (params) => {
  return request.post('/judgeWinner', { ...params })
}

// 获取大屏battleTree
export const listBigScreenBattleInfo = (params) => {
  return request.post('/listBigScreenBattleInfo', { ...params })
}

// 获取大屏battle1v1
export const getBattleInfo = (params) => {
  return request.post('/getBattleInfo', { ...params })
}

// 获取海选名单
export const listSeaSelection = (params) => {
  return request.post('/listSeaSelection', { ...params })
}
