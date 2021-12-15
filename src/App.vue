<template>
  <div
    id="app">
    <div
      class="map-main">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data () {
    return {
      routes: []
    }
  },
  mounted () {
    this.routes = this.$router.options.routes
  }
}
</script>

<style lang="scss">
.nav {
  position: fixed;
  right: 20px;
  top: 20px;
  z-index: 999;
  a {
    color: #333;
    &.router-link-exact-active {
      color: red;
    }
  }
}
.map-main {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
}
</style>
