/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
class Store {
  state = {}

  constructor(options = {}) {
    this.state = options.state
    this.options = options
    const store = this
    store._vm = new Vue({
      name: 'DemoVuex',
      data: {
        $$state: options.state
      }
    })
  }

  install(vm) {
    console.log('alan->use store', vm)
    this.applyMixin(vm)
  }

  applyMixin(Vue) {
    const _init = Vue.prototype._init
    function vuexInit() {
      const options = this.$options
      if(options.store) {
        this.$store = options.store
      } else if(options.parent && options.parent.$store) {
        this.$store = options.parent.$store
      }
    }
    Vue.prototype._init = function(options = {}) {
      Vue.mixin({ beforeCreate: vuexInit })
      _init.call(this, options)
    }
  }

  commit(handler, payload) {
    const {mutations = {}} = this.options
    mutations[handler].call(this, this.state, payload)
  }

  dispatch(action, payload) {
    return new Promise((resolve) => {
      const {actions = {}} = this.options
      resolve(actions[action].call(this, this, payload))
    })
  }
}


