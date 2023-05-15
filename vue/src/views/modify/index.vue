<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="用户名">
        <el-input :value="username" :disabled="true" style="width: 200px" />
      </el-form-item>

      <el-form-item label="密码" prop="pass">
        <el-input
          type="password"
          v-model="form.password"
          autocomplete="off"
          style="width: 300px"
        ></el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          v-model="form.checkPass"
          autocomplete="off"
          style="width: 300px"
        ></el-input>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input type="email" v-model="form.email" style="width: 300px" />
      </el-form-item>

      <el-form-item label="头像" prop="avatar">
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          ref="upload"
          :limit="1"
          :on-change="onChange"
          accept=".jpg,.png,.jpeg"
        >
          <i slot="default" class="el-icon-plus" @click="changeAvatar"></i>
          <div slot="file" slot-scope="{ file }">
            <img
              class="el-upload-list__item-thumbnail"
              :src="localUrl"
              alt=""
            />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { update } from "@/api/user";
export default {
  computed: {
    ...mapGetters(["username"]),
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.checkPass !== "") {
          this.$refs.form.validateField("checkPass");
        }
        callback();
      }
    };
    var validateCheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱地址"));
      } else if (value !== this.form.email) {
        callback(new Error("请输入正确的邮箱地址!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        username: "",
        password: "",
        checkPass: "",
        email: "",
        file: "",
      },
      disabled: false,
      dialogImageUrl: "",
      dialogVisible: false,
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validateCheckPass, trigger: "blur" }],
        email: [{ validator: validateEmail, trigger: "blur" }],
      },
    };
    
  },
  mounted() {
    this.form.username = this.username;
  },

  methods: {
    ...mapActions("mqttL", ["disconnectMqtt"]),

    clearForm() {
      //多处使用清除表格操作
      this.$refs.form.resetFields();
      this.$refs.upload.clearFiles();
    },

    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log("onSubmit this form-->");
          console.log(this.form);
          //必须新建formData来才能把图片传到后端
          let formData = new FormData();
          for (let key in this.form) {
            formData.append(key, this.form[key]);
            console.log(this.form[key] + " --> " + formData[key]);
          }
          update(formData).then((res) => {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            setTimeout(() =>{
              this.$notify.error({
                title: "用户信息更改",
                message: "请重新登录",
              });
            },1000)
              this.logout();
            
          });
        }
      });
    },
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning",
      });
      this.clearForm();
    },
    handleRemove(file) {
      this.form.file = ""; //清除表单中的文件记录
      this.$refs.upload.clearFiles(); //不符合的文件类型，清除已经上传的文件
    },
    handlePictureCardPreview(file) {
      //图片预览放大
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    changeAvatar() {
      //更改图片
      if (this.form.file != "") {
        this.$refs.upload.clearFiles();
      }
    },
    onChange(event) {
      const isPic =
        ["image/jpeg", "image/png", "image/jpg"].indexOf(event.raw.type) != -1;
      const isLt = event.raw.size / 1024 / 1024 < 5;
      if (!isPic) {
        this.$message({
          type: "error",
          message: "上传的图片只能是 png 或 jpg 格式!",
          duration: 1000 * 3,
        });
      }
      if (!isLt) {
        this.$message({
          type: "error",
          message: "上传图片大小不能超过 5MB!",
          duration: 1000 * 2,
        });
      }
      if (!isPic || !isLt) {
        this.form.file = ""; //清除表单文件记录
        this.$refs.upload.clearFiles(); //不符合的文件类型，清除已经上传的文件
        return;
      }

      //event.raw为图片实体，可通过consolse打印查看详情
      // 获取上传图片的本地URL，用于上传前的本地预览
      var URL = null;
      if (window.createObjectURL != undefined) {
        // basic
        URL = window.createObjectURL(event.raw);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        URL = window.URL.createObjectURL(event.raw);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        URL = window.webkitURL.createObjectURL(event.raw);
      }
      // 转换后的地址为 blob:http://xxx/7bf54338-74bb-47b9-9a7f-7a7093c716b5
      this.localUrl = URL;
      // this.isShowImgUpload = true; //呈现本地预览组件
      // this.isShowUpload = false; //隐藏上传组件
      console.log(URL);
      this.form.file = event.raw;
      console.log("the file of form is-->");
      console.log(this.form.file);
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      this.disconnectMqtt(); //退出时断开mqtt连接
    },
  },
};
</script>

<style  lang="scss" scoped>

.app-container{
  height: 100%;
  width: 100%;
  background: url("../../assets/allLOGO.png");
  background-position: center;
  background-size: cover;
  overflow: hidden;
  position: fixed;

}
.line {
  text-align: center;
}

</style>

