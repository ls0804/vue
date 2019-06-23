<template>
  <div class="login">
    <div class="container">
      <img src="../assets/1.jpg" alt class="avatar">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item prop="username">
          <el-input
            v-model="ruleForm.username"
            placeholder="请输入用户名"
            prefix-icon="myicon myicon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入密码" prefix-icon="myicon myicon-key"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { userlogin } from "@/api/users.js";
export default {
  data() {
    return {
      ruleForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    login() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          userlogin(this.ruleForm)
            .then(result => {
              if (result.data.meta.status == 200) {
                localStorage.setItem(
                  "itcast_pro_token",
                  result.data.data.token
                );
                this.$router.push({ name: "index" });
              } else {
                this.$message({
                  message: result.data.meta.msg,
                  type: "error"
                });
              }
            })
            .catch(() => {
              this.$message({
                message: "服务器异常，请重试",
                type: "error"
              });
            });
        } else {
          // 给出用户提示
          this.$message({
            message: "数据输入不合法",
            type: "error"
          });
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
