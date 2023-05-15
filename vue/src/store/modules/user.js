import { login, logout, getInfo , forget} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    username: '',
    avatar: '',
    password: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, username) => {
    state.username = username
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PWD: (state, password) => {//
    state.password = password
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, email } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, email: email }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  signup({ commit }, userInfo) {
    const { username, password, email } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, email: email }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        console.log(response)
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const { username, password,avatar } = data
        commit('SET_NAME', username)
        commit('SET_PWD', password)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  //忘记密码
  forget({ commit }, userInfo) {
    const { username, email } = userInfo
    return new Promise((resolve, reject) => {
      forget({ username: username.trim(), email: email }).then(response => {
        const { data } = response
        console.log(data)
          // commit('SET_TOKEN', data.token)
          // setToken(data.token)
          resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // login({ commit }, userInfo) {
  //   const { username, password, email } = userInfo
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password, email: email }).then(response => {
  //       const { data } = response
  //       commit('SET_TOKEN', data.token)
  //       setToken(data.token)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },


  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

