<template lang="html">
  <div class="form-row">
    <div class="col-md-4 mb-3">
      <label for="validationDefault01">아이디</label>
      <input type="text" class="form-control" name="username" id="username" placeholder="id" v-model="username" ref="usernameEt" v-on:keyup.enter="login">
    </div>
    <div class="col-md-4 mb-3">
      <label for="validationDefault01">비밀번호</label>
      <input type="password" class="form-control" name="password" id="password" placeholder="pw" v-model="password" ref="passwordEt" v-on:keyup.enter="login">
    </div>
    <button type="submit" class="btn btn-primary" v-on:click="login">로그인</button>
    <input type="reset" class="btn btn-light" value="reset" v-on:click="resetForm">
  </div>
</template>

<script>
export default {
  props: ['nickname'],
  data(){
    return{
      username:"",
      password:""
    }
  },
  created(){
    let token = this.$store.getters.getToken;
    if(token.access == null){
      this.$emit('nickChange');
    }
  },
  methods:{
    resetForm(){
      this.username = "";
      this.password = "";
      this.$refs.usernameEt.focus();
    },
    login(){
      if(this.username.length == 0){
        alert("아이디를 입력해주세요.");
        this.$refs.usernameEt.focus();
      } else if(this.password.length == 0){
        alert("비밀번호를 입력해주세요.");
        this.$refs.passwordEt.focus();
      } else {
        this.$store.dispatch('login', {
          username: this.username,
          password: this.password
        }).then((res) => {
          if(res.message){
            alert(res.message);
            if(res.message == 'Incorrect username'){
              this.username = "";
              this.password = "";
              this.$refs.usernameEt.focus();
            }
            if(res.message == 'Incorrect passwd'){
              this.password = "";
              this.$refs.passwordEt.focus();
            }
          } else {
            this.$http.post('/api/auth/getNick', {
              accessToken: res.accessToken,
            }).then((res2) => {
              this.$emit('selectnick', res2.data.nickname, res2.data.authority);
              this.$store.dispatch('urlCookie', { url : 'Num' });
              this.$router.push({name: 'Num'}).catch(() => {});
            });
          }
        })
      }
    }
  }
}
</script>

<style lang="css" scoped>
.form-row{
  justify-content: center;
}

</style>