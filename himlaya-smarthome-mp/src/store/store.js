import Vue from 'vue'
import Vuex from 'vuex'
import {sub,pub} from '../utils/mqttTools'
import { connect } from "mqtt/dist/mqtt.js";

Vue.use(Vuex)

const mqttUrl = "wxs://himlaya.xqmqttssl.top:8084/mqtt";
// const option ={
//   connectTimeout: 4000,  //超时时间
//   clientId: 'C_clientcc',  //随机生成ID
//   username: 'admin',  //用户名
//   password: 'nodream7@',  //密码
// }

const store = new Vuex.Store({

  state: {
    username: "",
    password: "",
    email: "",
    avatar: "",
    client: {},
      Temp: 0,
      Humi: 0,
      Light: 0,
      Smoke: 0,
      Wind: 0,
      Beep: 0,
      Led1Check: false,
      Led2Check: false,
      LED1_value: 0,
      LED2_value: 0,
      Elec1_value: 0,
      Elec2_value: 0,
      area: "请求中...", //城区
      city: "请求中...", //城市
      airText: "请求中...", //空气质量文本
      airValue: 0, //空气指数
      weather: "请求中...", //天气
      weatherAdvice: "请求中...", //天气建议
  },
  mutations: {
    setUserInfo: (state, obj) => {
      state.username = obj.username;
      state.password = obj.password;
      state.email = obj.email;
      state.avatar = obj.avatar;
    },
   
    connectMqtt: (state) => {
      //连接服务器
        store.client = connect(mqttUrl);
        store.client.on("connect", function () {
        console.log("成功连接mqtt服务器!");
          store.client.subscribe("/himlayasmarthome/pub", function (err) {
            if (!err) {
              console.log("成功订阅设备上行数据topic");
            }
          });
        })
      //得到数据
     store.client.on("message", function (topic, message) {
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
      state.LED1_value = dataFromDev.LED1_pwm;
      state.LED2_value = dataFromDev.LED2_pwm;
      state.Elec1_value = dataFromDev.Elec1_value; //由于位置，换一下
      state.Elec2_value = dataFromDev.Elec2_value;
      
     })
    },
    publishMqtt: (state, msg) =>{
      store.client.publish(
        "/himlayasmarthome/sub",msg,0,err => {
          if (!err) {
            console.log("发布成功！");
          } else {
            console.log("发布失败！", err);
          }
        })
    },
    getWeatherContent:(state) =>{

      wx.getLocation({
        type: "gcj02",
        success(res) {
          const latitude = res.latitude;
          const longitude = res.longitude;
          const key = "74477953f8864b31b61f258a2720705f"; 
  
          wx.request({ //城市请求
            url:`https://geoapi.qweather.com/v2/city/lookup?&location=${longitude},${latitude}&key=${key}&gzip=n`, //获取城市数据api接口
            success(res) {
              //console.log(res.data)
              const {name,adm2} = res.data.location[0]
      
               state.area = name
               state.city = adm2
  
            },
          });
  
          wx.request({ //天气请求
            url:`https://devapi.qweather.com/v7/weather/now?&location=${longitude},${latitude}&key=${key}&gzip=n`, //获取天气数据api接口
            success(res) {
              //console.log(res.data)
              const {text} = res.data.now
      
              state.weather = text;
  
            },
          });
  
          wx.request({ //空气质量请求
            url:`https://devapi.qweather.com/v7/air/now?&location=${longitude},${latitude}&key=${key}&gzip=n`, //获取空气数据api接口
            success(res) {
              //console.log(res.data)
              const {aqi,category} = res.data.now
  
              state.airText = category
              state.airValue = aqi
  
            },
          });
  
          wx.request({ //生活建议
             url:`https://devapi.qweather.com/v7/indices/1d?type=1,3,6,8&location=${longitude},${latitude}&key=${key}&gzip=n`, //获取生活数据api接口
            success(res) {
              console.log(res.data)
              const {text} = res.data.daily[0] //有很多建议，此处为天气建议
              //const {aqi,quality} = city //将单独两个数据提取出来
              state.weatherAdvice = text
              
  
            },
          });
        }
      });
    }   
  }
})

export default store
