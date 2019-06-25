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
        v-model="query"
        class="input-with-select"
        style="margin-top: 15px;width:320px;"
        @keyup.enter.native="fn"
      >
        <el-button slot="append" icon="el-icon-search" @click='fn'></el-button>
      </el-input>&nbsp;
      <el-button type="success" plain @click="dialogFormVisible = true">添加用户</el-button>
    </div>
    <el-table :data="userList" border style="width: 100%;margin-top:10px;">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="状态" width="90">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changsstates(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="info" icon="el-icon-edit" @click="edituser(scope.row)"></el-button>
            <!-- <el-button type="info" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button> -->
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" icon="el-icon-share" @click="getsroles(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" @click="del(scope.row)"></el-button>
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

    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" :closeOnClickModal='false'>
      <el-form ref="addform" :model="addform" :rules="rules">
        <el-form-item label="用户名" prop="username" :label-width="'100px'">
          <el-input v-model="addform.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="'100px'" prop="password">
          <el-input v-model="addform.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="'100px'" prop="email">
          <el-input v-model="addform.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="'100px'" prop="mobile">
          <el-input v-model="addform.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false;$refs.addform.resetFields()">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑用户" :visible.sync="editdialogFormVisible" :closeOnClickModal='false'>
      <el-form ref="editform" :model="editform" :rules="rules">
        <el-form-item label="用户名" prop="username" :label-width="'100px'">
          <el-input v-model="editform.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="'100px'" prop="email">
          <el-input v-model="editform.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="'100px'" prop="mobile">
          <el-input v-model="editform.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editdialogFormVisible = false;$refs.editform.resetFields()">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="allotdialogFormVisible" :closeOnClickModal='false'>
      <el-form ref="allotform" :model="allotform" :rules="rules">
        <el-form-item label="用户名" prop="username" :label-width="'100px'">
          <el-input v-model="allotform.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-select v-model="allotform.rid" placeholder="请选择" @change="roleChange">
          <el-option v-for="item in options" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="allotdialogFormVisible = false;$refs.allotform.resetFields()">取 消</el-button>
        <el-button type="primary" @click="btngetsroles">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAllList } from "@/api/users.js";
import { editusers } from "@/api/users.js";
import { delusers } from "@/api/users.js";
import { changusers } from "@/api/users.js";
import { allotusers } from "@/api/users.js";
import { getroles } from "@/api/users.js";
import { addusers } from "@/api/users.js";
export default {
  data() {
    return {
      options: [],
      value: "",
      total: "",
      dialogFormVisible: false,
      editdialogFormVisible: false,
      allotdialogFormVisible: false,
      states: true,
      query: "",
      allotform: {
        id: "",
        rid: "",
        username: ""
      },
      addform: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editform: {
        username: "",
        email: "",
        mobile: "",
        id: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入电话", trigger: "blur" }]
      },
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
    roleChange(value) {
      this.allotform.rid = value;
    },

    getsroles(obj) {
      this.allotform.rid = obj.role_name;

      this.allotdialogFormVisible = true;
      this.allotform.username = obj.username;
      this.allotform.id = obj.id;
      getroles().then(res => {
        this.options = res.data.data;
      });
    },
    btngetsroles() {
      var obj = this.allotform;

      allotusers(obj)
        .then(res => {
          if (res.data.meta.status == 200) {
            this.allotdialogFormVisible = false;
            this.$message({
              type: "success",
              message: res.data.meta.msg
            });
          } else {
            this.$message({
              message: res.data.meta.msg
            });
          }
        })
        .catch(() => {});
    },
    changsstates(id, type) {
      changusers(id, type)
    
        .then(res => {
          if (res.data.meta.status == 200) {
            this.$message({
              type: "success",
              message: res.data.meta.msg
            });
          } else {
            this.$message({
              type: "success",
              message: "状态修改失败!"
            });
          }
        })
        .catch(() => {
          this.$message({
            message: "状态修改失败!"
          });
        });
    },
    del(obj) {
      this.$confirm(
        "此操作将永久删除ID为" + obj.id + "的用户, 是否继续?",
        "删除用户",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          delusers(obj)
            .then(res => {
              this.fn();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            })
            .catch(() => {
              this.$message({
                type: "success",
                message: "删除失败!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    edituser(obj) {
      this.editform.username = obj.username;
      this.editform.email = obj.email;
      this.editform.mobile = obj.mobile;
      this.editdialogFormVisible = true;
      this.editform.id = obj.id;
    },
    edit(obj) {
      this.$refs.editform.validate(valid => {
        if (valid) {
          editusers(this.editform)
            .then(res => {
              if (res.data.meta.status == 200) {
                this.editdialogFormVisible = false;
                this.fn();
                this.$message({
                  message: res.data.meta.msg,
                  type: "success"
                });
              } else {
                this.$message({
                  message: res.data.meta.msg
                });
              }
            })
            .catch(() => {});
        } else {
          console.log("no");
        }
      });
    },
    add() {
      this.$refs.addform.validate(valid => {
        if (valid) {
          addusers(this.addform)
            .then(res => {
              if (res.data.meta.status == 201) {
                this.dialogFormVisible = false;
                this.$message({
                  message: res.data.meta.msg,
                  type: "success"
                });

                this.fn();
              } else {
                this.$message({
                  message: res.data.meta.msg
                });
              }
            })
            .catch(() => {
              this.$message({
                message: res.data.meta.msg,
                type: "warning"
              });
            });
        } else {
          this.$message({
            message: "输入有误"
          });
          return false;
        }
      });
    },
    fn() {
      getAllList({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
        .then(res => {
          this.userList = res.data.data.users;
          this.total = res.data.data.total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.fn();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.fn();
    }
  }
};
</script>
<style lang="less" scoped>
</style>
