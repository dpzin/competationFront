import request from '@/utils/request'

export const getCompetitionList = params => {
  return request.post('bjss/listCompetition', { params })
}
