import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) { // 定义Vue函数，开发者new Vue()时，才会执行_init()
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }

  // 开发者new Vue()时，才会执行
  // 里面做的操作：初始化生命周期、事件收集对象、渲染需要的一些属性、beforeCreate/created、状态(props,data,computed,watch)、provide/inject、执行挂载$mount
  this._init(options) 
}

// 外部导入这个文件时，会先执行一下代码
initMixin(Vue) // 初始化，给_init赋值一个初始化的函数
stateMixin(Vue) // 设置状态，在Vue.prototype上挂了$data,$props,$set,$delete,$watch实例API方法
eventsMixin(Vue) // 初始化事件，就是个发布订阅模式，在Vue.prototype上挂上$on,$once,$off,$emit 四个方法
lifecycleMixin(Vue) // 初始化一部分生命周期，在Vue.prototype上挂了_update,$forceUpdate,$destroy 三个方法
renderMixin(Vue) // 初始化渲染，安装渲染助手installRenderHelpers，挂载$nextTick, _render 两个方法

export default Vue
