<template>
  <div class="role">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" @click="addimpower">添加角色</el-button>
    <template>
      <el-table :data="roleuser" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="first in scope.row.children" :key="first.id" style="margin:5px 5px 0 0">
              <el-col :span="4">
                <el-tag
                  closable
                  type="success"
                  @close="delrole(scope.row,first.id)"
                >{{first.authName}}</el-tag>
              </el-col>
              <el-col :span="20">
                <el-row
                  v-for="second in first.children"
                  :key="second.id"
                  style="margin:5px 5px 0 0"
                >
                  <el-col :span="4">
                    <el-tag
                      closable
                      type
                      v-if="second.children.length !== 0"
                      @close="delrole(scope.row,second.id)"
                    >{{second.authName}}</el-tag>
                  </el-col>
                  <el-col :span="20">
                    <el-col :span="24">
                      <el-tag
                        closable
                        type="danger"
                        v-for="third in second.children"
                        :key="third.id"
                        style="margin:5px 5px 0 0"
                        @close="delrole(scope.row,third.id)"
                      >{{third.authName}}</el-tag>
                    </el-col>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop="desc">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="info" icon="el-icon-edit" @click="editrole(scope.row)"></el-button>
              <!-- <el-button type="info" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button> -->
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
              <el-button type="success" icon="el-icon-share" @click="roleimpower(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="warning" icon="el-icon-delete" @click="del(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <el-dialog title="角色授权" :visible.sync="impowerroleuser" :closeOnClickModal='false'>
      <div class="box">
        <el-tree
          ref="tree"
          :data="data2"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="rightListByRole"
          :props="defaultProps"
        ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="impowerroleuser = false;$refs.editform.resetFields()">取 消</el-button>
        <el-button type="primary" @click="grantSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加角色" :visible.sync="addimpowerroleuser" :closeOnClickModal='false'>
      <el-form ref="addimpowerrole" :model="addimpowerrole" :rules="rules">
        <el-form-item label="角色名称" prop="roleName" :label-width="'100px'">
          <el-input v-model="addimpowerrole.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="'100px'" prop="roleDesc">
          <el-input v-model="addimpowerrole.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addimpowerroleuser = false;$refs.addimpowerrole.resetFields()">取 消</el-button>
        <el-button type="primary" @click="addimpoweruser">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑角色" :visible.sync="editimpowerroleuser" :closeOnClickModal='false'>
      <el-form ref="editimpowerrole" :model="editimpowerrole" :rules="rules">
        <el-form-item label="角色名称" prop="roleName" :label-width="'100px'">
          <el-input v-model="editimpowerrole.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="'100px'" prop="roleDesc">
          <el-input v-model="editimpowerrole.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editimpowerroleuser = false;$refs.editimpowerrole.resetFields()">取 消</el-button>
        <el-button type="primary" @click="getedit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
 
<script>
import { roleuser } from "@/api/roles.js";
import { impowerroleuser1 } from "@/api/roles.js";
import { delroleuser } from "@/api/roles.js";
import { userpower } from "@/api/powers.js";
import { impowerroleadd } from "@/api/roles.js";
import { impowerroledel } from "@/api/roles.js";
import { impowerroleedit } from "@/api/roles.js";

export default {
  data() {
    return {
      roleuser: [],
      addimpowerroleuser: false,
      editimpowerroleuser: false,
      addimpowerrole: { roleName: "", roleDesc: "", id: "" },
      editimpowerrole: { roleName: "", roleDesc: "", id: "" },
      rightListByRole: [],
      impowerroleuser: false,
      data2: [],
      roleId1: "",
      defaultProps: {
        children: "children",
        label: "authName"
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" }
        ],
        roleDesc: [{ required: true, message: "请输入描述", trigger: "blur" }]
      }
    };
  },
  methods: {
    del(obj) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          impowerroledel(obj.id).then(res => {
            if (res.data.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.rolefn();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    getedit() {
      this.$refs.editimpowerrole.validate(valid => {
        if (valid) {
          impowerroleedit(this.editimpowerrole).then(res => {
            if (res.data.meta.status == 200) {
              this.editimpowerroleuser = false;
              this.$refs.editimpowerrole.resetFields();
              this.$message({
                type: "success",
                message: "编辑成功"
              });
              this.rolefn();
            }
          });
        }
      });
    },
    editrole(obj) {
      console.log(obj);
      this.editimpowerroleuser = true;
      this.editimpowerrole = obj;
    },
    addimpower() {
      this.addimpowerroleuser = true;
    },
    addimpoweruser() {
      var seft=this
      this.$refs.addimpowerrole.validate(valid => {
        if (valid) {
          impowerroleadd(this.addimpowerrole).then(res => {
            if (res.data.meta.status == 201) {
              this.addimpowerroleuser = false;
              this.$refs.addimpowerrole.resetFields();
              this.$message({
                type: "success",
                message: res.data.meta.msg
              });
              // this.rolefn();
              
            }
          });
        }
      });
    },
    grantSubmit() {
      var arr = this.$refs.tree.getCheckedNodes();

      var item = arr.map(value => {
        return value.id + "," + value.pid;
      });
      // console.log(item);
      var str = item.join(",");
      // console.log(str);
      var arr1 = str.split(",");
      // console.log(arr1);
      var arr2 = new Set(arr1);
      // console.log(arr2);
      var final = [...arr2];
      // console.log(typeof arr2);

      impowerroleuser1(this.roleId1, final.join(",")).then(res => {
        if (res.data.meta.status == 200) {
          this.impowerroleuser = false;
          this.$message({
            type: "success",
            message: res.data.meta.msg
          });
        }
      });
    },
    roleimpower(row) {
      this.impowerroleuser = true;
      // console.log(row);
      this.roleId1 = row.id;

      userpower("tree")
        .then(res => {
          this.data2 = res.data.data;
          // console.log(typeof this.data2);
          this.rightListByRole.length = 0;

          row.children.forEach(first => {
            if (first.children.length > 0) {
              // 遍历二级权限
              first.children.forEach(second => {
                if (second.children.length > 0) {
                  // 遍历三级权限
                  second.children.forEach(third => {
                    this.rightListByRole.push(third.id);
                  });
                }
              });
            }
          });
        })
        .catch();
    },
    delrole(roleId, rightId) {
      delroleuser(roleId.id, rightId)
        .then(res => {
          if (res.data.meta.status == 200) {
            this.$message({
              type: "success",
              message: res.data.meta.msg
            });
            roleId.children = res.data.data;
          } else {
            this.$message({
              message: res.data.meta.msg
            });
          }
        })
        .catch(() => {
          this.$message({
            message: res.data.meta.msg
          });
        });
    },
    rolefn() {
      roleuser()
        .then(res => {
          this.roleuser = res.data.data;
        })
        .catch();
    }
  },
  mounted() {
    this.rolefn();
  }
};
</script>

<style scoped>
.box {
  height: 300px;
  overflow: scroll;
}
/*  */
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
