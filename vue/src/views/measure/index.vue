<template>
  <div>
    <div class="data-wrapper">
      <div class="data">
        <div class="data-logo">
          <i class="fa fa-thermometer-half fa-5x" style="color: #17aae4"></i>
        </div>
        <div class="data-text">
          <div class="data-title">温度</div>
          <div class="data-value">{{ Temp }}℃</div>
        </div>
      </div>

      <div class="data">
        <div class="data-logo">
          <i class="fa fa-heart-o fa-5x" style="color: #17aae4"></i>
        </div>
        <div class="data-text">
          <div class="data-title">湿度</div>
          <div class="data-value">{{ Humi }}%</div>
        </div>
      </div>

      <div class="data">
        <div class="data-logo">
          <i class="fa fa-sun-o fa-5x" style="color: #17aae4"></i>
        </div>
        <div class="data-text">
          <div class="data-title">光照</div>
          <div class="data-value">{{ Light }}Lx</div>
        </div>
      </div>

      <div class="data">
        <div class="data-logo">
          <i class="fa fa-mixcloud fa-5x" style="color: #17aae4"></i>
        </div>
        <div class="data-text">
          <div class="data-title">烟雾</div>
          <div class="data-value">{{ Smoke }}%</div>
        </div>
      </div>
    </div>
    <div id="test_app">
      <!--echarts的容器-->
      <div id="main" style="width: 90%; height: 70vh"></div>
    </div>
    
  </div>
</template>

