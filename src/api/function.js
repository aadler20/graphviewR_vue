import request from '@/utils/request'

const functionApi = {
  FunctionInfo: '/function/getFunctionInfo',
  FunctionHelp: '/function/getFunctionHelp',
  FunctionExamples: '/function/getFunctionExamples'
}

/**
 * get Function Info
 */
export function getFunctionInfo (parameter) {
  return request({
    url: functionApi.FunctionInfo,
    method: 'post',
    data: parameter
  })
}

/**
 * get Function Help
 */
export function getFunctionHelp (parameter) {
  return request({
    url: functionApi.FunctionHelp,
    method: 'post',
    data: parameter
  })
}

/**
 * get Function Examples
 */
export function getFunctionExamples (parameter) {
  return request({
    url: functionApi.FunctionExamples,
    method: 'post',
    data: parameter
  })
}
