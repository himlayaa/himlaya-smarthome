import Cookies from 'js-cookie'
import { getData } from  '@/api/weather.js'

const state = {
    code: 0
}

const mutations = {

  SET_CODE: (state, num) => { //切换设备
    state.code = num
  }
}

const actions = {
    weatherTest() {
        //const { username, password, email } = userInfo
        return new Promise((resolve, reject) => {
          getData().then(response => {
            console.log(response)     
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
