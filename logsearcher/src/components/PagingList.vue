<template lang="html">
  <li v-bind:class="pageCheck">
    <a v-on:click="pageMove(pageNum)" class="page-link">{{ pageNum }}</a>
  </li>
</template>

<script>
export default {
  props: ['index', 'currentPage', 'startPage'],
  data(){
    return{
      pageCheck:"page-item"
    }
  },
  computed: {
    pageNum(){
      return this.index + this.startPage - 1;
    }
  },
  created(){
    if(this.pageNum == this.currentPage){
      this.pageCheck = "page-item active";
    }
  },
  methods: {
    pageMove(page){
      this.$emit('pageMove', page);
    }
  },
  watch: {
    currentPage: {
      deep: true,
      handler() {
        if(this.pageNum == this.currentPage){
          this.pageCheck = "page-item active";
        } else{
          this.pageCheck = "page-item";
        }
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
