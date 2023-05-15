<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>

import { mapActions ,mapGetters} from "vuex";
export default {
  name: 'AppMain',
  computed: {
     ...mapGetters(["mqtt_state"]),
    key() {
      return this.$route.path
    }
  },
   mounted() {
    this.connectMqtt();  //登录进入页面后，连接mqtt
  },
  
   methods: {
    ...mapActions("mqttL", ["connectMqtt"]),
   }

}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
