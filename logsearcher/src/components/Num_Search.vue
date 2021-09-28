<template lang="html">
  <div class="num_search">
    <div class="form-row">
      <div class="col-md-4 mb-3">
        <label for="validationDefault01" title="6자리 이상, 10자리 이하 입력 필요"><b>발 송 일 <font color=red>*</font></b></label>
        <input type="text" class="form-control" v-on:keyup="inputDateSlash" v-model="logInfo.send_date" v-on:keyup.enter="logSearch(pagingProcess.currentPage, pagingProcess.boardLimit, true)" ref="dateEt" id="send_date" placeholder="ex> YYYYMMDD, YYYY-MM-DD, YYYY/MM/DD" minlength="4" maxlength="10" title="4자리 이상, 10자리 이하 입력 필요" required>
      </div>
      <div class="col-md-4 mb-3">
        <label for="validationDefault01" title="4자리 이상, 14자리 이하 입력 필요"><b>발 신 번 호 <font color=red>*</font></b></label>
        <input type="text" class="form-control" v-on:keyup="inputNumSlash" v-model="logInfo.call_number" v-on:keyup.enter="logSearch(pagingProcess.currentPage, pagingProcess.boardLimit, true)" id="call_number" ref="callEt" placeholder="ex> 010xxxxyyyy, yyyy, 010-xxxx-yyyy" minlength="4" maxlength="14" title="4자리 이상, 14자리 이하 입력 필요">
      </div>
      <div class="col-md-4 mb-3">
        <label for="validationDefault01" title="4자리 이상, 14자리 이하 입력"><b>수 신 번 호</b></label>
        <input type="text" class="form-control" v-on:keyup="inputNumSlash" v-model="logInfo.da_number" v-on:keyup.enter="logSearch(pagingProcess.currentPage, pagingProcess.boardLimit, true)" id="da_number" placeholder="ex> 010xxxxyyyy, yyyy, 010-xxxx-yyyy" minlength="4" maxlength="14" title="4자리 이상, 14자리 이하 입력">
      </div>
    </div>
    <div class="form-row">
      <div class="col-md-4 mb-3 btn-group-toggle">
        <label class="btn btn-outline-secondary" style="margin-right:3px;">
          <input type ="checkbox" v-on:click="go_Hide" title="시간범위 조건 검색" >상세조회
        </label>
        <input class="btn btn-primary" style="margin-right:3px;" type ="button" value="Log 조회" v-on:click="logSearch(pagingProcess.currentPage, pagingProcess.boardLimit, true)" title="상기 조건으로 당일기준 6개월 이내 자료에서 Log 조회되며 결과는 최대 1만건만 표시됨">
        <input class="btn btn-outline-danger" type ="reset" v-on:click="resetLoginfo" style="margin-right:3px;">
        <div class="btn-group" role="group">
          <button class="btn btn-outline-success dropdown-toggle" data-toggle="dropdown">{{ logInfo.category }}</button>
          <div class="dropdown-menu">
            <div class="dropdown-item" @click="changeCategory('All')">All</div>
            <div class="dropdown-item" @click="changeCategory('Agent')">Agent</div>
            <div class="dropdown-item" @click="changeCategory('Web')">Web</div>
            <div class="dropdown-item" @click="changeCategory('Messenger')">Messenger</div>
          </div>
        </div>
 
        <br>
        <br>
        <label for="validationDefault03" style="margin-left:10px;" title="검색성능 제한으로 인해 최대 1만건까지만 조회됨">Search Total Count : <b><u>{{ count }}</u></b>건<font size=2> (최대 1만건만 조회됨)</font></label>
      </div>
      <div class="col-md-4 mb-31" style="display:none" v-show="timeShow">
        <label for="validationDefault01" title="' : ' 는 자동으로 입력되며 수동으로 입력하셔도 됩니다."><b>시간범위(Start Time)</b></label>
        <input type="text" @keyup.enter="logSearch(pagingProcess.currentPage, pagingProcess.boardLimit, true)" class="form-control" ref="stEt" v-on:keyup="stTimeColon" v-model="logInfo.st_time" id="st_time" minlength="6" maxlength="8" placeholder="ex> hhmmss, hh:mm:ss" title="' : ' 는 자동으로 입력되며 수동으로 입력하셔도 됩니다.">
      </div>
      <div class="col-md-4 mb-31" style="display:none" v-show="timeShow">
        <label for="validationDefault01" title="' : ' 는 자동으로 입력되며 수동으로 입력하셔도 됩니다."><b>시간범위(End Time)</b></label>
        <input type="text" @keyup.enter="logSearch(pagingProcess.currentPage, pagingProcess.boardLimit, true)" class="form-control" ref="edEt" v-on:keyup="edTimeColon" v-model="logInfo.ed_time" id="ed_time" minlength="6" maxlength="8" placeholder="ex> hhmmss, hh:mm:ss" title="' : ' 는 자동으로 입력되며 수동으로 입력하셔도 됩니다.">

      </div>

      <div class="container">
        <Spinner :loading="$store.getters.getLodingStatus"/>

        <!-- 검색 결과없거나 실패했을 시 -->
        <div v-if="searchEmpty" style="text-align: center;">검색결과 없음</div>

        <!-- 검색 성공 시 -->
        <CpidsList v-if="resultView" v-bind:searchAllValue="searchAllValue"/>
        <SearchList v-if="resultView" :searchValue="searchValue" @changeBlimit="changeBlimit" @logSearch="logSearch" :pagingProcess="pagingProcess" @changePage="changePage" :authority="authority"/>
      </div>

    </div>
  </div>
