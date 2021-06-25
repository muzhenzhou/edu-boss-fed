<template>
  <div class="login">
    <header>
      <h1>Edu boss管理系统</h1>
    </header>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="top"
    >
      <h2>登录</h2>
      <el-form-item
        label="手机号"
        prop="phone"
      >
        <el-input v-model="form.phone"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
          :loading="isLoginLoading"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

// 引入封装的接口功能组件
// import request from '@/utils/request.js'
// import qs from 'qs'
import { login } from '@/services/user.js'

export default {
  name: 'LoginIndex',
  data () {
    return {
      // 存储表单数据的对象
      form: {
        phone: '18201288771',
        password: '111111'
      },
      // 用于设置表单校验规则
      rules: {
        phone: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码必填', trigger: 'blur' },
          { min: 6, max: 18, message: '请输入6-18位由数字或字母组成的密码', trigger: 'blur' }
        ]
      },
      isLoginLoading: false
    }
  },
  methods: {
    // 登录功能
    async onSubmit () {
      // this.$store.commit('jia', 5)
      try {
        // 1.设置校验
        await this.$refs.form.validate()
        this.isLoginLoading = true
        // 2.发送请求
        // const { data } = await request({
        //   method: 'POST',
        //   url: '/front/user/login',
        //   // urlencoded 格式： 名=值&名=值
        //   data: qs.stringify(this.form)
        // })
        const { data } = await login(this.form)

        this.isLoginLoading = false
        // 3.响应处理
        if (data.state === 1) {
          this.$message.success('登录成功')
          // 将用户信息存储到 Vuex 中
          this.$store.commit('setUser', data.content)
          // 根据可能存在的 redirect 数据进行跳转设置
          this.$router.push(this.$route.query.redirect || '/')
        } else {
          this.$message.error(data.message)
        }
      } catch (err) {
        console.log('校验错误')
      }
    }
  }
}

</script>

<style lang="scss" scoped>
  .login {
    h1 {
      text-align: center;
      padding: 50px;
    }

    height: 100vh;
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;

    .el-form {
      h2 {
        font-weight: normal;
      }

      width: 300px;
      padding: 20px;
      border-radius: 10px;
      background-color: #fff;

      .el-button {
        width: 100%;
      }
    }
  }

</style>
