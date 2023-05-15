<template>
  <div>
    <van-notify id="van-notify" left-icon="checked" />

    <div class="header">
      <div v-if="isLogin">
        <div class="header-Title">请登录</div>
        <div class="header-info">Please Sign in your account</div>
      </div>
      <div v-else>
        <div class="header-Title">请注册</div>
        <div class="header-info">Please Sign up your account</div>
      </div>
    </div>
    <div class="body">
      <div class="login-form">
        <van-field
          placeholder="请输入用户名"
          :value="inputUserName"
          @change="onUserNameChange"
        />
        <van-field
          type="password"
          placeholder="请输入密码"
          :value="inputPassword"
          @change="onPasswordChange"
        />
        <div v-if="!isLogin">
          <van-field
            placeholder="请输入邮箱"
            :value="inputEmail"
            @change="onEmailChange"
          />
        </div>
      </div>
      <van-button solt="button" round block color="#17aae4" @click="onClick">
        {{ isLogin ? "登录" : "注册" }}
      </van-button>

      <div class="other-option">
        <div @click="signUpClick">
          <span>{{ isLogin ? "注册账户" : "返回登录" }}</span>
        </div>

        <span style="margin: 0 30px">|</span>
        <div>
          <span @click="forgetClick">忘记密码</span>
        </div>
      </div>

      <!-- <div class="copyright-wrapper">
        <span class="copyright">Power by himlaya</span>
      </div> -->
      <van-dialog
        use-slot
        title="找回密码"
        :show="showFindPW"
        show-cancel-button
        transition="fade"
        @confirm="onFindPWConfirm"
        @cancel="onFindPWCancel"
      >
        <van-field
          label="username"
          title-width="60px"
          placeholder="请输入账号"
          :value="inputAccount"
          @change="onAccountChange"
        />
        <van-field
          label="email"
          title-width="60px"
          placeholder="请输入邮箱"
          :value="inputEmail"
          @change="onEmailChange"
        />
      </van-dialog>

      <van-dialog
        use-slot
        title="重置密码"
        :show="showResetPW"
        show-cancel-button
        transition="fade"
        @confirm="onResetPWConfirm"
        @cancel="onResetPWCancel"
      >
      </van-dialog>
      <van-toast id="van-toast" />

      <dir class="backImg">
        <image class="LOGO" src="/static/images/weLOGO.png"></image>
      </dir>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import Toast from "@vant/weapp/dist/toast/toast";
import Notify from "@vant/weapp/dist/notify/notify";

