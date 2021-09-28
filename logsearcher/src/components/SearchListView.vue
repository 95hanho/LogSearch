<template lang="html">
  <tr>
    <th scope="row">{{ pagingProcess.boardLimit * (pagingProcess.currentPage - 1) + 1 + index }}</th>
    <th scope="row">{{ ymd }}</th>
    <th scope="row">{{ ptime }}</th>
    <th scope="row">{{ call }}</th>
    <th scope="row">{{ da }}</th>
    <th scope="row">{{ servername }}</th>
    <th scope="row">{{ cpid }}</th>
    <th scope="row">{{ msgtype }}</th>
    <th scope="row" style="font-size:12px;">{{ text }}</th>
    <th scope="row">
      <a class="btn btn-outline-primary" v-if="!transView" v-on:click="getResult">조회</a>
      <label v-if="transView">{{ transResult }}</label>
    </th>
  </tr>
</template>

<script>
export default {
  props: ['searchValue', 'index', 'pagingProcess', 'authority'],
  data(){
    return{
      "transView":false,
      "ymd":"",
      "ptime":"",
      "da":"",
      "call":"",
      "servername":"",
      "cpid":"",
      "text":"",
      "repr":"",
      "dlvs":"",
      "reps":"",
      "transResult":""
    }
  },
  created(){
    let value = this.searchValue._source;
    this.ymd = value.ymd.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3');
    this.ptime = value.ptime.substring(0,8);
    if(this.authority == 'visitor'){

      if(value.da == undefined){
        this.da = '';
      } else if(value.da.length >= 11){
        //this.da = value.da.replace(/\B(?=(\d{4})+(?!\d))/g, '-');
        this.da = value.da.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
      } else if(value.da.length == 10){
        let city = value.da.substring(0, 2);
        if(city == '02'){
          this.da = value.da.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3');
        } else {
          this.da = value.da.replace(/(\d{3})(\d{3})(\d{4})/, '$1-****-$3');
        }
      } else if(value.da.length == 9){
        this.da = value.da.replace(/(\d{2})(\d{3})(\d{4})/, '$1-****-$3');
      } else if(value.da.length == 8){
        this.da = value.da.replace(/(\d{4})(\d{4})/, '$1-****');
      } else {
        this.da = value.da;
      }

    } else {

      if(value.da == undefined){
        this.da = '';
      } else if(value.da.length >= 11){
        this.da = value.da.replace(/\B(?=(\d{4})+(?!\d))/g, '-');
      } else if(value.da.length == 10){
        let city = value.da.substring(0, 2);
        if(city == '02'){
          this.da = value.da.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
        } else {
          this.da = value.da.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }
      } else if(value.da.length == 9){
        this.da = value.da.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
      } else if(value.da.length == 8){
        this.da = value.da.replace(/(\d{4})(\d{4})/, '$1-$2');
      } else {
        this.da = value.da;
      }

    }
    if(value.call.length >= 11){
      this.call = value.call.replace(/\B(?=(\d{4})+(?!\d))/g, '-');
    } else if(value.call.length == 10){
      var city2 = value.call.substring(0, 2);
      if(city2 == '02'){
        this.call = value.call.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
      } else {
        this.call = value.call.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      }
    } else if(value.call.length == 9){
      this.call = value.call.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if(value.call.length == 8){
      this.call = value.call.replace(/(\d{4})(\d{4})/, '$1-$2');
    } else {
      this.call = value.call;
    }
    if(value.servername.includes('SMS_CUST_')){
      this.servername = value.servername.replace('SMS_CUST', '고객수용');
    } else if(value.servername.includes('MQ')){
      this.servername = value.servername.replace('MQ', '신규웹');
    } else if(value.servername.includes('SMS_159')){
      this.servername = value.servername.replace('SMS_159', '고객수용_159');
    } else if(value.servername.includes('SMS_KB')){
      this.servername = value.servername.replace('SMS_KB', 'KB_GW');
    } else {
      this.servername = value.servername;
    }
    this.cpid = value.cpid;
    this.msgtype = value.msgtype.toUpperCase();
    if(this.authority == 'visitor'){
      this.text = "";
    } else {
      if(value.text){
        this.text = value.text;
      } else {
        this.text = value.subject;
      }
    }
    if(value.category.includes('wideshot')){
      this.transView = true;
    }
    if(!value.da){
      this.transView = true;
      this.transResult = "착번X";
    }
  },
  methods: {
    getResult(){
      const logInfo = {
        send_date : this.searchValue._source.ymd.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3'),
        sn : this.searchValue._source.sn,
        servername : this.searchValue._source.servername,
        cpid : this.searchValue._source.cpid,
        da : this.searchValue._source.da,
      };
      this.$http.post('/api/elastic/search_result', {
        logInfo: logInfo,
      }).then((res) => {
        let success = res.data.success;
        if(success){
          let snValue = res.data.logResult.hits.hits;
          for(var key in snValue){
            if(snValue[key]._source.dtype == "reps"){
              this.reps = snValue[key]._source.result;
            }
            if(snValue[key]._source.dtype == "dlvs"){
              this.dlvs = snValue[key]._source.result;
            }
          }
          if(this.reps != ""){
            if(this.reps == "100"){
              this.transResult = "성공";
            } else{
              this.transResult = this.reps;
            }
          } else {
            if(this.dlvs != ""){
              this.transResult = "dlvs:" + this.dlvs;
            } else {
              this.transResult = "불명"
            }
          }
          this.transView = true;
        } else{
          alert(res.data.logResult);
        }
      })
    }
  }
}
</script>

<style lang="css" scoped>
</style>
