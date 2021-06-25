<template>
  <div ref="editor" class="text-editor"></div>
</template>

<script>
import E from 'wangeditor'
import { uploadCourseImage } from '@/services/course.js'
export default {
  name: 'TextEditor',
  data () {
    return {
      editor: null,
      isLoaded: false
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor)
      editor.config.onchange = value => {
        this.$emit('input', value)
      }
      // 配置自定义上传图片功能
      editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseImage(fd)
        if (data.code === '000000') {
          insertImgFn(data.data.name)
        }
      }
      editor.create()
      editor.txt.html(this.value)
      this.editor = editor
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  watch: {
    value () {
      if (!this.isLoaded) {
        this.editor.txt.html(this.value)
        this.isLoaded = true
      }
    }
  }
}
</script>

<style>

</style>
