<template>
  <div>
    <div class="dashboard">
      <div class="container">
        <div class="text">hello,{{username}}</div>
      </div>
      
    </div>

    <div class="weather">
        <div id="he-plugin-standard" class="weather"></div>

    </div>

    <div class="block">
      <el-carousel class="invite-carousel" height="395px">
      <el-carousel-item v-for= "(item, index) in imgList" :key="index" @click.native="goPage(item,index)">
        <h3><img :src="item" class="image"> </h3>
      </el-carousel-item>
      </el-carousel>
    </div>

   


  </div>
</template>

<script>
import { mapGetters, mapActions, mapState} from "vuex";

export default {
  //username: "Dashboard",
  computed: {
    ...mapGetters(["username"]),
    ...mapState("mqttL", ["Temp", "Humi", "Light", "Smoke"]),
  },

  data() {
    return {
    imgList:[
        require('../../assets/xiaomi.png'),
        require('../../assets/control.png'),
        require('../../assets/honey.png'),
        require('../../assets/haier.png'),
      ],

    jumpUrls:[
      ('https://www.mi.com/a/h/23546.html?sign=819cc09176dc67a8dbe3cee17272115c&g_utm=Thirdparty.Baidu.Keyword.Keyword-Baidu-PC.AIOT-F-11'),
      ('https://cn.control4.com/'),
      ('https://www.honeywell.com.cn/products-services/building-technologies/connected-living-solutions/smart-control'),
      ('https://www.haier.com/smarthome/?spm=cn.home_pc.header_0_20210207.1')
    ]
    };
  },


  methods: {
    ...mapActions("mqttL", ["connectMqtt"]),
    goPage(item,index){
        //console.log(index)
        window.open(this.jumpUrls[index], '_blank')
    }
  },

  mounted() {
   
  },

  created() {
    //和风天气插件调用
    window.WIDGET = {
      CONFIG: {
        layout: "1",
        width: "700",
        height: "200",
        background: "5",
        dataColor: "17AAE4",
        language: "zh",
        borderRadius: "5",
        key: "f2a20800b2254474a40934977f8d8a7f",
      },
    };
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0";
    document.getElementsByTagName("head")[0].appendChild(script);
  },
 
};
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  .container {
    margin: 20px;
  }
  
  .text {
    color: #17aae4;
    font-size: 30px;
    line-height: 46px;
  }

}

.weather{
    display: flex;
    .weather{
     float: left;
  }

}
.block{
	width: 50%;
	//left: 15%;
}



</style>
