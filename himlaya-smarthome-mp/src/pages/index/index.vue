<template>
  <div class="wrapper">
    <div class="header-wrapper">
      <div class="header-title">
        <span>空气质量-{{ airText }}</span>
        <span>{{ area }}-{{ city }}</span>
      </div>
      <div class="header-text">
        <span>{{ airValue }}</span>
        <span>{{ weather }}</span>
      </div>
      <div class="weather-advice">{{ weatherAdvice }}</div>
    </div>
    <div class="body-wrapper">
      <div class="body">
        <div class="data-wrapper">
          <div class="data">
            <img class="data-logo" src="/static/images/temper.png" />
            <div class="data-text">
              <div class="data-title">温度</div>
              <div class="data-value">{{ Temp }}℃</div>
            </div>
          </div>
          <div class="data">
            <img class="data-logo" src="/static/images/humi.png" />
            <div class="data-text">
              <div class="data-title">湿度</div>
              <div class="data-value">{{ Humi }}%</div>
            </div>
          </div>
        </div>
        <div class="data-wrapper">
          <div class="data">
            <img class="data-logo" src="/static/images/light.png" />
            <div class="data-text">
              <div class="data-title">光照</div>
              <div class="data-value">{{ Light }}lx</div>
            </div>
          </div>
          <div class="data">
            <img class="data-logo" src="/static/images/smoke.png" />
            <div class="data-text">
              <div class="data-title">烟雾</div>
              <div class="data-value">{{ Smoke }}%</div>
            </div>
          </div>
        </div>
        <div class="data-wrapper">
          <div class="data">
            <img class="data-logo" src="/static/images/wind.png" />
            <div class="data-text">
              <div class="data-title">通风</div>
              <div class="data-value">
                <switch @change="Wind_Change" :checked="Wind" color="#17aae4" />
              </div>
            </div>
          </div>
          <div class="data">
            <img class="data-logo" src="/static/images/alarm.png" />
            <div class="data-text">
              <div class="data-title">报警</div>
              <div class="data-value">
                <switch @change="Beep_Change" :checked="Beep" color="#17aae4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <dir class="backImg">
      <image class="LOGO" src="/static/images/weLOGO.png"></image>
    </dir>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      // area: "请求中...", //城区
      // city: "请求中...", //城市
      // airText: "请求中...", //空气质量文本
      // airValue: 0, //空气指数
      // weather: "请求中...", //天气
      // weatherAdvice: "请求中...", //天气建议
    };
  },
  computed: {
    ...mapState([
      "client",
      "Temp",
      "Humi",
      "Light",
      "Smoke",
      "Wind",
      "Beep",
      "area",
      "city",
      "airText",
      "airValue",
      "weather",
      "weatherAdvice",
    ]),
  },

  methods: {
    ...mapMutations(["connectMqtt", "publishMqtt"]),

    Wind_Change(event) {
      var that = this;
      console.log(event.mp.detail);
      let wc = event.mp.detail.value;
      that.Wind = wc;
      if (wc) {
        var msg1 = '{"key":"Wind","value":1}';
        that.publishMqtt(msg1);
      } else {
        var msg0 = '{"key":"Wind","value":0}';
        that.publishMqtt(msg0);
      }
    },

    Beep_Change(event) {
      var that = this;
      //console.log(event.mp.detail);
      let bc = event.mp.detail.value;
      
      that.Beep = bc;
      if (bc) {
        var msg1 = '{"key":"BEEP","value":1}';
        that.publishMqtt(msg1);
      } else {
        var msg0 = '{"key":"BEEP","value":0}';
        that.publishMqtt(msg0);
      }
    },
  },

  onShow() {},

  created() {},
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 15px;
  .header-wrapper {
    background-color: #17aae4;
    border-radius: 20px;
    color: #ffff;
    box-shadow: #d6d6d6 0px 0px 5px; //阴影效果
    padding: 15px 30px;
    .header-title {
      display: flex;
      justify-content: space-between; //两部分隔开
    }
    .header-text {
      font-size: 32px;
      font-weight: 400;
      display: flex;
      justify-content: space-between;
    }
    .weather-advice {
      margin-top: 20px; //距离上段文字20像素
      font-size: 12px;
    }
  }
  .data-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .data {
      background-color: #ffff;
      width: 150px;
      height: 80px;
      border-radius: 20px;
      display: flex;
      justify-content: space-around;
      padding: 0 8px;
      box-shadow: 0px 0px 5px;
    }
    .data-logo {
      height: 36px;
      width: 36px;
      margin-top: 20px;
    }
    .data-text {
      margin-top: 15px;
      color: #7f7f7f;
      .data-title {
        //当数值过大时，标题右对齐
        text-align: right;
      }
      .data-value {
        font-size: 25px;
      }
    }
  }

  .backImg {
    .LOGO {
      width: 139px;
      height: 38px;
      margin-left: 105px;
      margin-top: 125px;
    }
  }
}
</style>
