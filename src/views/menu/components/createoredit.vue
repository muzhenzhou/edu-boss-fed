<template>
  <div class="menu-create-or-edit">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑菜单' : '添加菜单'}}</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
  <el-form-item label="菜单名称">
    <el-input v-model="form.name"></el-input>
  </el-form-item>
  <el-form-item label="菜单路径">
    <el-input v-model="form.href"></el-input>
  </el-form-item>
  <el-form-item label="上级菜单">
    <el-select v-model="form.parentId" placeholder="请选择上级菜单">
      <el-option
        label="无上级菜单"
        :value="-1"
      ></el-option>
      <el-option
        v-for="item in parentMenuList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="描述">
    <el-input v-model="form.description"></el-input>
  </el-form-item>
  <el-form-item label="前端图标">
    <el-input v-model="form.icon"></el-input>
  </el-form-item>
  <el-form-item label="是否显示">
    <el-radio-group v-model="form.shown">
      <el-radio :label="true"></el-radio>
      <el-radio :label="false"></el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="排序">
    <el-input v-model="form.orderNum"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">提交</el-button>
    <el-button v-if="!isEdit">重置</el-button>
  </el-form-item>
</el-form>
    </el-card>
  </div>
</template>

<script>
import { getEditMenuInfo, saveOrUpdateMenu } from '@/services/menu'
export default {
  name: 'CreateOrEdit',
  // 传递给子组件的数据
  props: {
  // props 验证，default 用于给可选项指定默认值，当父组件未传递数据时生效
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        parentId: -1,
        name: '',
        href: '',
        icon: '',
        orderNum: 0,
        description: '',
        shown: true
      },
      // 存储上级菜单数据
      parentMenuList: []
    }
  },
  created () {
    // 加载上级菜单信息
    this.loadMenuInfo()
  },
  methods: {
    async onSubmit () {
      const { data } = await saveOrUpdateMenu(this.form)
      if (data.code === '000000') {
        this.$message.success('提交成功')
        this.$router.push({
          name: 'menu'
        })
      }
    },
    async loadMenuInfo () {
      // 检测是否存在路由参数 id，并进行对应处理
      const id = this.$route.params.id || -1
      // 请求菜单数据(上级菜单数据)
      const { data } = await getEditMenuInfo(id)
      if (data.code === '000000') {
        this.parentMenuList = data.data.parentMenuList
      }
      // 检测是否存在菜单数据 menuInfo，如果存在，更新给 form 即可
      if (data.data.menuInfo) {
        this.form = data.data.menuInfo
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
