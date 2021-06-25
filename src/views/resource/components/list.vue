<template>
  <div class="resource-list">
    <div slot="header" class="clearfix">
      <el-form :inline="true" :model="form" class="demo-form-inline" ref="form">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="form.name" placeholder="资源名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="资源路径" prop="url">
          <el-input v-model="form.url" placeholder="资源路径" clearable></el-input>
        </el-form-item>
        <el-form-item label="资源分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="资源分类" clearable>
            <el-option
              v-for="item in resourceCategories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="onReset" :disabled="loading">重置</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="loading">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="resourceData"
      style="width: 100%; margin-bottom: 20px"
      v-loading="loading"
    >
      <el-table-column
        label="编号"
        type="index">
      </el-table-column>
      <el-table-column
        prop="name"
        label="资源名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="url"
        label="资源路径"
        width="180">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        width="180">
      </el-table-column>
      <el-table-column
        prop="url"
        label="地址">
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
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.current"
        :page-sizes="[10, 20, 30]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :disabled="loading"
        :total="total">
      </el-pagination>
  </div>
  </div>
</template>

<script>
import { getResourcePages, getResourceCategories } from '@/services/resource.js'
export default {
  name: 'ResourceList',
  data () {
    return {
      form: {
        user: '',
        id: '',
        name: '',
        url: '',
        categoryId: ''
      },
      total: 0,
      resourceData: [],
      resourceCategories: [],
      loading: false
    }
  },
  created () {
    this.getResourcePages()
    this.getResourceCategories()
  },
  methods: {
    // 每页显示条数变化时触发
    handleSizeChange (val) {
      this.form.size = val
      this.form.current = 1
      this.getResourcePages()
    },
    // 页号改变触发
    handleCurrentChange (val) {
      this.form.current = val
      this.getResourcePages()
    },
    onSubmit () {
      this.form.current = 1
      this.getResourcePages()
    },
    // 重置表单内容
    onReset () {
      this.$refs.form.resetFields()
    },
    async getResourcePages () {
      // 发送请求后禁用
      this.loading = true
      const { data } = await getResourcePages(this.form)
      if (data.code === '000000') {
        this.resourceData = data.data.records
        this.total = data.data.total
        this.loading = false
      }
    },
    async getResourceCategories () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    handleEdit (rowData) {
      console.log(rowData)
    },
    handleDelete (rowData) {
      console.log(rowData)
    }
  },
  filters: {
    filterTime (date) {
      date = new Date(date)
      return `
      ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 
      ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
      `
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
