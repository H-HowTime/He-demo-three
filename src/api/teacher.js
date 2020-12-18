// 引入axios对象实例
import request from '@/utils/request'

// 封装讲师管理接口掉用的方法
export default {
  // 查询所有讲师
  getTeacherList() {
    return request({
      url: '/admin/edu/teacher/list',
      method: 'get'
    })
  },
  // 查询讲师分页数据
  getTeachersPage(pageNum, pageSize, queryObj) {
    return request({
      url: `/admin/edu/teacher//page/${pageNum}/${pageSize}`,
      method: 'get',
      // axios会自动将params参数以k=v的方式拼接到URL后提交
      params: queryObj // 请求参数方式提交数据，queryObj代表后台接收讲师查询条件对象，属性名要和查询条件的属性一样
    })
  }
}
