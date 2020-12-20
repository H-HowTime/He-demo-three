<template>
  <div class="app-container">
    <el-form
      ref="teacher"
      :model="teacher"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="讲师姓名" prop="name" style="width: 20%">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="0" />
      </el-form-item>
      <el-form-item label="讲师头衔" prop="level">
        <el-select v-model="teacher.level" placeholder="请选择讲师头衔">
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="入驻时间" required>
        <el-date-picker v-model="teacher.joinDate" value-format="yyyy-MM-dd" />
      </el-form-item>
      <!-- 用户头像上传 -->
      <el-form-item label="头像上传">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          class="avatar-uploader"
          action="http://localhost:8120/admin/oss/file/upload?module=teacher"
        >
          <img v-if="teacher.avatar" :src="teacher.avatar" class="avatar" >
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" />
      </el-form-item>
      <el-form-item label="讲师资历" prop="career">
        <el-input v-model="teacher.career" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('teacher')"
        >立即提交</el-button
        >
        <el-button @click="resetForm('teacher')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
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
<script>
import teacherApi from '@/api/teacher'
export default {
  data() {
    return {
      // 初始化讲师
      teacher: {
        sort: 0,
        level: '1',
        avatar: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入讲师姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择讲师头衔', trigger: 'change' }
        ],
        joinDate: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        career: [
          { required: true, message: '请填写讲师资历', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 获取id
    const id = this.$route.params.id
    if (id) {
      this.showTeacherById(id)
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert(this.teacher)
          // 验证成功，发送请求添加或者更新讲师
          if (this.teacher.id) {
            this.updateTeacher()
          } else {
            this.addTeacher()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 回显讲师数据
    showTeacherById(id) {
      teacherApi.getTeacherById(id).then((response) => {
        this.teacher = response.data.vo
        // gmtCreate时间会被改掉，因为在yml配置文件中配置了
        // jackson: #JSON格式化时间日期格式设置，当后端向前端传递json时间类型时，前端显示的数据格式
        // time-zone: GMT+8 #东八区
        // date-format: yyyy-MM-dd  #HH:mm:ss
        // 下面更新时也只会传回这个格式yyyy-MM-dd的时间 ，两种解决方式，1、在后端定义前端需要数据的封装vo类 2、前端只接受需要的数据
        // this.teacher.name = response.data.item.name
        // this.teacher.level = response.data.item.level
        // this.teacher.sort = response.data.item.sort
        // this.teacher.joinDate = response.data.item.joinDate
        // this.teacher.career = response.data.item.career
        // this.teacher.intro = response.data.item.intro
        // this.teacher.id = response.data.item.id   验证无法通过？？？
      })
    },
    // 添加一名讲师
    addTeacher() {
      teacherApi.saveTeacher(this.teacher).then((response) => {
        this.$message.success(response.message)
        // 新增成功跳转回讲师列表页面
        // this.$router 获取vueRouter对象（包含多个router的映射）
        // this.$route 获取当前vue页面所在的路由对象
        this.$router.push('/teacher/list')
      })
    },
    // 更新一名讲师
    updateTeacher() {
      teacherApi.updateTeacher(this.teacher).then((response) => {
        // 更改成功跳转回讲师列表页面
        // this.$router 获取vueRouter对象（包含多个router的映射）
        // this.$route 获取当前vue页面所在的路由对象
        this.$router.push('/teacher/list')
      })
    },
    // 文件上传成功回调函数
    handleAvatarSuccess(res, file) {
      console.log(res)
      this.teacher.avatar = res.data.path
      // 强制重新渲染
      this.$forceUpdate()
    },
    // 文件上传校验
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

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

