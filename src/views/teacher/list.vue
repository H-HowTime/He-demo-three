<template>
  <div>
    <!-- 查询讲师列表的条件表单 -->
    <el-form :inline="true" :model="queryObj" class="demo-form-inline" style="padding-left:70px;padding-top:20px">
      <el-form-item >
        <el-input v-model="queryObj.name" placeholder="讲师" />
      </el-form-item>
      <el-form-item >
        <el-select v-model="queryObj.level" placeholder="请选择讲师头衔">
          <el-option label="首席讲师" value="2"/>
          <el-option label="高级讲师" value="1"/>
          <!-- <el-option label="菜鸟讲师" value="*"/> -->
        </el-select>
      </el-form-item>
      <el-form-item label="入驻时间">
        <span class="demonstration"/>
        <el-date-picker
          v-model="queryObj.joinDateBegin"
          type="date"
          placeholder="开始日期"/>
        <span class="demonstration">  --  </span>
        <el-date-picker
          v-model="queryObj.joinDateEnd"
          type="date"
          placeholder="结束日期"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTeachersPage">查询</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="theachers"
      stripe="true"
      style="width: 100%; padding-left: 15px;padding-right: 15px">
      <!-- <el-table-column type="index" width="50" align="center" /> -->
      <!-- 显示序号 -->
      <el-table-column type="index" width="50" align="center" >
        <template slot-scope="scope">
          {{ scope.$index + 1 + (pageNum-1)*pageSize }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="130" align="center" />
      <el-table-column prop="level" label="头衔" width="150" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 1" type="blue">高级讲师</el-tag>
          <el-tag v-else-if="scope.row.level === 2" type="success">首席讲师</el-tag>
          <el-tag v-else type="danger">菜鸟讲师</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="资历" align="center" />
      <el-table-column prop="sort" label="排序" width="180" align="center" />
      <el-table-column
        prop="joinDate"
        label="入驻时间"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span>{{ parseDateFull(scope.row.joinDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageNum"
      :page-sizes="[1, 3, 5, 10]"
      :page-size="pageSize"
      :total="total"
      style="text-align: center; margin-top: 30px"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import teacherApi from '@/api/teacher'
export default {
  data: function() {
    return {
      theachers: [],
      pageNum: 1,
      pageSize: 5,
      total: 0,
      queryObj: {}
    }
  },
  created() {
    this.getTeachersPage()
  },

  methods: {
    // 编辑
    handleEdit(ind, row) {
      // 跳转到form表单页面，同时将id携带过去
      this.$router.push('/teacher/update/' + row.id)
    },
    // 删除
    handleDelete(ind, row) {
      this.$confirm(`此操作将永久删除《${row.name}》, 是否继续?, 提示`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        teacherApi.deleteTeacherById(row.id).then(response => {
          this.$message.success(response.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 重制表单
    resetForm() {
      this.queryObj = {}
      this.getTeachersPage()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getTeachersPage()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getTeachersPage()
    },
    // 查询讲师分页数据
    getTeachersPage() {
      teacherApi
        .getTeachersPage(this.pageNum, this.pageSize, this.queryObj)
        .then((response) => {
          this.theachers = response.data.page.records
          this.total = response.data.page.total
        })
    },
    // 查询讲师列表
    // vue页面以后后通过映射引入交给main.js使用，main.js会将当前位置编写的js代码合并给vue对象
    getTeachers() {
      teacherApi.getTeacherList().then((response) => {
        this.theachers = response.data.items
      })
    },
    // 时间格式处理
    parseDateFull(time) {
      var x = new Date(time)
      var z = {
        y: x.getFullYear(),
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
      }
      if (z.M < 10) {
        z.M = '0' + z.M
      }
      if (z.d < 10) {
        z.d = '0' + z.d
      }
      if (z.h < 10) {
        z.h = '0' + z.h
      }
      if (z.m < 10) {
        z.m = '0' + z.m
      }
      return z.y + '-' + z.M + '-' + z.d + ' ' + z.h + ':' + z.m
    }
  }
}
</script>
