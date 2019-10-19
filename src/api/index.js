// index.js
import ajax from '@/utils/ajax.js'
export default {
  // 请求首页
  getHome: (options = {}) => ajax.post('/api/home', options)
}