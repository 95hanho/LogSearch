<template>
  <div id="app">
    <Menubar v-bind:nickname="nickname" :selectMenu="selectMenu" v-bind:adminView="adminView" @nickChange="nickChange" @changeUrl="changeUrl"/>
    <div class="container" id="containers">
      <Outline :urlCookie="urlCookie"/>
      <router-view @selectnick="selectnick" @nickChange="nickChange"/>
    </div>
    <div class="container" id="spaceDiv"></div>
  </div>
</template>

<script>
import Menubar from './components/Menubar.vue'
import Outline from './components/Outline.vue'

export default {
  data(){
    return{
      nickname:"",
      adminView:false,
      selectMenu:"메뉴 선택",
      urlCookie:"",
    }
  },
  components: {
    Menubar,
    Outline
  },
  watch: {
    // by changeing router url
    '$route'() {
      this.urlCookie = this.$cookies.get('urlCookie');
      if(!this.urlCookie){
        this.selectMenu = "메뉴 선택";
      }
    }
  },
  created() {
    // state maintain despite reload
    setTimeout(() => {
      let token = this.$store.getters.getToken;
      if(token.refresh != null){
        this.$http.post('/api/auth/getNick', {
          accessToken: token.access,
        }).then((res2) => {
          this.selectMenu = "메뉴 선택";
          this.nickname = res2.data.nickname;
          if(res2.data.authority == 'admin'){
            this.adminView = true;
          }
          const url = this.$store.getters.getUrl;
          if(url){
            this.$router.push({name: url}).catch(() => {});
            if(url == 'Num'){
              this.selectMenu = "번호 검색";
            } else if(url == 'File'){
              this.selectMenu = "파일 검색";
            } else if(url == 'UserInput'){
              this.selectMenu = "사용자 관리";
            } else if(url == 'UserAdmin'){
              this.selectMenu = "사용자 관리";
            }
          } else {
            alert('url 정보가 안남아 있어요.');
            this.$store.dispatch('logout');
            this.nickname = "";
            this.selectMenu = "메뉴 선택";
            this.adminView = false;
          }
        });
      } else{
        this.nickname = "";
        this.selectMenu = "메뉴 선택";
        this.adminView = false;
      }
    }, 100);
  },
  methods:{
    selectnick(nickname, authority){
      this.nickname = nickname;
      if(authority == 'admin'){
        this.adminView = true;
      }
    },
    nickChange(){
      this.nickname = "";
      this.adminView = false;
    },
    changeUrl(text){
      this.selectMenu = text;
    }
  }
}
</script>

<style>
#containers{
    min-width: 1100px;
    max-width: 1400px;
}
#spaceDiv{
    width:100%;
    height:50px;
}
</style>
