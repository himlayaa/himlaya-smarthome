<template>
  <div>
    <div class="control">
      <div class="slider-wrapper">
        <div class="device">
          <div class="dev-contro">
            <i class="fa fa-lightbulb-o fa-2x" style="color: #7f7f7f"></i>
            <div class="block">
              <el-slider v-model="LED_pwm" show-input @change="LedValueChange">
              </el-slider>
            </div>
            <div class="dev-text">灯光</div>
          </div>
        </div>

        <div class="device2">
          <div class="dev-contro">
            <i class="fa fa-credit-card fa-2x" style="color: #7f7f7f"></i>
            <div class="block">
              <el-slider
                v-model="Air_value"
                show-input
                :min="16"
                :max="32"
                @change="AirValueChange"
              >
              </el-slider>
            </div>
            <div class="dev-text">空调</div>
          </div>
        </div>
      </div>

      <div class="device-wrapper">
        <div class="data">
          <div class="data-text">我的空调</div>
          <div class="dev-air">
            <div class="selector">
              <el-select
                v-model="value3"
                :placeholder="AirBrand"
                @change="AirSelectChange"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value3"
                  :label="item.label"
                  :value="item.value"
                  :disabled="AirCheck"
                >
                </el-option>
              </el-select>
            </div>

            <div class="switch">
              <el-switch
                v-model="AirCheck"
                active-color="#17aae4"
                inactive-color="#7f7f7f"
                @change="AirSWChange"
              >
              </el-switch>
            </div>
          </div>
        </div>

        <div class="data1">
          <div class="data1-text">通风</div>
          <div class="switch1">
            <el-switch
              v-model="WindCheck"
              active-color="#17aae4"
              inactive-color="#7f7f7f"
              @change="WindSWChange"
            >
            </el-switch>
          </div>
        </div>

        <div class="data1">
          <div class="data1-text">报警</div>
          <div class="switch1">
            <el-switch
              v-model="AlarmCheck"
              active-color="#17aae4"
              inactive-color="#7f7f7f"
              @change="AlarmSWChange"
            >
            </el-switch>
          </div>
        </div>
      </div>

      <div class="collpase">
        <el-collapse v-model="activeNames" @change="collpaseChange">
          <el-collapse-item title="我的灯光" name="1">
            <div class="collpase-item">
              <div class="imgAndStr">
                <i class="fa fa-lightbulb-o fa-1x" style="color: #7f7f7f"></i>
                <div class="item-str" @click="chooseLED1">客厅灯</div>
                <div class="light-value">{{ LED1_value }}</div>
              </div>
              <div class="collpase-item-switch">
                <el-switch
                  v-model="Led1Check"
                  active-color="#17aae4"
                  inactive-color="#7f7f7f"
                  @change="Led1SWChange"
                >
                </el-switch>
              </div>
            </div>

            <div class="collpase-item">
              <div class="imgAndStr">
                <i class="fa fa-lightbulb-o fa-1x" style="color: #7f7f7f"></i>
                <div class="item-str" @click="chooseLED2">卧室灯</div>
                <div class="light-value">{{ LED2_value }}</div>
              </div>
              <div class="collpase-item-switch">
                <el-switch
                  v-model="Led2Check"
                  active-color="#17aae4"
                  inactive-color="#7f7f7f"
                  @change="Led2SWChange"
                >
                </el-switch>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="我的电器" name="2">
            <div class="collpase-item">
              <div class="imgAndStr">
                <i class="fa fa-s15 fa-1x" style="color: #7f7f7f"></i>
                <div class="item-str">热水器</div>
              </div>
              <div class="collpase-item-switch">
                <el-switch
                  v-model="Elec1Check"
                  active-color="#17aae4"
                  inactive-color="#7f7f7f"
                  @change="Elec1SWChange"
                >
                </el-switch>
              </div>
            </div>

            <div class="collpase-item">
              <div class="imgAndStr">
                <i class="fa fa-building-o fa-1x" style="color: #7f7f7f"></i>
                <div class="item-str">暖气</div>
              </div>
              <div class="collpase-item-switch">
                <el-switch
                  v-model="Elec2Check"
                  active-color="#17aae4"
                  inactive-color="#7f7f7f"
                  @change="Elec2SWChange"
                >
                </el-switch>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      activeNames: ["1", ],
      options: [
        {
          value: "1",
          label: "长虹",
        },
        {
          value: "2",
          label: "格力",
          //disabled: true
        },
        {
          value: "3",
          label: "美的",
        },
        {
          value: "4",
          label: "海尔",
        },
      ],
      value3: "",
      AirBrand: "长虹",
      AirIndex: 0,
      Air_value: 26,
      LED_pwm: 20,
      LED1_value: 0,
      LED2_value: 0,
      AirCheck: false,
      WindCheck: false,
      AlarmCheck: false,
      Led1Check: false,
      Led2Check: false,
      LED_choose: 1, //默认选择灯光1
      Elec1Check: false,
      Elec2Check: false,
      AirColumnsE: ["changhong", "geli", "meidi", "haier"],
    };
  },

  methods: {
    ...mapActions("mqttL", ["publishMqtt"]),

    collpaseChange(val) {
      //折叠面板打开/关闭
      // var that = this;
      // console.log(val);
    },
    LedValueChange(val) {
      //slider灯光亮度值变化
      var that = this;
      if (that.LED_choose == 1) {
        that.Led1Check = true;
        that.$set(that, "LED1_value", val);
      } else if (that.LED_choose == 2) {
        that.Led2Check = true;
        that.$set(that, "LED2_value", val);
      }

      var json_str =
        '{"key":"' +
        (that.LED_choose == 1 ? "living_LED" : "bed_LED") +
        '","value": ' +
        that.LED_pwm +
        "}";

      that.publishMqtt(json_str); //亮度值变化发布
      console.log(json_str);
    },
    AirValueChange(val) {
      //slider空调温度值变化
      //console.log(val)
      var that = this;
      var json_str =
        '{"key":"' +
        that.AirColumnsE[that.AirIndex] +
        '","value": ' +
        that.Air_value +
        "}";

      that.publishMqtt(json_str); //空调值变化发布
      console.log(json_str);
    },
    AirSelectChange(val) {
      //选择器变后，val的值就是空调品牌的value：1、2、3、4
      //console.log(val)
      var that = this;
      that.AirIndex = val - 1;
      that.$set(that, "AirBrand", that.options[val].label); //设置空调品牌
      //console.log(that.options[val].label)
    },
    AirSWChange() {
      var that = this;
      //console.log("空调开关：" + this.AirCheck);
      var json_str =
        '{"key":"' +
        that.AirColumnsE[that.AirIndex] +
        '","value": ' +
        (that.AirCheck ? that.Air_value : 0) +
        "}";
      console.log(json_str);
      that.publishMqtt(json_str); //发布出去
    },
    WindSWChange() {
      var that = this;
      //console.log("通风开关：" + this.WindCheck);
      var json_str =
        '{"key":"Wind" ,"value": ' + (that.WindCheck ? 1 : 0) + "}";
      that.publishMqtt(json_str);
      console.log(json_str);
    },
    AlarmSWChange() {
      var that = this;
      //console.log("警报开关：" + this.AlarmCheck);
      var json_str =
        '{"key":"BEEP" ,"value": ' + (that.AlarmCheck ? 1 : 0) + "}";
      that.publishMqtt(json_str);
      console.log(json_str);
    },
    Led1SWChange() {
      var that = this;
      //console.log("客厅灯开关：" + that.Led1Check);
      that.chooseLED1(); //选择LED1
      that.$set(that, "LED1_value", that.Led1Check ? that.LED_pwm : 0); //将亮度值赋给LED1,关闭则给0

      var json_str =
        '{"key":"living_LED" ,"value": ' +
        (that.Led1Check ? that.LED1_value : 0) +
        "}";
      that.publishMqtt(json_str); //发布出去
      console.log(json_str);
    },
    Led2SWChange() {
      var that = this;
      //console.log("卧室灯开关：" + that.Led2Check);
      that.chooseLED2(); //选择LED2
      that.$set(that, "LED2_value", that.Led2Check ? that.LED_pwm : 0); //将亮度值赋给LED2,关闭则给0

      var json_str =
        '{"key":"bed_LED" ,"value": ' +
        (that.Led2Check ? that.LED2_value : 0) +
        "}";
      that.publishMqtt(json_str); //发布出去
      console.log(json_str);
    },
    Elec1SWChange() {
      var that = this;
      //console.log("热水器开关：" + this.Elec1Check);
      var json_str =
        '{"key":"Elec1_value","value": ' + (that.Elec1Check ? 1 : 0) + "}";
      that.publishMqtt(json_str); //发布出去
      console.log(json_str);
    },
    Elec2SWChange() {
      var that = this;
      //console.log("暖气开关：" + this.Elec2Check);
      var json_str =
        '{"key":"Elec2_value","value": ' + (that.Elec2Check ? 1 : 0) + "}";
      that.publishMqtt(json_str); //发布出去
      console.log(json_str);
    },
    chooseLED1() {
      var that = this;
      //console.log("chooseLED1")
      that.$set(that, "LED_choose", 1); //选择LED1
    },
    chooseLED2() {
      var that = this;
      //console.log("chooseLED2")
      that.$set(that, "LED_choose", 2); //选择LED2
    },
  },
};
</script>

