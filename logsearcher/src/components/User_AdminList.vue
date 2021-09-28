<template lang="html">
  <tr>
    <th scope="col" max-width="80%" style="text-align:center; font-weight:bold;">
      {{ users.username }}
      <hr v-if="xboxPw" style="margin-top: 25px;">
      <label v-if="xboxPw">변경할 비밀번호</label>
      <input v-if="xboxPw" type="password" class="form-control userInform" v-model="updatePw.pw" ref="updatePwEt">
    </th>
    <td scope="col" max-width="80%" style="text-align:center; font-weight:bold;">
      <label v-if="xbox">{{ users.nickname }}</label>
      <input v-if="!xbox" class="form-control userInform" v-model="users.nickname" ref="updateNickEt">
      <hr v-if="xboxPw">
      <label v-if="xboxPw">비밀번호 확인</label>
      <input v-if="xboxPw" type="password" class="form-control userInform" v-model="updatePw.pwCheck" ref="updatePwCheckEt">
    </td>


    <td scope="col" max-width="80%" style="text-align:center; font-weight:bold;">
      <label v-if="xbox">{{ users.authority }}</label>
      <div v-if="!xbox" class="btn-group" role="group">
        <button id="btnGroupDrop1" type="button" class="btn btn-outline-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{ users.authority }}</button>
        <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
          <div class="dropdown-item" @click="changeAuthority('user')">user</div>
          <div class="dropdown-item" @click="changeAuthority('visitor')">visitor</div>
        </div>
      </div>
    </td>

    <td scope="col" max-width="80%" style="text-align:center; font-weight:bold;">
      <a class="btn btn-outline-primary" v-if="adNoDelete&&xbox&&!xboxPw" style="margin-right:3px;" v-on:click="updateUserView">닉네임수정</a>
      <a class="btn btn-outline-success" v-if="adNoDelete&&xbox&&!xboxPw" style="margin-right:3px;" v-on:click="pwChangeView">암호변경</a>
      <a class="btn btn-outline-danger" v-if="adNoDelete&&xbox&&!xboxPw" v-on:click="deleteUser(users.username)">삭제</a>


      <a class="btn btn-outline-primary" v-if="adNoDelete&&!xbox" style="margin-right:5px;" v-on:click="updateUser">수정완료</a>
      <a class="btn btn-outline-danger" v-if="adNoDelete&&!xbox" v-on:click="updateCancel">작업취소</a>

      <br v-if="xboxPw">
      <br v-if="xboxPw">
      <br v-if="xboxPw">
      <br v-if="xboxPw">
      <a class="btn btn-outline-primary" v-if="xboxPw" style="margin-right:5px;" v-on:click="updatePassWord">변경완료</a>
      <a class="btn btn-outline-danger" v-if="xboxPw" v-on:click="updatePwCancel">작업취소</a>
    </td>
  </tr>
</template>

<script>
export default {
  props: ['users'],
  data(){
    return{
      adNoDelete:true,
      xbox:true,
      updatePw:{
        pw:"",
        pwCheck:"",
      },
      xboxPw:false,
      nickStore:"",
      authStore:""
    }
  },
  created(){
    if(this.users.username == 'admin'){
      this.adNoDelete = false;
    }
  },
  methods:{
    deleteUser(username){
      let result = confirm(username +'을 삭제할까요??');
      if(result){
        this.$http.post('/api/auth/delete_user', {
          Username: username
        }).then((res) => {
          if(res.data.success){
            alert(username + ' 삭제완료');
            this.$emit('selectUser');
          }
        })
      }
    },
    changeAuthority(authority){
      this.authStore = this.users.authority;
      this.users.authority = authority;
    },
    updateUserView(){
      this.xbox = false;
      this.nickStore = this.users.nickname;
      this.authStore = this.users.authority;
      setTimeout(() => {
        this.$refs.updateNickEt.focus();
      }, 400);
    },
    pwChangeView(){
      this.xboxPw = true;
      setTimeout(() => {
        this.$refs.updatePwEt.focus();
      }, 400);
    },
    updateUser(){
      if(this.users.nickname.length == 0){
        alert('변경할 닉네임을 입력해주세요.');
        this.$refs.updateNickEt.focus();
      } else {
        this.$http.post('/api/auth/updateUser', {
          users: this.users,
        }).then((res) => {
          if(res.data.success) {
            alert(this.users.username + '의 정보가 수정되었습니다.');
            this.xbox = true;
          } else {
            console.log(res.data.message);
          }
        });
      }

    },
    updatePassWord(){
      if(this.updatePw.pw.length < 4){
        alert('암호는 4자리 이상 입력해주세요.');
        this.$refs.updatePwEt.focus();
      } else if(this.updatePw.pw != this.updatePw.pwCheck){
        alert('암호가 일치하지 않습니다.');
        this.$refs.updatePwCheckEt.focus();
      } else {
        const updateUser = {
          "id":this.users.username,
          "pw":this.updatePw.pw
        }
        this.$http.post('/api/auth/updatePassWord', {
          updateUser: updateUser,
        }).then((res) => {
          if(res.data.success) {
            alert(this.users.username + '의 암호가 변경되었습니다.');
            this.xboxPw = false;
          } else {
            console.log(res.data.message);
          }
        });
      }
    },
    updateCancel(){
      this.xbox = true;
      this.users.nickname = this.nickStore;
      this.users.authority = this.authStore;
    },
    updatePwCancel(){
      this.xboxPw = false;
    }
  }
}
</script>

<style lang="css" scoped>
.userInform{
  background:cornsilk;
}
</style>
