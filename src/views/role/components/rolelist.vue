<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="display: block; font-size: 18px; margin-bottom: 20px">筛选搜索</span>
        <el-form class="roleSearch" ref="form" :model="form" label-width="80px" v-loading="loading">
          <el-form-item label="输入搜索" prop='name'>
            <el-input
              v-model="form.name"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="onReset">重置</el-button>
            <el-button type="primary" @click="onSubmit">查询搜索</el-button>
          </el-form-item>
         </el-form>
      </div>
      <el-button v-loading="loading" @click="onAddRole">添加角色</el-button>
      <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <create-or-edit
        v-if="dialogVisible"
        :is-edit="isEdit"
        @success="onSubmit"
        @cancel="onCancel"
        :role-id="roleId"
      ></create-or-edit>
      </el-dialog>
      <div>
        <el-table
          :data="roles"
          border
          style="width: 100%; border-top: 1px solid #EBEEF5; margin-top: 20px;"
          v-loading="loading"
        >
          <el-table-column
            prop="id"
            label="编号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="角色名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="description"
            label="描述">
          </el-table-column>
          <el-table-column
            label="添加时间">
            <template slot-scope="scope">
              <span>{{ scope.row.createdTime | filterTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div class="opration">
                <el-button
                  type="text"
                  @click="$router.push({
                    name: 'alloc-menu',
                    params: {
                      roleId: scope.row.id
                    }
                  })"
                >分配菜单</el-button>
                <el-button type="text">分配资源</el-button>
              </div>
              <div class="opration">
                <el-button type="text" @click="onEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="onDelete(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getRolePages, deleteRoles } from '@/services/role.js'
import CreateOrEdit from './createoredit.vue'
export default {
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      form: {
        name: ''
      },
      loading: false,
      dialogVisible: false,
      isEdit: false,
      roleId: '',
      roles: []
    }
  },
  created () {
    this.getRolePages()
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    onSubmit () {
      this.dialogVisible = false
      this.getRolePages()
    },
    onCancel () {
      this.dialogVisible = false
    },
    onAddRole () {
      this.dialogVisible = true
      this.isEdit = false
    },
    onEdit (role) {
      this.dialogVisible = true
      this.isEdit = true
      this.roleId = role.id
    },
    // 请求角色列表数据
    async getRolePages () {
      this.loading = true
      const { data } = await getRolePages(this.form)
      if (data.code === '000000') {
        this.roles = data.data.records
        this.loading = false
      }
    },
    onReset () {
      this.$refs.form.resetFields()
    },
    onDelete (role) {
      this.$confirm('是否确定当前角色删除?', '角色删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data } = await deleteRoles(role.id)
          if (data.code === '000000') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getRolePages()
          }
        })
        .catch(() => {
          this.$message.info('取消删除')
        })
    }
  },
  filters: {
    filterTime (date) {
      date = new Date(date)
      return `
      ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 
      ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}
      : ${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}
      : ${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}
      `
    }
  }
}
</script>

<style lang="scss" scoped>
  .roleSearch {
    display: flex;
    justify-content: space-between;
  }
  .opration {
      width: 150px;
      display: flex;
      justify-content: space-between;
  }
</style>
