<template lang="html">
  <div class="sn_search">
    <div class="form-row">
      <div class="col-md-4 mb-3">
        <label for="validationDefault01" title="4자리 이상, 10자리 이하 입력 필요"><b>발 송 일 <font color=red>*</font></b></label>
        <input type="text" class="form-control" v-on:keyup="inputDateSlash" v-model="logInfo.send_date" ref="dateEt" id="send_date" placeholder="ex> YYYYMMDD, YYYY-MM-DD, YYYY/MM/DD" minlength="4" maxlength="10" title="4자리 이상, 10자리 이하 입력 필요" required>
      </div>
      <div class="col-md-4 mb-3">
        <label for="validationDefault01" title="4자리 이상, 14자리 이하 입력 필요"><b>S N <font color=red>*</font></b></label>
        <input type="text" class="form-control" v-model="logInfo.sn" id="sn" ref="snEt" minlength="4" maxlength="14" placeholder="SN">
      </div>
    </div>
    <div class="form-row">
      <div class="col-md-4 mb-3 btn-group-toggle">
        <label class="btn btn-outline-secondary" style="margin-right:3px;">
          <input type ="checkbox" v-on:click="go_Hide" title="시간범위 조건 검색">상세조회
        </label>
        <input class="btn btn-primary" style="margin-right:3px;" type ="button" value="Log 조회" v-on:click="logSearch" title="상기 조건으로 당일기준 6개월 이내 자료에서 Log 조회되며 결과는 최대 1만건만 표시됨">
        <input class="btn btn-outline-danger" style="margin-right:3px;" type ="reset" v-on:click="resetLoginfo" title="조건 삭제">
        <a class="btn btn-outline-success" onclick="history.back()" title="초기화면으로 이동">이전페이지</a>
        <br>
	<br>
        <center><label for="validationDefault03" title="검색성능 제한으로 인해 최대 1만건까지만 조회됨">Search Total Count : <b><u>{{ count }}</u></b>건<font size=2> (최대 1만건만 조회됨)</font></label></center>
      </div>
      <div class="col-md-4 mb-31" style="display:none" v-show="timeShow">
        <label for="validationDefault01" title="' : ' 는 자동으로 입력되며 수동으로 입력하셔도 됩니다."><b>시간범위(Start Time)</b></label>
        <input type="text" class="form-control" v-on:keyup="stTimeColon" v-model="logInfo.st_time" id="st_time" minlength="6" maxlength="8" placeholder="ex> hhmmss, hh:mm:ss" title="' : ' 는 자동으로 입력되며 수동으로 입력하셔도 됩니다.">
      </div>
      <div class="col-md-4 mb-31" style="display:none" v-show="timeShow">
        <label for="validationDefault01" title="' : ' 는 자동으로 입력되며 수동으로 입력하셔도 됩니다."><b>시간범위(End Time)</b></label>
        <input type="text" class="form-control" v-on:keyup="edTimeColon" v-model="logInfo.ed_time" id="ed_time" minlength="6" maxlength="8" placeholder="ex> hhmmss, hh:mm:ss" title="' : ' 는 자동으로 입력되며 수동으로 입력하셔도 됩니다.">
      </div>

      <div class="container">
        <!-- 검색 결과없거나 실패했을 시 -->
        <div v-if="searchEmpty" style="text-align: center;">검색결과 없음</div>
        <!-- 검색 성공 시 -->
        <SearchList v-if="resultView" v-bind:searchValue="searchValue"/>
      </div>

    </div>
  </div>
</template>

<script>
import SearchList from './Sn_SearchList.vue'