export default {
  data() {

    return {
      isLogin: true,
      inputUserName: "",
      inputPassword: "",
      inputEmail: "",
      inputAccount: "",
      showFindPW: false,
      showResetPW: false,
    }
  },
  methods: {
    ...mapMutations(["setUserInfo"]),

    onUserNameChange(event) {
      var that = this;
      console.log(event.mp.detail);
      that.$set(that, "inputUserName", event.mp.detail);
      console.log("当前输入的用户名 = ", event.mp.detail);
    },
    onPasswordChange(event) {
      var that = this;
      console.log(event.mp.detail);
      that.$set(that, "inputPassword", event.mp.detail);
      console.log("当前输入的密码 = ", event.mp.detail);
    },
    onAccountChange(event) {
      var that = this;
      console.log(event.mp.detail);
      that.$set(that, "inputAccount", event.mp.detail);
      console.log("当前输入的账号 = ", event.mp.detail);
    },
    onEmailChange(event) {
      var that = this;
      console.log(event.mp.detail);
      that.$set(that, "inputEmail", event.mp.detail);
      console.log("当前输入的邮箱 = ", event.mp.detail);
    },
    onClick(event) {
      var that = this;
      var code = null;
      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: that.isLogin ? "登录中..." : "注册中...",
      });

      if(that.isLogin){
        //登录走这里
        wx.login({
          success: function (event) {
            code = event.code;
            let params = {};
            params.username = that.inputUserName; //用户名
            params.password = that.inputPassword; //密码
            params.email = that.inputEmail; //邮箱
            wx.request({
              url: "https://himlaya.xqmqttssl.top:443/user/wxLogin", //后台接口
              data: params,
              method: "POST",
              header: {
                "Content-Type": "application/json",
              },
              success: function (res) {
                //URL为你后台的接口
                console.log(res);
                if (res.data.code === 200) {
                  //有相关信息
                  //存储用户信息
                  //将mysql数据拿到
                  that.setUserInfo(res.data.userInfo);

                  wx.switchTab({
                    url: "/pages/index/main", //跳转到指定页面
                  });
                } else if(res.data.code === 201){ //警告
                  console.log(res.data.msg);
                  Toast.fail(res.data.msg);
                }else if(res.data.code === 400){ //错误
                  console.log(res.data.msg);
                  Toast.fail(res.data.msg);
                }else{  //没连上服务器
                  console.log(res.data.msg);
                  Toast.fail("连接服务器失败！");
                }
              },
            });
          },
          error: function (event) {
            Toast.fail("服务器连接失败！");
          }
        });


      }else{  //注册走这里
        wx.login({
        success: function (event) {
          code = event.code;
          let params = {};
          params.username = that.inputUserName; //用户名
          params.password = that.inputPassword; //密码
          params.email = that.inputEmail; //邮箱
          var cur = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
          if(!cur.test(params.email)){
            Toast.fail("请输入正确的邮箱！");
          }else{
          wx.request({
            url: "https://himlaya.xqmqttssl.top:443/user/wxSignup", //后台接口
            data: params,
            method: "POST",
            header: {
              "Content-Type": "application/json",
            },
            success: function (res) {
              //URL为你后台的接口
              console.log(res);
              if (res.data.code === 200) {
                //有相关信息
                //存储用户信息
                //将mysql数据拿到
                that.setUserInfo(res.data.userInfo);

                wx.switchTab({
                  url: "/pages/index/main", //跳转到指定页面
                });
              } else if(res.data.code === 201){ //警告
                console.log(res.data.msg);
                Toast.fail(res.data.msg);
              }else if(res.data.code === 400){ //错误
                console.log(res.data.msg);
                Toast.fail(res.data.msg);
              }else{ //连接失败
                console.log(res.data.msg);
                Toast.fail("连接服务器失败！");
              }
            },
          });
          }
        },
      });

      }
    },

    signUpClick(event) {
      var that = this;
      console.log("注册");
      that.isLogin = !that.isLogin;
      console.log(`当前处于${that.isLogin ? "登录" : "注册"}状态`);
    },
    forgetClick(event) {
      var that = this;
      that.showFindPW = true;
    },

    onResetPWConfirm(event) {
      var that = this;
      var code = null;
      wx.login({
        success: function (event) {
          code = event.code;
          let params = {};
          params.username = that.inputAccount; //用户名
          params.email = that.inputEmail; //邮箱
          var cur = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
          if(!cur.test(params.email)){
            Toast.fail("请输入正确的邮箱！");
          }else{
            wx.request({
            url: "https://himlaya.xqmqttssl.top:443/user/wxForget", //后台接口
            data: params,
            method: "POST",
            header: {
              "Content-Type": "application/json",
            },
            success: function (res) {
              //URL为你后台的接口
              console.log(res);
              if (res.data.code === 200) {
                //有相关信息
                //存储用户信息
                //将mysql数据拿到
                //that.setUserInfo(res.data.userInfo);
                Notify({
                  type: "success",
                  message: "重置成功!",
                  color: "#67c23a",
                  background: "#f0f9eb",
                  duration: 1500,
                });
              } else if(res.data.code === 201){
                console.log(res.data.msg);
                Toast.fail(res.data.msg);
              }else if(res.data.code === 400){
                console.log(res.data.msg);
                Toast.fail(res.data.msg);
              }else{
                console.log(res.data.msg);
                Toast.fail("连接服务器失败！");
              }
            },
            
          });
          }
        },
      });
      that.showResetPW = false;
      that.showFindPW = false;
    },
    onFindPWCancel(event) {
      var that = this;
      that.showFindPW = false;
      that.inputPassword = "";
      that.inputEmail = "";
    },
    onFindPWConfirm(event) {
      var that = this;
      that.showResetPW = true;
    },
    onResetPWCancel(event) {
      var that = this;
      that.showResetPW = false;
      that.inputPassword = "";
      that.inputEmail = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  height: 100px;
  padding: 25px 0;
  background-color: #17aae4;

  .header-Title {
    font-size: 28px;
    font-weight: 500px;
    color: #fff;
    margin-left: 20px;
  }
  .header-info {
    font-size: 14px;
    color: #fff;
    margin-left: 20px;
  }
}
.body {
  padding: 20px;
  //实现圆角
  margin-top: -20px;
  border-radius: 15px 15px 0 0;
  background-color: #fff;
  .login-form {
    margin-bottom: 20px;
  }
  .other-option {
    display: flex;
    justify-content: center;
    margin-top: 15px;
    color: #9f9f9f;
  }

  .backImg {
    .LOGO {
      width: 139px;
      height: 38px;
      margin-left: 103px;
      margin-top: 250px;
    }
  }
}
</style>
