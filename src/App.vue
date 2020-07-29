<template>
  <div id="app">
    <div class="map-main">
      <init-map ref="InitMap">
      </init-map>
    </div>
  </div>
</template>

<script>
// import InitMap from '@/components/InitMap'
import InitMap from '@/components/CustomSymbols'
export default {
  name: 'App',
  components: {
    InitMap
  }
}
</script>

<style lang="scss">
.map-main {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
}
</style>
