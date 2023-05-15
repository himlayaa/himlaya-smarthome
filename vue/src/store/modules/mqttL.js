import { connect } from "mqtt/dist/mqtt.js";


const mqttUrl = "ws://himlaya.xqmqttssl.top:8083/mqtt";

const state = {
    client: {},
    mqtt_state: 0,
      Temp: 0,
      Humi: 0,
      Light: 0,
      Smoke: 0,
      Wind: false,
      Beep: false,
      Air_value: 0,
      LED1:0,
      LED2:0,
      Elec1_value: '关',
      Elec2_value: '关'
}


const mutations = {
    CONNECT_MQTT: (state) => {
        //连接服务器
        state.client = connect(mqttUrl);
        state.client.on("connect", function () {
          console.log("成功连接mqtt服务器!");
          state.client.subscribe("/himlayasmarthome/pub", 0,err => {
              if (!err) {
                console.log("成功订阅设备上行数据topic");
                state.mqtt_state = 2;
              }
            });
        })
        //得到数据
        state.client.on("message", function (topic, message) {
        //console.log(topic);
        //console.log(message)
        //message是16进制的buffer字节流，需要转化一下
        let dataFromDev = {};
        dataFromDev = JSON.parse(message);
        state.Temp = dataFromDev.Temp;
        state.Humi = dataFromDev.Humi;
        state.Smoke = dataFromDev.Smoke;
        state.Light = dataFromDev.Light;
        state.Wind = dataFromDev.Wind;
        state.Beep = dataFromDev.Beep;
        state.Air_value = dataFromDev.Air_value;
        state.LED1 = dataFromDev.LED1;
        state.LED2 = dataFromDev.LED2;
        state.Elec1_value = dataFromDev.Elec1_value ? '开':'关';
        state.Elec2_value = dataFromDev.Elec2_value ? '开':'关';
      })

      // 断线重连
      state.client.on("reconnect", (error) => {
        console.log("正在重连：", new Date().getTime(), error);
        state.mqtt_state = 1;
      });

      // 连接失败
      state.client.on("error", (err) => {
        console.log("mqtt连接失败！{}", err);
        state.mqtt_state = 0;
        state.client.end();
      });
    },

    DISCONNECT_MQTT: (state) =>{
      if (state.client.connected) {
        try {
          state.client.end()
          state.client = {
            connected: false,
          }
          console.log('断开连接成功!')
        } catch (error) {
          console.log('Disconnect failed', error.toString())
        }
      }
    },

    PUBLISH_MQTT: (state, msg) =>{
        state.client.publish(
          "/himlayasmarthome/sub",msg,0,err => {
            if (!err) {
              console.log("发布成功！");
            } else {
              console.log("发布失败！", err);
            }
          })
      },

    SET_VALUE:(state, obj) => {
        // state.Temp = obj.Temp;
        // state.Humi = obj.Humi;
        // state.Light = obj.Light;
        // state.Smoke = obj.Smoke;
        state.Wind = obj.Wind;
        state.Beep = obj.Beep;
        state.Air_value = obj.Air_value;
        state.LED1 = obj.LED1;
        state.LED2 = obj.LED2;
    }
}

const actions = {
    connectMqtt({commit}){
        commit('CONNECT_MQTT')
    },
    publishMqtt({commit},msg){
        commit('PUBLISH_MQTT',msg)
    },
    disconnectMqtt({commit}){
      commit('DISCONNECT_MQTT')
    },

    setInfo({commit}, obj){
        commit('SET_VALUE', obj)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}