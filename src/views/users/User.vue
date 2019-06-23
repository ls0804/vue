<template>
  <div class="user">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-input
        placeholder="请输入内容"
        v-model="input5"
        class="input-with-select"
        style="margin-top: 15px;width:320px;"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>&nbsp;
      <el-button type="success" plain>添加用户</el-button>
    </div>
    <el-table :data="userList" border style="width: 100%;margin-top:10px;">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="状态" width="90">
        <template slot-scope="scope">
          <el-switch v-model="value2" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="info" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" icon="el-icon-share"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total-0"
    ></el-pagination>
  </div>
</template>
<script>
import { getAllList } from "@/api/users.js";
export default {
  data() {
    return {
      input5: "",
      total: "",
      value2: true,
      query: "",
      //   当前页码
      pagenum: 1,
      //   每页显示的记录数
      pagesize: 2,
      userList: []
    };
  },
  mounted() {
    this.fn();
  },
  methods: {
    fn() {
      getAllList({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
        .then(res => {
        console.log(res);
        this.userList=res.data.data.users
                  this.total = res.data.data.total

        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize=val
    this.fn();

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum=val
    this.fn();

    
    }
  }
};
</script>
<style lang="less" scoped>
</style>

