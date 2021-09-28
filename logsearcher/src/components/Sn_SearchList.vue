<template lang="html">
  <table class="table table-bordered"  style="text-align:center">
    <thead>
      <tr>
        <th scope="col" bgcolor="#bbdefb">No.</th>
        <th scope="col" bgcolor="#bbdefb">날&nbsp;&nbsp;짜</th>
        <th scope="col" bgcolor="#bbdefb">S&nbsp;&nbsp;N</th>
        <th scope="col" bgcolor="#bbdefb">CPID</th>
        <th scope="col" bgcolor="#bbdefb">서&nbsp;&nbsp;버</th>
        <th scope="col" bgcolor="#bbdefb">타&nbsp;&nbsp;입</th>
      </tr>
    </thead>
    <tbody v-for="(sv, index) in searchValue.hits" :key="sv">
      <SearchListView v-bind:searchValue="sv" v-bind:index="index"/>
    </tbody>
  </table>
</template>

<script>
import SearchListView from './Sn_SearchListView.vue'

export default {
  props: ['searchValue'],
  data() {
    return {

    }
  },
  created() {
  },
  components: {
    SearchListView,
  },
}
</script>

<style lang="css" scoped>
</style>
