// 主页
const bpmn = () => import('@/views/bpmn')



export default [
  {
    path: '/',
    redirect: {
      path: '/bpmn'
    }
  },
  {
    path: '/bpmn',
    name: 'bpmn',
    component: bpmn
  }
]
