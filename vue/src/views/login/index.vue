<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">智能家居</h3>
      </div>

      <!--如果没有忘记密码  -->

      <el-form-item prop="username">
        <!--用户名输入框  -->
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <div v-if="!isForget">
        <!--如果没有忘记密码  -->
        <el-form-item prop="password">
          <!--密码输入框  -->
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
      </div>
      <div v-else>
        <!--如果忘记密码  -->
        <el-form-item prop="email">
          <!--邮箱输入框  -->
          <span class="svg-container">
            <svg-icon icon-class="email" />
          </span>
          <el-input
            :key="emailType"
            ref="email"
            v-model="loginForm.email"
            :type="emailType"
            placeholder="注册邮箱"
            name="email"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleForget"
          />
        </el-form-item>
      </div>

      <div v-if="!isLogin">
        <!--注册新用户  -->
        <el-form-item prop="checkPass">
          <!--确认密码输入框  -->
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.checkPass"
            :type="passwordType"
            placeholder="确认密码"
            name="checkPass"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleSignup"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>

        <el-form-item prop="email">
          <!--邮箱输入框  -->
          <span class="svg-container">
            <svg-icon icon-class="email" />
          </span>
          <el-input
            :key="emailType"
            ref="email"
            v-model="loginForm.email"
            :type="emailType"
            placeholder="邮箱"
            name="email"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleSignin"
          />
        </el-form-item>
      </div>

      <div v-if="isForget">
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleForget"
          >重置密码</el-button
        >
      </div>
      <div v-else>
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleLogin"
        >
          {{ isLogin ? "登录" : "注册" }}</el-button
        >
      </div>

      <div class="tips">
        <div v-if="isLogin">
          <span class="forgetSpan" @click="forget">{{
            isForget ? "登录" : "忘记密码"
          }}</span>
        </div>
        <div v-if="!isForget">
          <span class="signSpan" @click="signIn">{{
            isLogin ? "注册" : "登录"
          }}</span>
        </div>
      </div>
    </el-form>

    <el-form
      ref=""
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
    </el-form>

    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
    </el-form>

  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("请输入正确的用户名！"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不少于6位！"));
      } else {
        callback();
      }
    };
    var validateCheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.loginForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱地址"));
      } else if (value !== this.loginForm.email) {
        callback(new Error("请输入正确的邮箱地址!"));
      } else {
        callback();
      }
    };
    return {
      isLogin: true,
      isForget: false,
      loginForm: {
        //登录用户表
        username: "",
        password: "",
        checkPass: "",
        email: "",
      },

      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        checkPass: [
          { required: true, trigger: "blur", validator: validateCheckPass },
        ],
        email: [{ required: true, trigger: "blur", validator: validateEmail }],
      },

      loading: false,
      passwordType: "password",
      emailType: "email",
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    clearForm() {
      //多处使用清除表格操作
      this.$refs.form = "";
    },
    forget() {
      //忘记密码
      this.isForget = !this.isForget;
      this.clearForm();
    },
    signIn() {
      //注册按钮
      this.isLogin = !this.isLogin;
      //console.log("注册页面")
      this.clearForm();
    },
    showPwd() {
      //显示密码
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      //处理登录
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSignup() {
      //处理注册
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/signup", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
              
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleForget() {
      //处理忘记密码
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/forget", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;

              this.$message({
                message: "重置成功!",
                type: "success",
              });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #D8E0D3;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      //-webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #F0F9EB;
  }
}
</style>

<style lang="scss" scoped>
$bg: #F0F9EB;//F0F9EB //2d3a4b

$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {


  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background: url("../../assets/login/fullLOGO.png");
  background-position: to-upper-case($string: "10");
  background-color: $bg;
  background-size: cover;
  overflow: hidden;
  position: fixed;

  .login-form {

    position: fixed;
    margin-right: 20px;
    width: 520px;
    max-width: 100%;
    padding: 0 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #7f7f7f;
    margin-bottom: 10px;
    margin-right: 20px;
    display: flex;
    justify-content: space-between;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: flex;
    margin-top: 140px;

    .title {
      font-size: 26px;
      color: #54A0FF;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

}
</style>
