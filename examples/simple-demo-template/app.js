/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-debugger */

// app Vue instance
var app = new Vue({
  name: 'SimpleDemo_Template',
  data() {
    return {
      count: 0
    }
  },
  methods: {
    plus() {
      this.count += 1;
    }
  }
})

debugger
// mount
app.$mount('#app')

console.log('alan-> app', app)
window.appVue = app
