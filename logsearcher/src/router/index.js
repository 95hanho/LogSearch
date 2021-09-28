import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'

import { store } from '../store/store'

import Login from '../components/Login'
import Num from '../components/Num_Search'
import File from '../components/File_Search'
import Sn from '../components/Sn_Search'
import UserInput from '../components/User_Input'
import UserAdmin from '../components/User_Admin'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { unauthorized: true }
  },
  {
    path: '/#/num_search',
    name: 'Num',
    component: Num
  },
  {
    path: '/#/file_search',
    name: 'File',
    component: File
  },
  {
    path: '/#/sn_search',
    name: 'Sn',
    component: Sn
  },
  {
    path: '/#/user_input',
    name: 'UserInput',
    component: UserInput
  },
  {
    path: '/#/user_admin',
    name: 'UserAdmin',
    component: UserAdmin
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

router.beforeEach(async(to, from,next) => {
  if(VueCookies.get('boardLimit') !== null){
    store.dispatch('boardLimit', { num : VueCookies.get('boardLimit') });
  }

  if(VueCookies.get('accessToken') === null && VueCookies.get('refreshToken') !== null){
    store.dispatch('urlCookie', { url : VueCookies.get('urlCookie') });
    await store.dispatch('refreshToken');
    //await store.dispatch('urlCookie', { url : VueCookies.get('urlCookie') });
  }
  if(to.matched.some(record => record.meta.unauthorized)){
    return next();
  }
  if(VueCookies.get('refreshToken') === null){
    alert('로그인 해주세요.');
    await store.dispatch('logout');
    return router.go();
  }
  if(VueCookies.get('accessToken')){
    return next();
  }
  alert('로그인 해주세요.');
  await store.dispatch('logout');
  return router.go();
})
