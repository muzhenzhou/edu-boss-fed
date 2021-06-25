<template>
  <div class="course-image">
    <el-form-item :label="label">
      <!-- 进度条 -->
      <el-progress
        v-if="isUploading"
        type="circle"
        :percentage="precentage"
        :width="178"
        :status="precentage === 100 ? 'success' : undefined"
      ></el-progress>
      <!-- 自定义上传 -->
      <el-upload
        v-else
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :http-request="handleUpload"
      >
        <!-- 图片预览 -->
        <img v-if="value" :src="value" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script>
// 引入上传图片接口
import { uploadCourseImage } from '@/services/course.js'

export default {
  name: 'CourseImage',
  data () {
    return {
      // 保存下载状态
      isUploading: false,
      precentage: 0
    }
  },
  props: {
    value: {
      type: String
    },
    label: {
      type: String
    },
    // 限制文件大小
    limit: {
      type: Number,
      default: 2
    }
  },
  methods: {
    // 自定义文件上传
    async handleUpload (option) {
      this.isUploading = true
      const fd = new FormData()
      fd.append('file', option.file)
      const { data } = await uploadCourseImage(fd, (event) => {
        this.precentage = Math.floor(event.loaded / event.total * 100)
      })
      if (data.code === '000000') {
        // this.course.courseListImg = data.data.name
        this.$emit('input', data.data.name)
        this.$message.success('上传成功')
        this.isUploading = false
        this.precentage = 0
      }
    },
    // 文件上传成功时的钩子
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 上传文件之前的回调
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < this.limit
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  :v-deep .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
