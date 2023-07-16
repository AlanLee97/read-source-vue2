/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-debugger */

// app Vue instance
var app = new Vue({
  name: 'SimpleDemoAPI',
  data() {
    return {
      count: 0
    }
  },
  methods: {
    plus() {
      this.count += 1;

      console.log('alan->count sync', document.getElementById('count').innerText) // 未更新前的值
      this.$nextTick(() => {
        console.log('alan->count $nextTick', document.getElementById('count').innerText) // 更新后的值
      })
    }
  }
})


// mount
app.$mount('#app')

console.log('alan-> app', app)
window.appVue = app
