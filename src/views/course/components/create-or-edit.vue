<template>
  <div class="course-create">
    <el-card>
      <!-- 设置 slot 后 element 会自动设置为上下两部分的布局样式（具有分割线） -->
      <div slot="header">
        <el-steps :active="activeStep" simple>
          <el-step
            v-for="(item, i) in steps"
            :key="item.id"
            :title="item.title"
            :icon="item.icon"
            @click.native="activeStep = i"
          ></el-step>
        </el-steps>
      </div>
      <!-- 步骤容器 -->
      <el-form>
        <!-- 基本信息 -->
        <div v-show="activeStep === 0">
          <el-form-item label="课程名称">
            <el-input v-model="course.courseName"></el-input>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input v-model="course.brief"></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input
              v-model="course.previewFirstField"
              placeholder="概述1"
              style="width: 45%; min-width: 300px; margin-right: 15px;"
            >
              <template slot="append">{{ course.previewFirstField.length }}/20</template>
            </el-input>
            <el-input
              v-model="course.previewSecondField"
              placeholder="概述2"
              style="width: 45%; min-width: 300px; margin-right: 15px;"
            >
              <template slot="append">{{ course.previewSecondField.length }}/20</template>
            </el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="course.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="course.teacherDTO.description"></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number
              v-model="course.sortNum"
              label="描述文字"
              controls-position="right"
            ></el-input-number>
          </el-form-item>
        </div>
        <div v-show="activeStep === 1">
          <!-- 课程封面图上传 -->
          <course-image
            v-model="course.courseListImg"
            label="课程封面"
            :limit="2"
          ></course-image>
          <!-- 解锁封面图上传 -->
          <course-image
            v-model="course.courseImgUrl"
            label="解锁封面"
            :limit="5"
          ></course-image>
        </div>
        <!-- 销售信息 -->
        <div v-show="activeStep === 2">
          <el-form-item label="售卖价格">
            <el-input
              type="number"
              v-model="course.discounts"
              :min="0"
          >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input
              type="number"
              v-model="course.price"
              :min="0"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input
              type="number"
              v-model="course.sales"
              :min="0"
            >
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input
              v-model="course.discountsTag"
            >
            </el-input>
          </el-form-item>
        </div>
        <!-- 秒杀活动 -->
        <div v-show="activeStep === 3">
          <el-form-item label="限时秒杀开关" label-width="120px">
            <el-switch
              v-model="course.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
            <template v-if="course.activityCourse">
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="course.activityCourseDTO.beginTime"
                  type="datetime"
                  placeholder="选择开始时间"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="course.activityCourseDTO.endTime"
                  type="datetime"
                  placeholder="选择开始时间"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="秒杀价">
                <el-input
                  v-model="course.activityCourseDTO.amount"
                  type="number"
                  :min="0"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="秒杀库存">
                <el-input
                  v-model="course.activityCourseDTO.stock"
                  type="number"
                  :min="0"
                >
                  <template slot="append">个</template>
                </el-input>
              </el-form-item>
            </template>
          </el-form-item>
        </div>
        <!-- 课程详情 -->
        <div v-show="activeStep === 4">
          <el-form-item label="课程详情">
            <text-editor v-model="course.courseDescriptionMarkDown"></text-editor>
          </el-form-item>
          <el-form-item label="是否上架">
            <el-switch
              v-model="course.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="handleSave"
            >保存</el-button>
          </el-form-item>
        </div>
        <el-form-item v-if="activeStep !== steps.length - 1">
          <el-button @click="activeStep++">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { saveOrUpdateCourse, getCourseById } from '@/services/course.js'
import CourseImage from './courseImage.vue'
import TextEditor from '@/components/TextEditor/index.vue'
export default {
  name: 'CourseCreate',
  created () {
    if (this.isEdit) {
      this.loadCourse()
    }
  },
  methods: {
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      if (data.code === '000000') {
        if (!data.data.activityCourse) {
          data.data.activityCourseDTO = {
            beginTime: '',
            endTime: '',
            amount: 0,
            stock: 0
          }
        }
        this.course = data.data
      }
    },
    async handleSave () {
      const { data } = await saveOrUpdateCourse(this.course)
      if (data.code === '000000') {
        this.$router.push({ name: 'course' })
        this.$message.success(`${this.isEdit ? '编辑' : '添加'}课程成功`)
      }
    }
  },
  data () {
    return {
      // 步骤条进度
      activeStep: 0,
      steps: [
        { id: 1, title: '基本信息', icon: 'el-icon-edit' },
        { id: 2, title: '课程封面', icon: 'el-icon-upload' },
        { id: 3, title: '销售信息', icon: 'el-icon-picture' },
        { id: 4, title: '秒杀信息', icon: 'el-icon-picture' },
        { id: 5, title: '课程详情', icon: 'el-icon-picture' }
      ],
      imageUrl: '',
      // 保存课程信息
      course: {
        // id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        // 课程详情
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0,
        sales: 0,
        activityCourse: false,
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [String, Number]
    }
  },
  components: {
    CourseImage, TextEditor
  }
}
</script>

<style lang="scss" scoped>
  .el-step {
    cursor: pointer
  }
</style>
