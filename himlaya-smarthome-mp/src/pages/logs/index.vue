<template>
  <div>
    <div class="header">
      <div class="header-JPG">
        <van-image round width="5rem" height="5rem" :src="avatar" />
      </div>
      <div class="header-name">{{ username }}</div>
    </div>

    <div class="body">
      <div class="mydevice">
        <van-collapse :value="activeNames1" @change="onDevChange">
          <van-collapse-item title="设备清单" icon="orders-o">
            <div class="content">
              <div class="text">DHT11</div>
              <div class="text">MQ-2</div>
              <div class="text">BH1750</div>
              <div class="text">Infrared</div>
              <div class="text">DC Motor</div>
              <div class="text">Relay</div>
              <div class="text">ESP8266-01s</div>
              <div class="text">BEEP</div>
              <div class="text">Relay</div>
              <div class="text">SIM800L</div>
            </div>
          </van-collapse-item>
        </van-collapse>
            <van-collapse :value="activeNames2" @change="onTecChange">
          <van-collapse-item title="技术栈" icon="cluster-o">
            <div class="content">
              <div class="text">Spring Boot</div>
              <div class="text">微信小程序</div>
              <div class="text">MySQL</div>
              <div class="text">MQTT</div>
              <div class="text">Java</div>
              <div class="text">VUE</div>
              <div class="text">STM32</div>
            </div>
          </van-collapse-item>
        </van-collapse>

        <div class="notice-bar">
          <van-notice-bar
            color="#1989fa"
            scrollable
            background="#ecf9ff"
            left-icon="info-o"
            :text="noticeText"
          />
          <van-notice-bar
            color="#1989fa"
            scrollable
            background="#ecf9ff"
            left-icon="info-o"
            :text="noticeText1"
          />
        </div>
      </div>
      <dir class="backImg">
        <image class="LOGO" src="/static/images/weLOGO.png"></image>
      </dir>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      noticeText: "更多功能正在开发中，敬请期待...",
      noticeText1: "項目地址：https://github.com/himlayaa/himlaya-smarthome/",
      activeNames1: "",
      activeNames2: "",
      AirCheck: false,
    };
  },
  computed: {
    ...mapState(["username", "avatar"]),
  },
  methods: {
    onDevChange(event) {
      var that = this;
      that.$set(that, "activeNames1", event.mp.detail);
    },
    onTecChange(event){
      var that = this;
      that.$set(that, "activeNames2", event.mp.detail);
    }
  },
};
</script>

<style lang="scss" scoped>
.header {
  height: 120px;
  padding: 25px 0;
  background-color: #17aae4;

  .header-JPG {
    // font-size: 28px;
    // font-weight: 500px;
    // color: #fff;
    // margin-top: 10px;
    margin-left: 20px;
  }
  .header-name {
    font-size: 20px;
    color: #fff;
    margin-left: 25px;
  }
}

.body {
  //padding: 10px;
  //实现圆角
  margin-top: -20px;
  border-radius: 15px 15px 0 0;
  background-color: #fff;
  .mydevice {
    .content {
      font-size: 15px;
    }
    .cellgroup {
      //margin-block-start: 1px;
      //margin-left: 10px;
      //margin-top: 5px;\
      //margin-block: 10px;
    }
  }

   .backImg{
    .LOGO{ 
      width: 139px;
      height: 38px;
      margin-left: 120px;
      margin-top: 267px;
    }
  }
}
</style>
