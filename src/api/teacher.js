// 引入axios对象实例
import request from '@/utils/request'

// 封装讲师管理接口掉用的方法
export default {
  // 1、查询所有讲师
  getTeacherList() {
    return request({
      url: '/admin/edu/teacher/list',
      method: 'get'
    })
  },
  // 2、查询讲师分页数据
  getTeachersPage(pageNum, pageSize, queryObj) {
    return request({
      url: `/admin/edu/teacher/page/${pageNum}/${pageSize}`,
      method: 'get',
      // axios会自动将params参数以k=v的方式拼接到URL后提交
      params: queryObj // 请求参数方式提交数据，queryObj代表后台接收讲师查询条件对象，属性名要和查询条件的属性一样
    })
  },
  // 3、删除一名讲师
  deleteTeacherById(tid) {
    return request({
      url: `/admin/edu/teacher/remove/${tid}`,
      method: 'delete'
    })
  },
  // 4、增加一名讲师
  saveTeacher(teacher) {
    return request({
      url: '/admin/edu/teacher/add',
      method: 'post',
      // axios发送json字符串给后端
      data: teacher // data传送json类型
    })
  },
  // 5、根据id查询一名讲师
  getTeacherById(tid) {
    return request({
      url: `/admin/edu/teacher/get/${tid}`,
      method: 'get'
    })
  },
  // 6、更新一名讲师数据
  updateTeacher(teacher) {
    return request({
      url: '/admin/edu/teacher/update',
      method: 'post',
      // axios发送json字符串给后端
      data: teacher // data传送json类型
    })
  }
}
