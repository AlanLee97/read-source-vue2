/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-debugger */

// app Vue instance
var app = new Vue({
  name: 'SimpleDemoAPI_Watch',
  data() {
    return {
      count: 0,
      countObj: {
        value: 0
      }
    }
  },
  watch: {
    count(newVal) {
      console.log('alan->watch count', newVal)
    },
    countObj: {
      handler(newVal) {
        console.log('alan->watch countObj', newVal)
      },
      immediate: true,
      deep: true
    },
    'countObj.value': function (newVal) {
      console.log('alan->watch countObj.value', newVal)
    },
  },
  methods: {
    plus() {
      this.count += 1;
      this.countObj.value += 1;
    }
  }
})


// mount
app.$mount('#app')

console.log('alan-> app', app)
window.appVue = app
