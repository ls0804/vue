<template>
  <div class="poers">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="powerData" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="pid" label="层级">
          <template slot-scope="scope">
             <span>{{scope.row.level | tier}}</span>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { userpower } from "@/api/powers.js";

export default {
  data() {
    return {
      powerData: []
    };
  },
  filters: {
      tier:level=>{
        if(level==0){
          return '一级'
        }
          if(level==1){
          return '二级'
        }
          if(level==2){
          return '三级'
        }
      }
  },
  mounted() {
    userpower("list")
      .then(res => {
        if (res.data.meta.status == 200) {
          this.powerData = res.data.data;
        }
      })
      .catch();
  },
};
</script>

<style scoped>
</style>
