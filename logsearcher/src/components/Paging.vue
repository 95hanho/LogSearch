<template lang="html">
  <ul class="pagination" style="place-content:center;">
    <li class="page-item"><a class="page-link" @click="firstPage">First</a></li>
    <li class="page-item"><a class="page-link" @click="previousPage">Previous</a></li>
    <PagingList v-for="index in pageIndex" :key="index" :currentPage="currentPage" :index="index" :startPage="startPage" @pageMove="pageMove"/>
    <li class="page-item"><a class="page-link" @click="nextPage">Next</a></li>
    <li class="page-item"><a class="page-link" @click="endMove">End</a></li>
  </ul>
</template>

<script>
import PagingList from './PagingList.vue'

export default {
  props: ['searchValue', 'pagingProcess'],
  data(){
    return{
      pageLimit:5,
    }
  },
  components:{
    PagingList
  },
  computed: {
    currentPage(){
      return this.pagingProcess.currentPage;
    },
    boardLimit(){
      //return 1000;
      return this.pagingProcess.boardLimit;
    },
    listCount(){
      //return 10000;
      return this.searchValue.total.value;
    },
    maxPage(){
      return parseInt(parseFloat(this.listCount/ this.boardLimit) + 0.9);
    },
    startPage(){
      return (parseInt(parseFloat(this.currentPage) / this.pageLimit + 0.9) - 1) * this.pageLimit + 1;
    },
    endPage(){
      return this.startPage + this.pageLimit -1;
    },
    pageIndex(){
      if(this.maxPage - this.startPage >= 5){
        return 5;
      } else if(this.maxPage == 0) {
        return 1;
      } else {
        return this.maxPage - this.startPage + 1;
      }
    }
  },
  created(){
  },
  methods: {
    pageMove(page){
      this.$emit('changePage', page);
      this.$emit('logSearch', page, this.boardLimit, false);
    },
    nextPage(){
      if(this.currentPage < this.maxPage){
        this.$emit('changePage', this.currentPage + 1);
        this.$emit('logSearch', this.currentPage, this.boardLimit, false);
      }
    },
    previousPage(){
      if(this.currentPage > 1){
        this.$emit('changePage', this.currentPage - 1);
        this.$emit('logSearch', this.currentPage, this.boardLimit, false);
      }
    },
    firstPage(){
      this.$emit('changePage', 1);
      this.$emit('logSearch', this.currentPage, this.boardLimit, false);
    },
    endMove(){
      this.$emit('changePage', this.maxPage);
      this.$emit('logSearch', this.currentPage, this.boardLimit, false);
    }
  }
}
</script>

<style lang="css" scoped>
ul{
  justify-content: center;
  position: fixed;
  bottom: 0%;
  left: 0%;
  width: 100%;
}
</style>