</template>

<script>
import CpidsList from './CpidsList.vue'
import SearchList from './SearchList.vue'
import Spinner from '@/components/Spinner'

export default {
  data() {
    return {
      count: "",
      timeShow: false,
      searchEmpty: false,
      resultView: false,
      logInfo: {
        send_date: "",
        da_number: "",
        call_number: "",
        st_time: "",
        ed_time: "",
        category: "카테고리"
      },
      searchValue: [],
      searchAllValue: [],
      pagingProcess: {
        currentPage: 1,
        boardLimit: 1000,
      },
      authority:"",
    }
  },
  created() {
    const bl = this.$cookies.get('boardLimit');
    if(bl){
      this.pagingProcess.boardLimit = bl;
    } else {
      this.pagingProcess.boardLimit = 1000;
    }
  },
  components: {
    CpidsList,
    SearchList,
    Spinner
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
    changeCategory(category){
      this.logInfo.category = category;
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
    inputNumSlash() {
      var da = this.logInfo.da_number;
      var call = this.logInfo.call_number;
      var replaceDa = da.replace(/x/g, "").replace(/-/g, "");
      var replaceCall = call.replace(/x/g, "").replace(/-/g, "");

      if(isFinite(replaceDa) == false || da.charAt(0) == 'x' || da.charAt(0) == '-'){
        alert("문자는 입력하실 수 없습니다.");
        this.logInfo.da_number = da.substring(0, da.length-1);
      }
      if(isFinite(replaceCall) == false || call.charAt(0) == 'x' || call.charAt(0) == '-'){
        alert("문자는 입력하실 수 없습니다.");
        this.logInfo.call_number = call.substring(0, call.length-1);
      }
    },
    resetLoginfo() {
      this.logInfo.send_date = ""
      this.logInfo.da_number = ""
      this.logInfo.call_number = ""
      this.logInfo.st_time = ""
      this.logInfo.ed_time = ""
      this.$refs.dateEt.focus();
    },
    logSearch(page, size, searchTF) {
      this.pagingProcess.currentPage = page;

      //this.searchEmpty = false;
      //this.resultView = false;
      if(this.logInfo.send_date.length < 4){
        alert("발송일을 입력해주세요.");
        this.$refs.dateEt.focus();
      } else if(this.logInfo.call_number.length < 4){
        alert("발신 번호를 입력해주세요.");
        this.$refs.callEt.focus();
      } else if(0 < this.logInfo.st_time.length && this.logInfo.st_time.length < 8) {
	alert("시간 범위는 비우거나 hhmmss 모두 입력해주세요. (기본00:00:00)");
        this.$refs.stEt.focus();
      } else if(0 < this.logInfo.ed_time.length && this.logInfo.ed_time.length < 8) {
        alert("시간 범위는 비우거나 hhmmss 모두 입력해주세요. (기본11:59:59)");
        this.$refs.edEt.focus();
      } else{
        if(searchTF){
          this.pagingProcess.currentPage = 1;
          this.$http.post('/api/elastic/search', {
            logInfo: this.logInfo,
            page: 1,
            size: 10000
          }).then((res) => {
            let success = res.data.success;
            if(success) {
              this.searchAllValue = res.data.logResult.hits;
              this.$http.post('/api/elastic/search', {
                logInfo: this.logInfo,
                page: 1,
                size,
              }).then((res2) => {
                let success = res2.data.success;
                if(success){
                  let count = res2.data.logResult.hits.total.value+"";
                  if(count == '0'){
                    this.count = '0';
                    this.searchEmpty = true;
                    this.resultView = false;
                  } else{
                    this.searchEmpty = false;
                    this.resultView = true;
                    if(count.length == 4){
                      this.count = count.charAt(0) + "," + count.substring(1);
                    } else if(count.length == 5){
                      this.count = count.substring(0,2) + "," + count.substring(2);
                    } else {
                      this.count = count;
                    }
                  }
                   this.searchValue = res2.data.logResult.hits;
                   this.authority = res2.data.authority;
                 } else{
                   alert(res2.data.logResult);
                 }
              })
 
            } else {
              alert(res.data.logResult);
            }
          })
        } else {
          this.$http.post('/api/elastic/search', {
            logInfo: this.logInfo,
            page,   
            size,
          }).then((res3) => {
            let success = res3.data.success;
            if(success){
               let count = res3.data.logResult.hits.total.value+"";
              if(count == '0'){
                this.count = '0';
                this.searchEmpty = true; 
                this.resultView = false;
              } else{ 
                this.searchEmpty = false;
                this.resultView = true;
                if(count.length == 4){
                  this.count = count.charAt(0) + "," + count.substring(1);
                } else if(count.length == 5){
                  this.count = count.substring(0,2) + "," + count.substring(2);
                } else {
                  this.count = count;
                }
              }       
              this.searchValue = res3.data.logResult.hits;
              this.authority = res3.data.authority;
            } else{ 
              alert(res3.data.logResult);
            }       
          })	  
        }
      }
    },
    changeBlimit(value){
      this.pagingProcess.boardLimit = value;
      this.pagingProcess.currentPage = 1;
      this.logSearch(this.pagingProcess.currentPage, value, false);
    },
    changePage(page){
      this.pagingProcess.currentPage = page;
    }
  }
}
</script>

<style lang="css" scoped>
</style>
