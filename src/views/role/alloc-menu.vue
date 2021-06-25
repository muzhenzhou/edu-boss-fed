<template>
  <div class="alloc-menu">
    <el-card>
      <el-tree
        :data="menus"
        :props="defaultProps"
        :default-checked-keys="checkedKeys"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
      ></el-tree>
      <div style="margin: 20px">
        <el-button
          @click="onReset"
        >清空</el-button>
        <el-button
          type="primary"
          @click="onSave"
        >保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu.js'
export default {
  name: 'AllocMenu',
  created () {
    // 获取所有菜单项
    this.loadMenus()
    // 获取已选中的菜单项
    this.loadRoleMenus()
  },
  data () {
    return {
      menus: [],
      checkedKeys: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      }
    }
  },
  methods: {
    onReset () {
      this.$refs.tree.setCheckedKeys([])
    },
    async loadMenus () {
      const { data } = await getMenuNodeList()
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    async onSave () {
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList: this.$refs.tree.getCheckedKeys()
      })
      if (data.code === '000000') {
        this.$router.push('/role')
        this.$message.success('分配菜单成功')
      }
    },
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      if (data.code === '000000') {
        this.getCheckedKeys(data.data)
      }
    },
    // 封装遍历树结构方法
    getCheckedKeys (menus) {
      if (!menus) {
        return
      }
      menus.forEach(menu => {
        // 如果父节点未选中，直接返回，不进行子节点遍历
        if (!menu.selected) {
          return
        }
        // 如果当前节点存在子节点，则用递归继续遍历子节点数组
        if (menu.subMenuList) {
          return this.getCheckedKeys(menu.subMenuList)
        }
        // this.defaultcheckedkeys.push(menu.id)
        this.checkedKeys = [...this.checkedKeys, menu.id]
        // console.log(this.defaultcheckedkeys)
      })
    }
  },
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
