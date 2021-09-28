<template lang="html">
  <div class="searchList">

    <select class="selectpicker" style="float:right;" v-model="boardLimit">
      <option value="5000">5000개</option>
      <option value="1000">1000개</option>
      <option value="500">500개</option>
      <option value="100">100개</option>
      <!--
      <option value="1">test1개</option>
      -->
    </select>
    <table class="table table-bordered"  style="text-align:center">
      <thead>
        <tr>
          <th scope="col" bgcolor="#bbdefb">No.</th>
          <th scope="col" bgcolor="#bbdefb">날&nbsp;&nbsp;짜</th>
          <th scope="col" bgcolor="#bbdefb">시&nbsp;&nbsp;간</th>
          <th scope="col" bgcolor="#bbdefb" width="12.8%">발신번호</th>
          <th scope="col" bgcolor="#bbdefb" width="12.8%">수신번호</th>

          <th scope="col" bgcolor="#bbdefb" width="11.2%">서&nbsp;&nbsp;버</th>
          <th scope="col" bgcolor="#bbdefb">CPID</th>
          <th scope="col" bgcolor="#bbdefb" width="7%">서비스</th>
          <th scope="col" bgcolor="#bbdefb">메&nbsp;시&nbsp;지</th>
          <th scope="col" bgcolor="#bbdefb" width="8%">결과</th>
        </tr>
      </thead>
      <tbody v-for="(sv, index) in searchValue.hits" :key="sv">
        <SearchListView v-bind:searchValue="sv" v-bind:index="index" :pagingProcess="pagingProcess" :authority="authority"/>
      </tbody>
    </table>

    <Paging @logSearch="logSearch" :searchValue="searchValue" :pagingProcess="pagingProcess" @changePage="changePage"/>

	</div>
</template>

<script>
import SearchListView from './SearchListView.vue'
import Paging from './Paging.vue'

export default {
  props: ['searchValue', 'pagingProcess', 'authority'],
  data() {
    return {
      boardLimit:1000,
    }
  },
  created() {
    this.boardLimit = this.pagingProcess.boardLimit;
  },
  components: {
    SearchListView,
    Paging
  },
  methods: {
    logSearch(page, size){
      this.$emit('logSearch', page, size, false);
    },
    changePage(page){
      this.$emit('changePage', page);
    }
  },
  watch: {
    boardLimit: {
      deep: false,
      handler() {
        this.$store.dispatch('boardLimit', { num : this.boardLimit });
        this.$emit('changeBlimit', this.boardLimit);
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
