<template>
  <div class="create-or-edit">
      <el-form ref="role" :model="role" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="role.name"></el-input>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="role.code"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="role.description"></el-input>
        </el-form-item>
      </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </div>
</template>

<script>
import { saveOrUpdate, getEditRoles } from '@/services/role.js'
export default {
  name: 'CreateOrEdit',
  created () {
    if (this.isEdit) {
      this.getEditRoles()
    }
  },
  data () {
    return {
      role: {
        name: '',
        cede: '',
        description: ''
      }
    }
  },
  props: {
    roleId: {
      type: [Number, String]
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 点击确定时触发
    async onSubmit () {
      const { data } = await saveOrUpdate(this.role)
      if (data.code === '000000') {
        this.$emit('success')
        this.$message.success('添加成功')
        this.role = {}
      }
    },
    // 获取角色请求
    async getEditRoles () {
      const { data } = await getEditRoles(this.roleId)
      if (data.code === '000000') {
        this.role = data.data
      }
    },
    // 点击取消时触发
    onCancel () {
      this.$message('已取消')
      this.$emit('cancel')
      this.role = {}
    }
  }
}
</script>

<style>

</style>
