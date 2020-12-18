<template>
  <div>
    <el-table :data="theachers" stripe = "true" style="width: 100%;padding:15px" >
      <el-table-column type="index" width="50" align="center"/>
      <el-table-column prop="name" label="名称" width="130" align="center" />
      <el-table-column prop="level" label="头衔" width="150" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 1">高级讲师</el-tag>
          <el-tag v-else type="success">首席讲师</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="资历" align="center"/>
      <el-table-column prop="sort" label="排序" width="180" align="center"/>
      <el-table-column prop="joinDate" label="入住时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ parseDateFull(scope.row.joinDate) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageNum"
      :page-sizes="[1, 3, 5, 10]"
      :page-size="pageSize"
      :total="total"
      style="text-align:center;margin-top:30px"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
  </div>
</template>
<script>
import teacherApi from '@/api/teacher'

export default {
  data: function() {
    return {
      theachers: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      queryObj: null

    }
  },
  created() {
    this.getTeachersPage()
  },

  methods: {
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
      teacherApi.getTeachersPage(this.pageNum, this.pageSize, this.queryObj).then((response) => {
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
