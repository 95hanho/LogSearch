<template lang="html">
  <tr>
    <th v-if="viewTF" scope="col" max-width="80%" style="text-align:center; font-weight:bold;">{{ servername }}( {{ counts }}건 )</th>
    <td v-if="!viewTF" scope="col" max-width="80%" style="text-align:center; font-weight:bold;">{{ servername }}( {{ counts }}건 )</td>

    <td scope="col" max-width="80%" style="text-align:center; font-weight:bold;">{{ category }}</td>
    <td scope="col" max-width="80%" style="text-align:center; font-weight:bold;">{{ cpid }}</td>
  </tr>
</template>

<script>
export default {
  props: ['svMap'],
  data(){
    return {
      viewTF:true,
      servername:"",
      cpid:"",
      counts:0,
      category:"",
    }
  },
  created(){
    let servername = "";
    let category = "";
    for(var key in this.svMap){
      servername = key;
      this.counts = this.svMap[key].length/2;
      this.cpid = this.svMap[key][0];
      category = this.svMap[key][1];
    }
    /*
    let servername = "";
    let category = "";
    let counts = 0;
    let cpid = "";
    this.svMap.forEach(function (value, key) {
      if(key == 0){
        servername = value;
      }
      if(key == 1){
        const countLength = value+"";
        const a = countLength.split(',');
        counts = a.length / 2;
        value.forEach(function (value2, key2) {
          if(key2 == 0){
            cpid = value2;
          }
          if(key2 == 1){
            category = value2
          }
        });
      }
    });
    this.counts = counts;
    this.cpid = cpid;
    */
    if(category == 'wideshot_agent' || category == 'cpif'){
      this.category = 'Agent'
    } else if(category == 'wideshot_web'){
      this.category = 'Web';
    } else if(category == 'pcif'){
      this.category = 'Messenger';
    } else {
      this.category = category;
    }
    if(servername.includes('SMS_CUST_')){
      this.servername = servername.replace('SMS_CUST', '고객수용');
      this.viewTF = true;
    } else if(servername.includes('MQ')){
      this.servername = servername.replace('MQ', '신규웹');
      this.viewTF = false;
    } else if(servername.includes('SMS_159')){
      this.servername = servername.replace('SMS_159', '고객수용_159');
      this.viewTF = false;
    } else if(servername.includes('SMS_KB')){
      this.servername = servername.replace('SMS_KB', 'KB_GW');
      this.viewTF = false;
    } else {
      this.servername = servername;
      this.viewTF = false;
    }
  }
}
</script>

<style lang="css" scoped>
</style>
