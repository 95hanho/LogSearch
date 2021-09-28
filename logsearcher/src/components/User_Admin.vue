<template lang="html">
  <div class="asd">
    <table class="table table-bordered"  style="word-wrap: break-word;">
      <thead>
        <tr>
          <th scope="col" width="40%" bgcolor="#e3f2fd" style="text-align:center; font-weight:bold">아이디</th>
          <th scope="col" width="40%" bgcolor="#e3f2fd" style="text-align:center; font-weight:bold">닉네임</th>
          <th scope="col" width="20%" bgcolor="#e3f2fd" style="text-align:center; font-weight:bold"></th>
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
  data() {
    return{
      userList: []
    }
  },
  components:{
    UserAdminList
  },
  created(){
    this.selectUser();
  },
  methods:{
    selectUser() {
      this.$http.get('/api/auth/users_list')
      .then((res) => {
        this.userList = res.data.users;
      })
    }
  }
}
</script>

<style lang="css" scoped>
</style>
