import Vue from 'vue'
import Vuex from 'vuex'

import { login } from './module/login'; //로그인 모듈
import { loding } from './module/loding';

Vue.use(Vuex) //vue에 Vuex를 설정

export const store = new Vuex.Store({
  modules: {
    login,
    loding
  },
  mutations: {
  },
  plugins: [
  ]
})
