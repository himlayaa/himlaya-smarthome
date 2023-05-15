<template>
  <div class="scorePage">
    <div class="forml">
      <el-form ref="form" :model="form" label-width="80px" id="score">
        <el-form-item label="评分">
          <el-rate v-model="form.score" show-score=""></el-rate>
        </el-form-item>

        <el-form-item label="建议">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="form.desc"
            style="width: 400px; height: 100px"
            :rows="4"
            maxlength="60"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
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
    return {
      form: {
        score: 0,
        desc: "",
      },
      value: null,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
    };
  },
  mounted() {},

  methods: {
    clearForm() {
      //多处使用清除表格操作
      this.form.score = 0;
      this.form.desc = '';
     //this.$refs.upload.clearFiles();
    },

    onSubmit() {
      var that = this;
      if (that.form.desc == "") {
        this.$message({
          message: "提交信息不能为空",
          type: "warning",
        });
        return;
      }

      var obj = $(that.form);
      console.log(obj[0]);

      $.ajax({
        type: "post", //必须post请求
        url: "https://formspree.io/f/mqkojpav", //
        async: true,
        data: obj[0],
        dataType: "json",
        success: (res) => {
          this.$message({
            message: "感谢您的反馈支持，我们将在后续版本中进行改进...",
            type: "success",
          });
          this.clearForm();
        },
        error: (res) => {
          this.$message({
            message: "提交失败！",
            type: "error",
          });
        },
      });
    },
    onCancel() {
      this.clearForm();
      this.$message({
        message: "cancel!",
        type: "warning",
      });
      
    },
  },
};
</script>

<style lang="scss">
.scorePage {

  height: 100%;
  width: 100%;
  background: url("../../assets/allLOGO.png");
  background-position: center;
  background-size: cover;
  overflow: hidden;
  position: fixed;

  .el-rate__icon {
    font-size: 30px;
  }

  .forml {
    margin-left: 42px;
    margin-top: 40px;
  }
}
</style>

