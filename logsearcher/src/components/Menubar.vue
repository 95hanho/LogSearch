<template lang="html">
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb nav justify-content-end">
      <div
        class="btn-group"
        role="group"
        aria-label="Button group with nested dropdown"
      >
        <div class="btn-group" role="group" v-if="menuShow">
          <button
            id="btnGroupDrop1"
            type="button"
            class="btn btn-secondary dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {{ selectMenu }}&nbsp;
          </button>
          <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
            <div
              class="dropdown-item"
              v-on:click="numSearch('번호 검색', 'Num')"
            >
              번호 검색
            </div>
            <!--
            <div class="dropdown-item" v-on:click="numSearch('sn 검색', 'Sn')" v-if="adminView">sn 검색</div>
            -->
            <div
              class="dropdown-item"
              v-on:click="numSearch('파일 검색', 'File')"
            >
              파일 검색
            </div>
            <div
              class="dropdown-item"
              v-on:click="numSearch('사용자 관리', 'UserInput')"
              v-if="adminView"
            >
              사용자 관리
            </div>
            <!--
            <div class="dropdown-item" v-on:click="numSearch('사용자 관리', 'UserAdmin')" v-if="adminView">사용자 관리</div>
            -->
          </div>
        </div>
        <button type="button" class="btn btn-light" v-if="menuShow">
          <u>{{ nickname }}</u
          >님
        </button>

        <button
          type="button"
          class="btn btn-secondary"
          v-if="menuShow"
          v-on:click="logout"
        >
          <font color="white">로그아웃</font>
        </button>

        <button type="button" class="btn btn-secondary" v-if="!menuShow">
          <font color="white">로그인을 해주세요</font>
        </button>
      </div>
    </ol>
  </nav>
</template>

<script>
export default {
  props: ["nickname", "adminView", "selectMenu"],
  data() {
    return {
      token: "",
      menuShow: true,
    };
  },
  computed: {},
  created() {
    this.nickCheck();
  },
  methods: {
    numSearch(text, name) {
      this.$emit("changeUrl", text);
      this.$store.dispatch("urlCookie", { url: name });
      this.$router.push({ name: name }).catch(() => {});
    },
    logout() {
      this.menuShow = false;
      this.$emit("nickChange");
      this.nickname = "";
      this.$store.dispatch("logout");
      //location.reload();
      this.$router.push({ name: "Login" }).catch(() => {});
    },
    nickCheck() {
      let nickCheck = this.nickname;
      if (nickCheck == "") {
        this.menuShow = false;
      } else {
        this.menuShow = true;
      }
    },
  },
  watch: {
    nickname: {
      deep: false,
      handler() {
        this.nickCheck();
      },
    },
  },
};
</script>

<style lang="css" scoped></style>
