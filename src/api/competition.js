import request from '@/utils/request'

export const photoUploadUrl = '127.0.0.1:16666/uploadPhotos'

export const getCompetitionList = params => {
  return request.post('/listCompetition', { params })
}
