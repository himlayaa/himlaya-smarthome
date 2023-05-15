<template>
  <div class="wrapper">
    <div class="header-wrapper">
      <div class="header-title">控制台</div>
    </div>
    <div class="device-wrapper">
      <div class="device">
        <div class="data-wrapper">
          <div class="data">
            <div class="data-text">
              <img class="data-logo" src="/static/images/light_C.png" />
              <div class="data-title">灯光</div>
            </div>
            <van-slider
              :value="LED_pwm"
              use-button-slot
              @drag="onLightDrag"
              @change="onLightChange"
            >
              <view class="button" slot="button">{{ LED_pwm }}</view>
            </van-slider>
          </div>
        </div>

        <div class="data-wrapper">
          <div class="data">
            <div class="data-text">
              <img class="data-logo" src="/static/images/air_C.png" />
              <div class="data-title">空调</div>
            </div>
            <van-slider
              :value="Air_value"
              min="16"
              max="32"
              use-button-slot
              @drag="onAirDrag"
              @change="onAirChange"
            >
              <view class="button" slot="button">{{ Air_value }}</view>
            </van-slider>
          </div>
        </div>
      </div>
    </div>
    <div class="cell-wrapper">
      <van-cell
        left
        title="我的空调"
        icon="idcard"
        :label="AirBrand"
        size="large"
        is-link
        @click="showAirPop"
      >
        <van-switch :checked="AirCheck" @change="onAirSWChange" />
      </van-cell>
      <van-popup
        :show="showAir"
        round
        closeable
        close-icon="close"
        position="bottom"
        custom-style="height: 60%"
        @close="onCloseAir"
      >
        <van-picker :columns="AirColumns" @change="onAirDevChange" />
      </van-popup>

      <van-collapse :value="activeNames" @change="onChange">
        <van-collapse-item title="我的灯光" icon="setting-o">
          <van-cell-group>
            <van-cell
              title="客厅灯"
              icon="bulb-o"
              :label="LED1_value"
              clickable
              @click="chooseLED1"
            >
              <van-switch :checked="Led1Check" @change="onLed1SWChange" />
            </van-cell>
            <van-cell
              title="卧室灯"
              icon="bulb-o"
              :label="LED2_value"
              clickable
              @click="chooseLED2"
            >
              <van-switch :checked="Led2Check" @change="onLed2SWChange" />
            </van-cell>
          </van-cell-group>
        </van-collapse-item>

        <van-collapse-item title="我的电器" icon="home-o">
          <van-cell-group>
            <van-cell title="热水器" icon="credit-pay" :label="(Elec1_value > 0 ? '开':'关') ">
              <van-switch :checked="Elec1check || Elec1_value" @change="onElec1SWChange" />
            </van-cell>
            <van-cell title="暖气" icon="hotel-o" :label="(Elec2_value > 0 ? '开':'关') ">
              <van-switch :checked="Elec2check || Elec2_value" @change="onElec2SWChange" />
            </van-cell>
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
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
      activeNames: ["1"],
      LED_pwm: 20,
      Air_value: 26,
      showAir: false,
      AirBrand: "长虹",
      AirCheck: false,
      Led1Check: false,
      Led2Check: false,
      Elec1check: false,
      Elec2check: false,
      LED1_value: 0,
      LED2_value: 0,
      LED_choose: 0,
      Air_index: 0,
      AirColumns: ["长虹", "格力", "美的", "海尔"],
      AirColumnsE: ["changhong", "geli", "meidi", "haier"],
      //LedColumns: ["客厅灯", "卧室灯", "氛围灯"],
    };
  },
  computed: {
    ...mapState(["Elec1_value", "Elec2_value","LED1_value","LED2_value"]),
  },
  methods: {
    ...mapMutations(["publishMqtt"]),

    onChange(event) {
      var that = this;
      that.$set(that, "activeNames", event.mp.detail);
      //console.log(event.mp.detail);
    },
    onLightChange(event) {
      //亮度变化
      var that = this;
      var json_str =
        '{"key":"' +
        (that.LED_choose == 1 ? "living_LED" : "bed_LED") +
        '","value": ' +
        that.LED_pwm +
        "}";
      console.log(json_str);
      that.publishMqtt(json_str); //发布出去
      wx.showToast({
        icon: "none",
        title: `亮度：${event.mp.detail}`,
      });
    },
    onLightDrag(event) {
      //亮度进度条变动
      var that = this;
      that.LedCheck = true;
      //console.log(event.mp.detail);
      that.$set(that, "LED_pwm", event.mp.detail.value);
      if (that.LED_choose == 1) {
        that.Led1Check = true;
        that.$set(that, "LED1_value", event.mp.detail.value);
      } else if (that.LED_choose == 2) {
        that.Led2Check = true;
        that.$set(that, "LED2_value", event.mp.detail.value);
      }
    },
    onAirChange(event) {
      //温度变化
      var that = this;
      var json_str =
        '{"key":"' +
        that.AirColumnsE[that.Air_index] +
        '","value": ' +
        that.Air_value +
        "}";
      console.log(json_str);
      that.publishMqtt(json_str); //发布出去
      wx.showToast({
        icon: "none",
        title: `温度：${event.mp.detail}`,
      });
    },

    onAirDrag(event) {
      //空调进度条变动
      var that = this;
      that.AirCheck = true;
      that.$set(that, "Air_value", event.mp.detail.value);
    },
    onAirSWChange(event) {
      //空调开关变化
      var that = this;
      that.$set(that, "AirCheck", event.mp.detail);
      var json_str =
        '{"key":' +
        '"' +
        that.AirColumnsE[that.Air_index] +
        '"' +
        ',"value": ' +
        (that.AirCheck ? this.Air_value : 0) +
        "}";
      console.log(json_str);
      that.publishMqtt(json_str); //发布出去
    },
    chooseLED1(event) {
      var that = this;
      //that.AirCheck = true;
      that.$set(that, "LED_choose", 1);
    },
    chooseLED2(event) {
      var that = this;
      //that.AirCheck = true;
      that.$set(that, "LED_choose", 2);
    },
    onLed1SWChange(event) {
      //灯开关变化
      var that = this;
      //console.log(event);
      that.$set(that, "Led1Check", event.mp.detail);
      that.$set(that, "LED1_value", that.Led1Check ? that.LED_pwm : 0);
      var json_str =
        '{"key":"living_LED" ,"value": ' +
        (that.Led1Check ? that.LED1_value : 0) +
        "}";
      console.log(json_str);
      that.publishMqtt(json_str); //发布出去
    },
    onLed2SWChange(event) {
      //灯开关变化
      var that = this;
      //console.log(event);
      that.$set(that, "Led2Check", event.mp.detail);
      that.$set(that, "LED2_value", that.Led2Check ? that.LED_pwm : 0);
      var json_str =
        '{"key":"bed_LED","value": ' +
        (that.Led2Check ? that.LED2_value : 0) +
        "}";
      console.log(json_str);
      that.publishMqtt(json_str); //发布出去
    },

    onElec1SWChange(event) {
      var that = this;
      that.$set(that, "Elec1check", event.mp.detail);
     
      var json_str =
        '{"key":"Elec1_value","value": ' + (that.Elec1check ? 1 : 0) + "}";
      console.log(json_str);
      that.publishMqtt(json_str); //发布出去
    },
    onElec2SWChange(event) {
      var that = this;

      that.$set(that, "Elec2check", event.mp.detail);
      var json_str =
        '{"key":"Elec2_value","value": ' + (that.Elec2check ? 1 : 0) + "}";
      console.log(json_str);
      that.publishMqtt(json_str); //发布出去
    },
    showAirPop(event) {
      //空调选择跳出
      var that = this;
      //console.log(event)
      if (!that.AirCheck) {
        that.$set(that, "showAir", true);
      }
    },

    onCloseAir(event) {
      //空调选择器关闭
      var that = this;
      //console.log(event)
      that.$set(that, "showAir", false);
    },

    onAirDevChange(event) {
      //空调选择器变动
      var that = this;
      //console.log(event)
      const { index, value } = event.mp.detail;
      that.Air_index = index;
      var air_str =
        '{"key":' +
        that.AirColumnsE[index] +
        ',"value": ' +
        that.Air_value +
        "}";
      //console.log(air_str)
      that.$set(that, "AirBrand", value);
      // that.client.publish("/himlayasmarthome/sub", air_str, function (cur) {
      //   if (!cur) {
      //     console.log("AirBrand发送成功!");
      //   }
      // });
    },
  },

  created() {},
};
</script>

<style lang="scss" scoped>
.wrapper {
  //padding: 10px;
  .header-wrapper {
    font-size: 20px;
    margin-left: 15px;
    color: #7f7f7f;
  }

  .data-wrapper {
    margin-top: 30px;
    margin-left: 10px;
    margin-right: 10px;

    .data {
      height: 30px;
      border-radius: 15px;
      //display: flex;
      justify-content: space-around;
      padding: 0 8px;
      box-shadow: 0px 0px 1px;
    }

    .data-text {
      .data-logo {
        float: left;
        height: 20px;
        width: 8%;
        margin-block-start: 10px;
      }
      .data-title {
        float: right;
        font-size: 15px;
        //width: 92%;
        color: #7f7f7f;
        margin-block-start: 10px;
      }
    }
    .button {
      // margin-block-start: 10px;
      border-radius: 20%;
      width: "15px";
      height: "15px";
      background: #17aae4;
      color: #fff;
    }
  }
  .cell-wrapper {
    margin-block-start: 10px;
  }

  .backImg {
    .LOGO {
      width: 139px;
      height: 38px;
      margin-left: 120px;
      margin-top: 271px;
    }
  }
}
</style>