<script>
import * as echarts from "echarts";
import { mapState } from "vuex";
import { getData } from "@/api/weather";
import { get } from "../../utils/index";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      location: {
        latitude: 0,
        longitude: 0,
      },
      day: [
        {
          fxData: "", //日期
          textDay: "", //天气情况
          tempMax: 0, //最高温度
          tempMin: 0, //最低温度
          humidity: 0, //相对湿度
        },
        {
          fxData: "", //日期
          textDay: "", //天气情况
          tempMax: 0, //最高温度
          tempMin: 0, //最低温度
          humidity: 0, //相对湿度
        },
        {
          fxData: "", //日期
          textDay: "", //天气情况
          tempMax: 0, //最高温度
          tempMin: 0, //最低温度
          humidity: 0, //相对湿度
        },
        {
          fxData: "", //日期
          textDay: "", //天气情况
          tempMax: 0, //最高温度
          tempMin: 0, //最低温度
          humidity: 0, //相对湿度
        },
        {
          fxData: "", //日期
          textDay: "", //天气情况
          tempMax: 0, //最高温度
          tempMin: 0, //最低温度
          humidity: 0, //相对湿度
        },
        {
          fxData: "", //日期
          textDay: "", //天气情况
          tempMax: 0, //最高温度
          tempMin: 0, //最低温度
          humidity: 0, //相对湿度
        },
        {
          fxData: "", //日期
          textDay: "", //天气情况
          tempMax: 0, //最高温度
          tempMin: 0, //最低温度
          humidity: 0, //相对湿度
        },
      ],
      charts: "",
      opinionData1: [1],
  
    };
  },
  computed: {
    ...mapState("mqttL", ["Temp", "Humi", "Light", "Smoke"]),
  },

  methods: {
    ...mapActions("weather", ["weatherTest"]),

    drawLine(id) {
      var myChart = echarts.init(document.getElementById(id));
      myChart.setOption({
        title: {
          left: "3%",
          top: "5%",
          text: "未来7日天气情况", //标题文本，支持使用 \n 换行
          subtext: "数据来自和风天气",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          align: "right", //文字在前图标在后
          left: "13%",
          top: "15%",
          data: ["最高温度", "最低温度", "相对湿度"],
        },
        color: ["rgb(255,96,64)", "rgb(230, 197, 91)", "rgb(0, 0, 0)"],
        grid: {
          top: "30%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          axisTick: {
            alignWithLabel: true, //保证刻度线和标签对齐
          },
          data: [
            this.day[0].fxData+"["+this.day[0].textDay+"]",
            this.day[1].fxData+"["+this.day[1].textDay+"]",
            this.day[2].fxData+"["+this.day[2].textDay+"]",
            this.day[3].fxData+"["+this.day[3].textDay+"]",
            this.day[4].fxData+"["+this.day[4].textDay+"]",
            this.day[5].fxData+"["+this.day[5].textDay+"]",
            this.day[6].fxData+"["+this.day[6].textDay+"]",
          ], //x坐标的名称
        },
        yAxis: {
          type: "value",
          boundaryGap: true,
          splitNumber: 6, //纵坐标数
          interval: 30, //强制设置坐标轴分割间隔
        },

        series: [
          {
            name: "最高温度",
            type: "line", //折线图line;柱形图bar;饼图pie
            stack: "最高温度",
            itemStyle: {
              color: "rgb(250,195,4)", //改变折线点的颜色
              lineStyle: {
                color: "rgb(255,96,64)", //改变折线颜色
              },
            },
            data: [
              this.day[0].tempMax,
              this.day[1].tempMax,
              this.day[2].tempMax,
              this.day[3].tempMax,
              this.day[4].tempMax,
              this.day[5].tempMax,
              this.day[6].tempMax,
            ],
          },
          {
            name: "最低温度",
            type: "line", //折线图line;柱形图bar;饼图pie
            stack: "最低温度",
            itemStyle: {
              color: "rgb(96, 212, 212)", //改变折线点的颜色
              lineStyle: {
                color: "rgb(230, 197, 91)", //改变折线颜色
              },
            },
            data: [
              this.day[0].tempMin,
              this.day[1].tempMin,
              this.day[2].tempMin,
              this.day[3].tempMin,
              this.day[4].tempMin,
              this.day[5].tempMin,
              this.day[6].tempMin,
            ],
          },
          {
            name: "相对湿度",
            type: "line", //折线图line;柱形图bar;饼图pie
            stack: "相对湿度",
            itemStyle: {
              color: "rgb(156,169,189)", //改变折线点的颜色
              lineStyle: {
                color: "rgb(0,0,0)", //改变折线颜色
              },
            },
            data: [
              this.day[0].humidity,
              this.day[1].humidity,
              this.day[2].humidity,
              this.day[3].humidity,
              this.day[4].humidity,
              this.day[5].humidity,
              this.day[6].humidity,
            ],
          },
        ],
      });
      /*窗口尺寸发生变化时，echarts 实例重置尺寸*/
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    //将经纬度发回后端，后端拿到天气数据返回
    getWeather() {
      var that = this;
      //获取天气
      getData(that.location.latitude, that.location.longitude)
        .then((res) => {
          console.log(res);
          const { daily } = res;
          //console.log(daily)
          that.setWeatherData(daily);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    // 根据IP地址获取经纬度
    getLaAndLonByIP() {
      var latitude;
      this.$jsonp("https://apis.map.qq.com/ws/location/v1/ip", {
        key: "UBCBZ-GF3L3-DBU32-3XP2U-KY5TV-7ZBRX",
        output: "jsonp",
      })
        .then((res) => {
          console.log(res);
          if (res.status === 0) {
            // 获取到的经纬度处理
            this.location.latitude = res.result.location.lat;
            this.location.longitude = res.result.location.lng;
            // 获取到IP经纬度，在渲染地图（一种做法）
            //this.loadScript()
            console.log(
              "lat：" +
                this.location.latitude +
                " lon:" +
                this.location.longitude
            );
          }
          this.getWeather(); //得到经纬度后开始查找天气
        })
        .catch((e) => {
          console.log(e);
        });
      
    },

    setWeatherData(daily) { //设置天气数据
      var i = 0;
      console.log(daily);
      for (i; i < 7; i++) {
        this.day[i].fxData = daily[i].fxDate;
        this.day[i].textDay = daily[i].textDay;
        this.day[i].tempMin = daily[i].tempMin;
        this.day[i].humidity = daily[i].humidity;
        this.day[i].tempMax = daily[i].tempMax;
      }
      //console.log(this.day[])
      this.drawLine("main"); //得到数据就绘制折线图
    },
  },

  //调用
  mounted() {
    this.getLaAndLonByIP(); //挂载时就调用
  },
};
</script>


<style lang="scss" scoped>
.data-wrapper {
  margin-top: 20px;
  margin-left: 20px;
  display: flex;
  //justify-content: space-between;
  //justify-content: 10px;

  .data {
    margin-left: 20px;
    background-color: #ffff;
    width: 280px;
    height: 120px;
    border-radius: 20px;
    display: flex;
    justify-content: space-around;
    padding: 0 8px;
    box-shadow: 0px 0px 2px;
  }
  .data-logo {
    height: 80px;
    width: 80px;
    margin-top: 20px;
  }

  .data-text {
    margin-top: 20px;
    color: #7f7f7f;
    .data-title {
      font-size: 40px;
      //当数值过大时，标题右对齐
      text-align: right;
    }
    .data-value {
      font-size: 40px;
    }
  }
}
</style>