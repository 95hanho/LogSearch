<template lang="html">
  <div class="user_input">
    <center style="font-size:35px;font-weight:800;">사용자 추가</center>
    <br>
    <div class="form-row">
      <div class="col-md-6 mb-3">
        <label for="validationDefault01"><b>아이디</b></label>
        <input type="text" class="form-control" v-model="user.username" ref="usernameEt" placeholder="id" minlength="4" maxlength="10">
      </div>
      <div class="col-md-6 mb-3">
        <label for="validationDefault01"><b>닉네임</b></label>
        <input type="text" class="form-control" v-model="user.nickname" ref="nicknameEt" placeholder="nick" minlength="4" maxlength="14">
      </div>
      <div class="col-md-6 mb-3">
        <label for="validationDefault01" ><b>비밀번호</b></label>
        <input type="password" class="form-control" v-model="user.password" ref="passwordEt" placeholder="pw" minlength="4" maxlength="14">
      </div>
      <div class="col-md-6 mb-3">
        <label for="validationDefault01" ><b>비밀번호 확인</b></label>
        <input type="password" class="form-control" v-model="user.passwordCheck" ref="passwordCEt" placeholder="pwCheck" minlength="4" maxlength="14">
      </div>
    </div>
    <div class="form-row">
      <div class="col-md-4 mb-3 btn-group-toggle">
        <input class="btn btn-primary" style="margin-right:5px;" type ="button" value="사용자추가" v-on:click="joinUser">
        <input class="btn btn-outline-danger" type="reset" v-on:click="resetForm"  value="초기화">
      </div>
    </div>
    <hr>
    <center style="font-size:35px;font-weight:800;">사용자 리스트</center>
    <br>
    <table class="table table-bordered"  style="word-wrap: break-word;">
      <thead>
        <tr>
          <th scope="col" width="24%" bgcolor="#e3f2fd" style="text-align:center; font-weight:bold">아이디</th>
          <th scope="col" width="24%" bgcolor="#e3f2fd" style="text-align:center; font-weight:bold">닉네임</th>
          <th scope="col" width="24%" bgcolor="#e3f2fd" style="text-align:center; font-weight:bold">권한</th>
          <th scope="col" width="28%" bgcolor="#e3f2fd" style="text-align:center; font-weight:bold"></th>
        </tr>
      </thead>
      <tbody v-for="users in userList" :key="users">
        <UserAdminList v-bind:users="users" @selectUser="selectUser"/>
      </tbody>
    </table>
  </div>
</template>

<script>
import UserAdminList from './User_AdminList.vue'

export default {
  data(){
    return{
      user: {
        username:"",
        password:"",
        nickname:"",
        passwordCheck:""
      },
      userList: [],
    }
  },
  components:{
    UserAdminList
  },
  created(){
    this.selectUser();
  },
  methods: {
    resetForm(){
      this.user.username = "";
      this.user.password = "";
      this.user.nickname = "";
      this.user.passwordCheck = "";
      this.$refs.usernameEt.focus();
    },
    joinUser(){
      if(this.user.username.length == 0){
        alert("아이디를 입력해주세요.");
        this.$refs.usernameEt.focus();
      } else if(this.user.password.length == 0){
        alert("비밀번호를 입력해주세요.");
        this.$refs.passwordEt.focus();
      } else if(this.user.nickname.length == 0){
        alert("닉네임을 입력해주세요.");
        this.$refs.nicknameEt.focus();
      } else if(this.user.passwordCheck.length == 0){
        alert("비밀번호확인을 입력해주세요.");
        this.$refs.passwordCEt.focus();
      } else if(this.user.password != this.user.passwordCheck){
        alert("비밀번호가 일치하지 않습니다.");
      } else{
        this.$http.post('/api/auth/joinUser', {
          user: this.user
        }).then((res) => {
          console.log(res.data.success);
          alert(res.data.message);
          this.user.username = "";
          this.user.password = "";
          this.user.nickname = "";
          this.user.passwordCheck = "";
          this.selectUser();
        })
      }
    },
    selectUser() {
      this.$http.get('/api/auth/users_list')
      .then((res) => {
        this.userList = res.data.users;
      })
    }
  },
}
</script>

<style lang="css" scoped>
</style>
