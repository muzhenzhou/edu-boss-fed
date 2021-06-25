<template>
  <div class="userlist">
    <el-card style="margin-bottom: 20px">
      <el-form :inline="true"
        :model="filterParams"
        class="demo-form-inline"
        ref="filter-form"
      >
        <el-form-item label="手机号">
          <el-input v-model="filterParams.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="filterParams.rangeDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table
      :data="tableData"
      style="width: 100%;">
        <el-table-column
          prop="id"
          label="用户ID"
          width="180">
        </el-table-column>
        <el-table-column
          label="头像"
          width="100">
          <template slot-scope="scope">
            <img width="30px" :src="scope.row.portrait || 'https://edu-lagou.oss-cn-beijing.aliyuncs.com/images/2020/07/10/15943594999396473.png'">
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column
          label="注册时间"
          width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | filterTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="ENABLE"
              inactive-value="DISABLE"
              @change="forbidUser(scope.row)"
            >
          </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
            type="text"
            @click="handleSelectRole(scope.row)"
            >分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%">
        <el-select v-model="roleAllId" multiple placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </span>
      </el-dialog>
    </el-card>
    <div class="block" style="float: right; padding: 30px 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="filterParams.currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="filterParams.size"
        layout="total, sizes, prev, pager, next, jumper"
        :disabled="loading"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getUserPages, forbidUser } from '@/services/user.js'
import { getAllRoles, allocateUserRoles, getUserId } from '@/services/role.js'
export default {
  name: 'UserList',
  created () {
    this.getUserPages()
  },
  data () {
    return {
      filterParams: {
        id: '',
        phone: '',
        currentPage: 1,
        // size: 100,
        startCreateTime: '',
        endCreateTime: '',
        rangeDate: []
      },
      loading: true,
      total: 0,
      tableData: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      dialogVisible: false,
      options: [],
      roleAllId: [],
      currentUserId: null
    }
  },
  methods: {
    // 每页显示条数变化时触发
    handleSizeChange (val) {
      this.filterParams.size = val
      this.filterParams.currentPage = 1
      this.getUserPages()
    },
    // 页号改变触发
    handleCurrentChange (val) {
      this.filterParams.currentPage = val
      this.getUserPages()
    },
    // 分页查询用户信息
    async getUserPages () {
      this.loading = true
      const { rangeDate } = this.filterParams
      if (rangeDate && rangeDate.length) {
        this.filterParams.startCreateTime = rangeDate[0]
        this.filterParams.endCreateTime = rangeDate[1]
      } else {
        this.filterParams.startCreateTime = ''
        this.filterParams.endCreateTime = ''
      }
      const { data } = await getUserPages(this.filterParams)
      if (data.code === '000000') {
        this.tableData = data.data.records
        this.total = data.data.total
        this.loading = false
      }
    },
    async forbidUser (user) {
      const { data } = await forbidUser(user.id)
      console.log(data)
    },
    handleQuery () {
      this.filterParams.currentPage = 1
      this.getUserPages()
    },
    handleReset () {
      this.$refs['filter-form'].resetFields()
      this.getUserPages()
    },
    async handleSelectRole (userData) {
      this.dialogVisible = true
      this.currentUserId = userData.id
      const { data } = await getAllRoles()
      if (data.code === '000000') {
        this.options = data.data
      }

      const { data: data2 } = await getUserId(userData.id)
      if (data2.code === '000000') {
        this.roleAllId = data2.data.map(item => item.id)
      }
    },
    async onSubmit () {
      const { data } = await allocateUserRoles({
        userId: this.currentUserId,
        roleIdList: this.roleAllId
      })
      if (data.code === '000000') {
        this.$message.success('分配角色提交成功')
        this.dialogVisible = false
      }
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

<style>

</style>
