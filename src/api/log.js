import request from '@/utils/request'

const logApi = {
  trendLog: '/log/trend',
  hoursLog: '/log/hours',
  listLog: '/log/list',
  updateLog: '/log/update'
}

/**
 * list Log
 */
export function listLog (parameter) {
  return request({
    url: logApi.listLog,
    method: 'post',
    data: parameter
  })
}

/**
 * hours distribution
 */
export function hoursLog (parameter) {
  return request({
    url: logApi.hoursLog,
    method: 'post',
    data: parameter
  })
}

/**
 * time trend
 */
export function trendLog (parameter) {
  return request({
    url: logApi.trendLog,
    method: 'post',
    data: parameter
  })
}

/**
 * update Log
 */
export function updateLog (parameter) {
  return request({
    url: logApi.updateLog,
    method: 'post',
    data: parameter
  })
}
