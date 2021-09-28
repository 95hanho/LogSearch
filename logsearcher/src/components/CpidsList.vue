<template lang="html">
  <table class="table table-bordered"  style="word-wrap: break-word;">
    <thead>
      <tr>
        <th scope="col" width="30%" bgcolor="#e3f2fd" style="text-align:center; font-weight:bold">서&nbsp;&nbsp;버</th>
        <th scope="col" width="20%" bgcolor="#e3f2fd" style="text-align:center; font-weight:bold">카테고리</th>
        <th scope="col" width="50%" bgcolor="#e3f2fd" style="text-align:center; font-weight:bold" title="조회된 CPID를 GROUP BY한 내용입니다.">CPIDs List</th>
      </tr>
    </thead>
    <tbody v-for="sv in sortedcpidMap" :key="sv">
      <CpidsListView v-bind:svMap="sv"/>
    </tbody>
  </table>
</template>

<script>
import CpidsListView from './CpidsListView.vue'

export default {
  props: ['searchAllValue'],
  data() {
    return {
      sortedcpidMap: [],
    }
  },
  components: {
    CpidsListView,
  },
  created(){
    this.cpidMap();
  },
  methods: {
    cpidMap() {
      let cpidMap = new Map();
      const cnt = this.searchAllValue.total.value;
      for(let i=0;i<cnt;i++){
        if(!cpidMap.has(this.searchAllValue.hits[i]._source.servername)){
          cpidMap.set(this.searchAllValue.hits[i]._source.servername, []);
        }
        cpidMap.get(this.searchAllValue.hits[i]._source.servername).push(this.searchAllValue.hits[i]._source.cpid);
        cpidMap.get(this.searchAllValue.hits[i]._source.servername).push(this.searchAllValue.hits[i]._source.category);
      }
      const sortStringKeys=(a,b)=> a[0]> b[0] ? 1 : -1;
      let sortedcpidMap = new Map([...cpidMap].sort(sortStringKeys));
      let resultJson = [];
      sortedcpidMap.forEach(function (value, key){
        let resultJson2 = [];
        resultJson2[key] = value;
        resultJson.push(resultJson2);
      });
      this.sortedcpidMap = resultJson;
    }
  },
  watch: {
    searchAllValue: {
      deep: true,
      handler() {
        this.cpidMap();
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
