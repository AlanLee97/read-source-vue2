/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-debugger */

const storeConfig = {
  state: {
    hello: '111222'
  },
  mutations: {
    changeHello(state, newVal) {
      state.hello = newVal
    }
  },
  actions: {
    updateHello(ctx, payload) {
      ctx.commit('changeHello', payload)
    }
  }
}

const store = new Store(storeConfig)

// eslint-disable-next-line no-undef
Vue.use(store)

// app Vue instance
var app = new Vue({
  name: 'SimpleDemo_Vuex',
  store,
  data() {
    return {

    }
  },
  computed: {
    // hello() {
    //   return this.$store.state.hello
    // }
  },
  methods: {
    changeHello() {
      // this.$store.commit('changeHello', Math.random())
      this.$store.dispatch('updateHello', Math.random())
    }
  }
})

debugger
// mount
app.$mount('#app')

console.log('alan-> app', app)
window.appVue = app
