import axios from "@/service/axios";
import VueCookies from "vue-cookies";
import router from "@/router";
//로그인 처리 관련 저장소 모듈
export const login = {
  // state와 state에 토큰값을 저장하는건 사실상 안씀
  state: {
    // 테스트
    //host: 'http://localhost:3000',
    accessToken: null,
    refreshToken: null,
  },
  mutations: {
    loginToken(state, payload) {
      VueCookies.set("accessToken", payload.accessToken, "600s");
      VueCookies.set("refreshToken", payload.refreshToken, "1800s");
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
    },
    refreshToken(state, payload) {
      VueCookies.set("accessToken", payload.accessToken, "600s");
      VueCookies.set("refreshToken", payload.refreshToken, "1800s");
      VueCookies.set("urlCookie", VueCookies.get("urlCookie"), "1800s");
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
    },
    removeToken() {
      VueCookies.remove("accessToken");
      VueCookies.remove("refreshToken");
      VueCookies.remove("urlCookie");
    },
    urlCookie(state, payload) {
      VueCookies.set("urlCookie", payload.url, "1800s");
    },
    boardLimit(state, payload) {
      VueCookies.set("boardLimit", payload.num, "30d");
    },
  },
  getters: {
    //쿠키에 저장된 토큰 가져오기
    getToken() {
      let ac = VueCookies.get("accessToken");
      let rf = VueCookies.get("refreshToken");
      return {
        access: ac,
        refresh: rf,
      };
    },
    getUrl() {
      let rc = VueCookies.get("urlCookie");
      return rc;
    },
    getBoardLimit() {
      let bl = VueCookies.get("boardLimit");
      return bl;
    },
  },
  // promise를 써야 interceptors에서 재발급 요청을 한 후 처리할 때 무한 요청 현상이 안남
  // 비동기 통신 부분을 promise로 처리하고 받는 쪽에선 async/await로 처리하는게 좋음
  actions: {
    login: ({ commit }, params) => {
      return new Promise((resove, reject) => {
        axios
          .post("/api/auth/login", params)
          .then((res) => {
            if (res.data.message) {
              resove(res.data);
            } else {
              commit("loginToken", res.data);
              resove(res.data);
            }
          })
          .catch((err) => {
            console.log(err.message);
            reject(err.message);
          });
      });
    },
    refreshToken: ({ commit }) => {
      // accessToken 재요청
      //accessToken 만료로 재발급 후 재요청시 비동기처리로는 제대로 처리가 안되서 promise로 처리함
      return new Promise((resolve, reject) => {
        let param = { refreshToken: VueCookies.get("refreshToken") };
        axios
          .post("/api/auth/reToken", param)
          .then((res) => {
            if (res.data.msg == "success") {
              commit("refreshToken", res.data);
              resolve(res);
            } else {
              commit("removeToken");
              router.push({ name: "Login" });
              //router.go();
              resolve(res);
            }
          })
          .catch((err) => {
            console.log("refreshToken error : ", err.config);
            reject(err.config.data);
          });
      });
    },
    logout: ({ commit }) => {
      // 로그아웃
      commit("removeToken");
    },
    urlCookie: ({ commit }, params) => {
      commit("urlCookie", params);
    },
    boardLimit: ({ commit }, params) => {
      commit("boardLimit", params);
    },
  },
};