<style lang="scss" scoped>
.control {
  height: 100%;
  width: 100%;
  background: url("../../assets/allLOGO.png");
  background-position: center;
  background-size: cover;
  overflow: hidden;
  position: fixed;

  .slider-wrapper {
    margin-left: 20px;
    margin-top: 20px;

    .device {
      margin-left: 15px;
      .dev-text {
        margin-top: 6px;
        margin-left: 20px;
        font-weight: 800px;
        font-size: 20px;
        color: #7f7f7f;
      }
      .dev-contro {
        display: flex;
      }
    }

    .device2 {
      margin-top: 20px;
      .dev-text {
        margin-top: 6px;
        margin-left: 20px;
        font-weight: 800px;
        font-size: 20px;
        color: #7f7f7f;
      }
      .dev-contro {
        display: flex;
      }
    }

    .block {
      margin-left: 20px;
      width: 600px;
    }
  }

  .device-wrapper {
    margin-top: 20px;
    margin-left: 20px;
    display: flex;

    .data {
      margin-top: 10px;
      margin-left: 20px;
      background-color: #ffff;
      width: 280px;
      height: 120px;
      border-radius: 20px;
      //display: flex;
      //justify-content: space-around;
      padding: 0 8px;
      box-shadow: 0px 0px 2px;
    }

    .data1 {
      margin-top: 10px;
      margin-left: 20px;
      background-color: #ffff;
      width: 120px;
      height: 120px;
      border-radius: 20px;
      //display: flex;
      //justify-content: space-around;
      padding: 0 8px;
      box-shadow: 0px 0px 2px;
      .data1-text {
        margin-top: 20px;
        margin-left: 20px;
        color: #7f7f7f;
      }
      .switch1 {
        margin-top: 20px;
        margin-left: 20px;
      }
    }

    .dev-air {
      margin-top: 10px;
      display: flex;
      .selector {
        border-radius: 20px;
      }
      .switch {
        margin-top: 10px;
        margin-left: 10px;
      }
    }

    .data-text {
      margin-top: 20px;
      margin-left: 10px;
      //font-weight: 10px;
      font-size: 15px;
      color: #7f7f7f;
    }
  }

  .collpase {
    width: 600px;
    margin-left: 30px;
    margin-top: 30px;
    .collpase-item {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      .imgAndStr {
        display: flex;
        float: left;
        .item-str {
          margin-left: 10px;
        }
        .light-value {
          margin-left: 8px;
          color: #7f7f7f;
        }
      }
      .collpase-item-switch {
        float: right;
      }
    }
  }
}
</style>
