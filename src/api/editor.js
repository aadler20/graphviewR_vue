import request from '@/utils/request'

const editorApi = {
  evalCode: '/editor/eval',
  saveCode: '/editor/save'
}

/**
 * run R Code
 */
export function evalCode (parameter) {
  return request({
    url: editorApi.evalCode,
    method: 'post',
    data: parameter
  })
}

/**
 * save R Code
 */
export function saveCode (parameter) {
  return request({
    url: editorApi.saveCode,
    method: 'post',
    data: parameter
  })
}
