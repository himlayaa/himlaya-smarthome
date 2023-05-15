<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

//import { getToken } from '@/utils/auth' // get token from cookie
import { mapActions ,mapGetters} from "vuex";

 //const hasToken = getToken();

export default {
  name: "App",
  computed: {
    ...mapGetters(["mqtt_state"]),
    
  },
  data() {
    return {
    
    };
  },

  watch: { //监听mqtt连接情况
      mqtt_state:{
        handler(newValue){
          this.notify(newValue);
        }
      }
  },

  methods: {
    notify(num){ //根据mqtt连接情况，提示信息
      var that = this;
      if(num == 2){
        that.$notify({
          title: "连接成功",
          message: "mqtt服务器连接成功",
          type: "success",
        });
      }else if(num == 1){
         this.$notify({
          title: '正在重连',
          message: 'mqtt重连中...',
          type: 'warning'
        });
      }else{
         that.$notify.error({
          title: "连接失败",
          message: "mqtt服务器连接失败",
        })
      }
    }

    },
    
   
  

};
</script>
