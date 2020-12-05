<!--  -->
<template>
  <div>
    <van-nav-bar
      :title="navTitle"
      left-arrow
      @click-left="onClickLeft"
      class="view-navbar-default"
    >
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    navTitle: { type: String, default: '' }
  },
  methods: {
    onClickLeft() {
      this.$emit('click-left')
    }
  }
}
</script>

<style scoped>
.view-navbar-default {
  width: 100%;
  height: 44px;
  background-color: transparent;
  position: fixed;
  top: 0px;
  align-items: center;
  justify-content: space-around;
}
</style>
