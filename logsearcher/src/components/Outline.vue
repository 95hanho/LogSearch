<template lang="html">
  <table class="table">
    <thead class="thead-dark">
      <tr>
        <th scope="col" width="20%" bgcolor="#e3f2fd" style="text-align:center; font-weight:bold">
          <h1 class="display-5"><font color=red>L</font><font size = 6>OG</font> <font color=red>S</font><font size = 6>EARCHER</font></h1>
          <h3 class="lead" v-if="loginPage"><b>로그인</b> WEB Page 입니다.</h3>
          <h3 class="lead" v-if="numPage"><b>문자 발송 내역</b>을 조회하는 WEB Page 입니다.</h3>
          <h3 class="lead" v-if="filePage"><b>문자 발송 내역</b>을 엑셀파일로 다운로드하여 조회하는 WEB Page 입니다.</h3>
          <h3 class="lead" v-if="userInputPage"><b>사용자 관리</b>하는 WEB Page 입니다.</h3>
          <h3 class="lead" v-if="userAdminPage"><b>사용자 관리</b>하는 WEB Page 입니다.</h3>
        </th>
      </tr>
      <tr>
        <th>
          <center v-if="numPage">
            조건이 많을수록 정확하고 빨리 데이터가 조회 됩니다.
            <br>
            <font size=2>※ 당일기준</font><font color=red> 6개월</font><font size=2> 이내 자료에서 검색되며</font><font color=red> 발송일</font>
            <font size=2>,</font><font color=red> 발신번호</font><font size=2> 는</font><font color=red>  필수</font><font size=2> 입니다.</font>
          </center>
          <center v-if="filePage">
            파일을 올리고 파일업로드를 클릭하면 결과 엑셀파일이 다운로드 됩니다.
            <br>
            <font size=2>※ 당일기준</font><font color=red> 6개월</font><font size=2> 이내 자료에서 검색되며</font><font color=red> 날짜(발송일)</font>
            <font size=2>,</font><font color=red> 발신번호</font><font size=2> 는</font><font color=red>  필수</font><font size=2> 입니다.</font>
          </center>
          <center v-if="loginPage">
            로그인을 해주세요.
            <br>
            <font size=2>※ <font color=red>회원가입</font>이나 <font color=red>아이디</font>, <font color=red>비밀번호 분실</font> 시 관리자에게 요청바랍니다.</font>
          </center>
          <center v-if="userInputPage">
            사용자의 계정을 <font color=red>추가</font>, <font color=red>수정</font>, <font color=red>삭제</font> 할 수 있습니다.
            <br>
            <font size=2>※ 관리자 권한은 DB에서 설정가능합니다. 관리자 계정은 삭제할 수 없으며, 삭제 후 되돌리기는 불가능합니다.</font>
          </center>
          <center v-if="userAdminPage">
            사용자의 계정을 <font color=red>삭제</font>할 수 있습니다.
            <br>
            <font size=2>※ 관리자 계정은 삭제할 수 없으며, 삭제 후 되돌리기는 불가능합니다..</font>
          </center>
        </th>
      </tr>
    </thead>
  </table>
</template>

<script>
export default {
  props:['urlCookie'],
  data(){
    return{
      numPage:false,
      filePage:false,
      loginPage:true,
      userInputPage:false,
      userAdminPage:false,
    }
  },
  computed: {
  },
  created() {
  },
  watch: {
    urlCookie: {
      deep: false,
      handler() {
        this.numPage = false;
        this.filePage = false;
        this.loginPage = false;
        this.userInputPage = false;
        this.userAdminPage = false;
        if(this.urlCookie == null){
          this.loginPage = true;
        } else if(this.urlCookie == 'Num'){
          this.numPage = true;
        } else if(this.urlCookie == 'File'){
          this.filePage = true;
        } else if(this.urlCookie == 'UserInput'){
          this.userInputPage = true;
        } else if(this.urlCookie == 'UserAdmin'){
          this.userAdminPage = true;
        }
      }
    },
    //'$route'(to, from) {
  },
}
</script>

<style lang="css" scoped>
</style>
