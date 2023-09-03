/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
class Store {
  state = {}

  constructor(options = {}) {
    this.state = options.state
    this.options = options
    const store = this
    // 实现state的响应式
    store._vm = new Vue({
      name: 'DemoVuex',
      data: {
        // 你只管放数据到dara，剩下的交给Vue
        $$state: options.state
      }
    })
  }

  install(vm) {
    this.applyMixin(vm)
  }

  applyMixin(Vue) {
    // 缓存一份原来的_init方法
    const _init = Vue.prototype._init

    // 定义vuex初始化方法
    function vuexInit() {
      const options = this.$options
      // 赋值store到$store
      if(options.store) {
        this.$store = options.store
      } else if(options.parent && options.parent.$store) {
        this.$store = options.parent.$store
      }
    }

    // 重新赋值_init
    Vue.prototype._init = function(options = {}) {
      // 混入vuexInit方法
      Vue.mixin({ beforeCreate: vuexInit })
      // 执行原来的_init方法
      _init.call(this, options)
    }
  }

  // commit接收两个参数，handler-定义的mutations的名字，payload-提交的数据
  commit(handler, payload) {
    // 取出mutations
    const {mutations = {}} = this.options
    // 执行取出mutations
    mutations[handler].call(this, this.state, payload)
  }

  // 实现思路跟commit一样，使用用Promise包裹了一下
  // 接收两个参数，action-定义的action的名字，payload-提交的数据
  dispatch(action, payload) {
    return new Promise((resolve) => {
      const {actions = {}} = this.options
      resolve(actions[action].call(this, this, payload))
    })
  }
}


