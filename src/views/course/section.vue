<template>
  <div class="course-section">
    <el-tree
      v-loading="isLoading"
      :data="sections"
      :props="defaultProps"
      draggable
      :allow-drop="handleAllowDrop"
      @node-drop="handleNodeDrop"
    >
      <div class="inner" slot-scope="{ node, data }">
        <!-- 设置内容 -->
        <span>{{ node.label }}</span>
        <span v-if="data.sectionName" class="actions">
          <el-button>编辑</el-button>
          <el-button>添加课时</el-button>
          <el-button>状态</el-button>
        </span>
        <span v-else class="actions">
          <el-button>编辑</el-button>
          <el-button
            @click="$router.push({
              name: 'course-video',
              params: {
                courseId
              },
              query: {
                lessonId: data.id
              }
            })"
          >上传视频</el-button>
          <el-button>状态</el-button>
        </span>
      </div>
    </el-tree>
  </div>
</template>

<script>
import { getSectionAndLesson, saveOrUpdateSection, saveOrUpdateLesson } from '@/services/course-section.js'
export default {
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  created () {
    this.loadSection()
  },
  methods: {
    async handleNodeDrop (draggingNode, dropNode, type, event) {
      this.isLoading = true
      try {
        await Promise.all(dropNode.parent.childNodes.map((item, index) => {
          if (draggingNode.data.lessonDTOS) {
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index
            })
          } else {
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index
            })
          }
        }))
        this.$message.success('数据更新成功')
      } catch (err) {
        this.$message.success('数据更新失败', err)
      }
      this.isLoading = false
    },
    async loadSection () {
      const { data } = await getSectionAndLesson(this.courseId)
      if (data.code === '000000') {
        this.sections = data.data
      }
    },
    handleAllowDrop (draggingNode, dropNode, type) {
      return type !== 'inner' && draggingNode.data.sectionId === dropNode.data.sectionId
    }
  },
  data () {
    return {
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data) {
          return data.sectionName || data.theme
        }
      },
      isLoading: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .inner {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ebeef5;
  }
  ::v-deep .el-tree-node__content {
    height: auto;
  }
</style>
