<template lang="html">
  <div class="lds-facebook" v-if="loading">
    <div class="">
    </div>
    <div class="">
    </div>
    <div class="">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true
    }
  },
}
</script>

<style lang="css" scoped>
.lds-facebook {
  position: relative;
  width: 64px;
  height: 64px;
  text-align: center;
  left: 47%;
}
.lds-facebook div {
    display: inline-block;
    position: absolute;
    left: 6px;
    width: 13px;
    background: #42b883;
    animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}
.lds-facebook div:nth-child(1) {
    left: 6px;
    animation-delay: -0.24s;
}
.lds-facebook div:nth-child(2) {
    left: 26px;
    animation-delay: -0.12s;
}
.lds-facebook div:nth-child(3) {
    left: 45px;
    animation-delay: 0;
}
@keyframes lds-facebook {
  0% {
      top: 6px;
      height: 51px;
  }
  50%, 100% {
      top: 19px;
      height: 25px;
  }
}
</style>
