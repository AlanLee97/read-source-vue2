import Vue from './instance/index' // 导入Vue，会先执行这个脚本中的代码
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'

// 再初始化全局API
// 这里会给Vue构造器函数上挂上一些公有API，挂载的有util,set,del,nextTick,observable,options，
// 还让options.component继承了内置组件builtInComponents——KeepAlive
// 还做了一些初始化initUse,initMixin,initExtend,initAssetRegisters
initGlobalAPI(Vue)

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
})

Vue.version = '__VERSION__'

export default Vue
