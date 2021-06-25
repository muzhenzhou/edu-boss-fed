<template>
  <div class="course-list">
    <el-card>
      <el-form
        :inline="true"
        ref="form"
        label-position="left"
        :model="filterParams"
        class="demo-form-inline"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="filterParams.courseName"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="filterParams.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="isLoading"
            @click="handleFilter"
          >查询</el-button>
          <el-button
            :disabled="isLoading"
            type="primary"
            style="margin-left: 450px"
            @click="$router.push({
              name: 'course-create'
            })"
          >新建课程</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-table
        :data="courses"
        v-loading="isLoading"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="status"
          label="上架状态"
        >
            <template slot-scope="scope">
              <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="onStateChange(scope.row)"
              :disabled="scope.row.isStatusLoading"
              >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="操作"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="$router.push({
                name: 'course-edit',
                params: {
                  courseId: scope.row.id
                }
              })"
            >编辑</el-button>
            <el-button
            @click="$router.push({
              name: 'course-section',
              params: {
                courseId: scope.row.id
              }
            })"
          >内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="filterParams.currentPage"
        layout="prev, pager, next"
        :total="totalCount"
        :disabled="isLoading"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getQueryCourses, changeState } from '@/services/course.js'
export default {
  name: 'CourseList',
  data () {
    return {
      // 筛选功能参数（表单数据）
      filterParams: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        status: ''
      },
      // 加载状态
      isLoading: false,
      // 课程信息
      courses: [],
      // 数据总条数
      totalCount: 0
    }
  },
  created () {
    this.loadCourses()
  },
  methods: {
    // 上下架按钮
    async onStateChange (course) {
      // 请求发送触发时，禁用按钮
      course.isStatusLoading = true
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      if (data.code === '000000') {
        this.$message.success(`${course.status === 1 ? '上架' : '下架'}成功`)
        // 请求完毕，还原按钮
        course.isStatusLoading = false
      }
    },
    async loadCourses () {
      this.isLoading = true
      const { data } = await getQueryCourses(this.filterParams)
      if (data.state === 1) {
        // 增加请求状态属性，设置给按钮
        data.content.records.forEach(item => {
          item.isStatusLoading = false
        })
        this.courses = data.content.records
        this.totalCount = data.content.total
        this.isLoading = false
      }
    },
    onSubmit () {
      console.log('submit!')
    },
    // 筛选操作
    handleFilter () {
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    // 重置操作
    handleReset () {
      this.refs.form.resetFields()
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    // 分页页码点击操作
    handleCurrentChange (val) {
      this.filterParams.currentPage = val
      this.loadCourses()
    }
  }
}
</script>

<style>

</style>
