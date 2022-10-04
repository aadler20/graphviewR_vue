import storage from 'store'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      console.info('login userInfo', userInfo)
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          storage.set(ACCESS_TOKEN, response.result.token, 7 * 24 * 60 * 60 * 1000)
          console.info('login token', response.result.token)
          commit('SET_TOKEN', response.result.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // get user info
    GetInfo ({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          console.info('response.result in GetInfo', response.result)
          const result = response.result[[0]]
          setRole(result)
          if (result.role) {
            const role = result.role
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)

          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // logout
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          resolve()
        }).catch((err) => {
          console.log('logout fail:', err)
          // resolve()
        }).finally(() => {
        })
      })
    }
  }
}

const USER_ROLE_PERMISSIONS = {
  'roleId': 'user',
  'permissionId': 'user',
  'actionEntitySet': [
    {
      'action': 'add',
      'describe': 'add',
      'defaultCheck': false
    },
    {
      'action': 'query',
      'describe': 'query',
      'defaultCheck': false
    },
    {
      'action': 'get',
      'describe': 'get',
      'defaultCheck': false
    },
    {
      'action': 'edit',
      'describe': 'edit',
      'defaultCheck': false
    },
    {
      'action': 'delete',
      'describe': 'delete',
      'defaultCheck': false
    },
    {
      'action': 'run',
      'describe': 'run',
      'defaultCheck': false
    }
  ]
}
const ADMIN_ROLE_PERMISSIONS = {
  'roleId': 'admin',
  'permissionId': 'admin',
  'actionEntitySet': [
    {
      'action': 'add',
      'describe': 'add',
      'defaultCheck': false
    },
    {
      'action': 'query',
      'describe': 'query',
      'defaultCheck': false
    },
    {
      'action': 'get',
      'describe': 'get',
      'defaultCheck': false
    },
    {
      'action': 'edit',
      'describe': 'edit',
      'defaultCheck': false
    },
    {
      'action': 'delete',
      'describe': 'delete',
      'defaultCheck': false
    },
    {
      'action': 'run',
      'describe': 'run',
      'defaultCheck': false
    }
  ]
}
const RESEARCHER_ROLE_PERMISSIONS = {
  'roleId': 'researcher',
  'permissionId': 'researcher',
  'actionEntitySet': [
    {
      'action': 'add',
      'describe': 'add',
      'defaultCheck': false
    },
    {
      'action': 'query',
      'describe': 'query',
      'defaultCheck': false
    },
    {
      'action': 'get',
      'describe': 'get',
      'defaultCheck': false
    },
    {
      'action': 'edit',
      'describe': 'edit',
      'defaultCheck': false
    },
    {
      'action': 'delete',
      'describe': 'delete',
      'defaultCheck': false
    },
    {
      'action': 'run',
      'describe': 'run',
      'defaultCheck': false
    }
  ]
}

// set role
function setRole (result) {
  switch (result.role) {
    case 'user':
      result.role = {
        permissions: [USER_ROLE_PERMISSIONS]
      }
      break
    case 'admin':
      result.role = {
        permissions: [ADMIN_ROLE_PERMISSIONS]
      }
      break
    case 'graphviewr':
      result.role = {
        permissions: [ADMIN_ROLE_PERMISSIONS, RESEARCHER_ROLE_PERMISSIONS]
      }
      break
    default:
      result.role = {
        permissions: [ADMIN_ROLE_PERMISSIONS]
      }
      break
  }
}

export default user
