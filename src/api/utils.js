import request from '@/utils/request'

const utilsApi = {
  HasInternet: '/utils/hasInternet'
}

export function hasInternet (parameter) {
  return request({
    url: utilsApi.HasInternet,
    method: 'post',
    data: parameter
  })
}
