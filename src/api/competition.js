import request from '@/utils/request'

export const getCompetitionList = params => {
  return request.get('api/listCompetition', { params })
}
