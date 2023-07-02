/* eslint-disable no-undef */
/* eslint-disable no-debugger */

debugger

Vue.component('count-demo', {
  name: 'CountDemo',
  template: `
    <section class="cpn--count-demo">
      <div>count: {{count}}</div>
      <div><button @click="add">+ 1</button></div>
    </section>
  `,
  data() {
    return {
      count: 0
    }
  },
  methods: {
    add() {
      this.count = this.count + 1
    }
  }
})

// app Vue instance
var app = new Vue({
  name: 'SimpleDemo',
  data() {
    return {
      msg: 'Hello Simple Demo'
    }
  }
})


// mount
app.$mount('#app')

console.log('alan-> app', app)
window.appVue = app
