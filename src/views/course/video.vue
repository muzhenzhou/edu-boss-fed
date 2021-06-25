<template>
  <div class="course-video">
    <el-card>
      <div slot="header">
        课程相关信息
      </div>
      <el-form>
        <el-form-item label="视频上传">
          <input type="file" ref="video-file">
        </el-form-item>
        <el-form-item label="封面上传">
          <input type="file" ref="image-file">
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleUpload"
          >开始上传</el-button>
          <el-button @click="$router.push({
            name: 'course',
            params: {
              courseId
            }
          })">返回</el-button>
        </el-form-item>
        <el-form-item>
          <p v-if="uploadPercent !== 0">视频上传中: {{ uploadPercent }}%</p>
          <p v-if="isUploadSuccess">视频转码中: {{ isTranscodeSuccess ? '完成' : '正在转码，请稍后...' }}</p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
/*eslint-disable */
import {
  aliyunImageUploadAddressAndAuth,
  aliyunVideoUploadAddressAndAuth,
  aliyunTranscode,
  aliyunTranscodePercent
} from '@/services/aliyun-upload.js'
export default {
  name: 'CourseVideo',
  data () {
    return {
      imageURL: '',
      uploader: null,
      videoId: null,
      uploadPercent: 0,
      isUploadSuccess: false,
      isTranscodeSuccess: false
    }
  },
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    handleUpload () {
      this.isTranscodeSuccess = false
      this.isUploadSuccess = false
      this.uploadPercent = 0
      // 获取上传的文件(视频、图片)
      const videoFile = this.$refs['video-file'].files[0]
      const imageFile = this.$refs['image-file'].files[0]
      const uploader = this.uploader
      uploader.addFile(videoFile)
      uploader.addFile(imageFile)
      uploader.startUpload()
    },
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        //  阿里账号ID，必须有值
        userId: '1618139964448548',
        //  分片大小默认1 MB，不能小于100 KB
        partSize: 1048576,
        //  并行上传分片个数，默认5
        parallel: 5,
        //  网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        //  网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        //  是否上报上传日志到视频点播，默认为true
        enableUploadProgress: true,
        //  开始上传
        onUploadstarted: async uploadInfo => {
          // 上传凭证存储变量
          let uploadAddressAndAuth = null
          // 检测上传文件是图片还是视频
          if (uploadInfo.isImage) {
            const { data } = await aliyunImageUploadAddressAndAuth()
            if (data.code === '000000') {
              uploadAddressAndAuth = data.data
              this.imageURL = uploadAddressAndAuth.imageURL
            }
          } else {
            const { data } = await aliyunVideoUploadAddressAndAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageURL
            })
            if (data.code === '000000') {
              uploadAddressAndAuth = data.data
              this.videoId = data.data.videoId
            }
          }
          // 设置凭证
          this.uploader.setUploadAuthAndAddress(uploadInfo, uploadAddressAndAuth.uploadAuth, uploadAddressAndAuth.uploadAddress, uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId)
        },
        //  文件上传成功
        onUploadSucceed: function (uploadInfo) {
          console.log('onUploadSucceed: ' + uploadInfo.file.name + ', endpoint:' + uploadInfo.endpoint + ', bucket:' + uploadInfo.bucket + ', object:' + uploadInfo.object)
        },
        //  文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
          console.log('onUploadFailed: file:' + uploadInfo.file.name + ',code:' + code + ', message:' + message)
        },
        //  文件上传进度，单位：字节
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          console.log('onUploadProgress:file:' + uploadInfo.file.name + ', fileSize:' + totalSize + ', percent:' + Math.ceil(loadedPercent * 100) + '%')
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        //  上传凭证超时
        onUploadTokenExpired: function (uploadInfo) {
          console.log('onUploadTokenExpired')
          //  实现时，根据uploadInfo.videoId调用刷新视频上传凭证接口重新获取UploadAuth
          //  从点播服务刷新的uploadAuth，设置到SDK里

          // uploader.resumeUploadWithAuth(uploadAuth)
        },
        //  全部文件上传结束
        onUploadEnd: async uploadInfo => {
          this.isUploadSuccess = true
          const { data } = await aliyunTranscode({
            lessonId: this.$route.query.lessonId,
            coverImageUrl: this.imageURL,
            fileName: this.$refs['video-file'].files[0].name,
            fileId: this.videoId
          })
          if (data.code === '000000') {
            const timer = setInterval(async () => {
              const { data } = await aliyunTranscodePercent(this.$route.query.lessonId)
              console.log(data)
              if (data === 100) {
                clearInterval(timer)
                this.$message.success('转码成功')
                this.isTranscodeSuccess = true
              }
            }, 1000)
          }
        }
      })
    }
  }
}
</script>

<style>

</style>
