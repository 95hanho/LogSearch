<template lang="html">
  <tr>
    <th scope="row">{{ index + 1 }}</th>
    <th scope="row">{{ ymd }}</th>
    <th scope="row">{{ sn }}</th>
    <th scope="row">{{ cpid }}</th>
    <th scope="row">{{ servername }}</th>
    <th scope="row">{{ dtype }}</th>
  </tr>
</template>

<script>
export default {
  props: ['searchValue', 'index'],
  data(){
    return{
        "ymd":"",
        "cpid":"",
        "servername":"",
        "dtype":"",
        "sn":""
    }
  },
  created(){
    let value = this.searchValue._source;
    this.ymd = value.ymd.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3');
    this.cpid = value.cpid;
    if(value.servername.includes('SMS_CUST_')){
      this.servername = value.servername.replace('SMS_CUST', '고객수용');
    } else if(value.servername.includes('MQ')){
      this.servername = value.servername.replace('MQ', '신규웹');
    } else if(value.servername.includes('SMS_159')){
      this.servername = value.servername.replace('SMS_159', '고객수용_159');
    }
    this.dtype = value.dtype;
    this.sn= value.sn;
  }
}
</script>

<style lang="css" scoped>
</style>
