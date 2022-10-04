import request from '@/utils/request'

const taskApi = {
  saveTask: '/task/save',
  removeTask: '/task/remove',
  listTask: '/task/list',
  updateTask: '/task/update'
}

/**
 * list task
 */
export function listTask (parameter) {
  return request({
    url: taskApi.listTask,
    method: 'post',
    data: parameter
  })
}

/**
 * remove task
 */
export function removeTask (parameter) {
  return request({
    url: taskApi.removeTask,
    method: 'post',
    data: parameter
  })
}

/**
 * save task
 */
export function saveTask (parameter) {
  return request({
    url: taskApi.saveTask,
    method: 'post',
    data: parameter
  })
}

/**
 * update task
 */
export function updateTask (parameter) {
  return request({
    url: taskApi.updateTask,
    method: 'post',
    data: parameter
  })
}