export default {
  data() {
    return {
      count: 0,
      timeShow: false,
      searchEmpty: false,
      resultView: false,
      logInfo: {
        send_date: "",
        sn: "",
        st_time: "",
        ed_time: ""
      },
      searchValue: [],
    }
  },
  components: {
    SearchList,
  },
  methods: {
    go_Hide() {
      if(this.timeShow){
        this.timeShow = false;
      }
      else{
        this.timeShow = true;
      }
    },
    resetLoginfo() {
      this.logInfo.send_date = ""
      this.logInfo.sn = ""
      this.logInfo.st_time = ""
      this.logInfo.ed_time = ""
    },
    stTimeColon() {
      var time = this.logInfo.st_time;
      var replaceTime = time.replace(/:/g, "");
      if(replaceTime.length >= 6 && replaceTime.length < 7) {
        this.logInfo.st_time = this.mappingTime(replaceTime);
      }
    },
    edTimeColon() {
      var time = this.logInfo.ed_time;
      var replaceTime = time.replace(/:/g, "");
      if(replaceTime.length >= 6 && replaceTime.length < 7) {
        this.logInfo.ed_time = this.mappingTime(replaceTime);
      }
    },
    mappingTime(replaceValue){
      var hours = replaceValue.substring(0, 2);
      var minute = replaceValue.substring(2, 4);
      var sec = replaceValue.substring(4, 6);

      if(isFinite(hours + minute + sec) == false) {
          alert("문자는 입력하실 수 없습니다.");
          return "00:00:00";
      }
      if(hours + minute + sec > 235959) {
          alert("시간은 24시를 넘길 수 없습니다.");
          return "00:00:00";
      }
      if(minute + sec > 5900) {
          alert("분은 60분을 넘길 수 없습니다.");
          return hours + ":00:00";
      }
      if(sec > 59) {
          alert("초는 60초를 넘길 수 없습니다.");
          return hours + ":" + minute + ":00";
      }
      return hours + ":" + minute + ":" + sec;
    },
    inputDateSlash() {
      var date = this.logInfo.send_date;
      var replaceDate = date.replace(/\//g, "").replace(/-/g, "");
      var year = replaceDate.substring(0, 4);
      var month = replaceDate.substring(4, 6);
      var day = replaceDate.substring(6, 8);

      if(isFinite(replaceDate) == false || date.charAt(0) == '/' || date.charAt(0) == '-'){
        alert("문자는 입력하실 수 없습니다.");
        this.logInfo.send_date = replaceDate.substring(0, replaceDate.length-1);
      } else if(replaceDate.length == 4){
        if(year > 2999) {
          alert("년도는 3000년을 넘길 수 없습니다.");
          this.logInfo.send_date = "20";
          return;
        }
        this.logInfo.send_date = year;
      } else if(replaceDate.length == 5){
        if(replaceDate.charAt(4) != '0' && replaceDate.charAt(4) != '1'){
          alert("월은 0 또는 1로 시작합니다.");
          this.logInfo.send_date = year;
        }
      } else if(replaceDate.length == 6){
        if(month > 12 || month == '00') {
          alert("월은 01 ~ 12월 사이의 값을 사용하여 주십시오.");
          this.logInfo.send_date = year + "/" + month.charAt(0);
          return;
        }
        this.logInfo.send_date = year + "/" + month;
      } else if(replaceDate.length == 7){
        if(replaceDate.charAt(6) != '0' && replaceDate.charAt(6) != '1' && replaceDate.charAt(6) != '2' && replaceDate.charAt(6) != '3'){
          alert("일은 0, 1, 2, 3로 시작합니다.");
          this.logInfo.send_date = year + "/" + month;
        }
      } else if(replaceDate.length == 8){
        if(day == '00' || day > 31) {
            alert("일은 01 ~ 31일 사이의 값을 사용하여 주십시오.");
            this.logInfo.send_date = year + "/" + month + "/" + day.charAt(0);
        }
        this.logInfo.send_date = year + "/" + month + "/" + day;
      }
    },
    logSearch() {
      if(this.logInfo.send_date.length < 7){
        alert("발송일을 입력해주세요.");
        this.$refs.dateEt.focus();
      } else if(this.logInfo.sn.length == 0){
        alert("시리얼 번호를 입력해주세요.");
        this.$refs.snEt.focus();
      } else{
        this.$http.post('/api/elastic/search_sn', {
          logInfo: this.logInfo,
        }).then((res) => {
          let success = res.data.success;
          if(success){
            this.count = res.data.logResult.hits.total.value;
            if(this.count == 0){
              this.searchEmpty = true;
              this.resultView = false;
            } else{
              this.searchEmpty = false;
              this.resultView = true;
            }
            this.searchValue = res.data.logResult.hits;
          } else{
            alert(res.data.logResult);
          }
        })
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
