/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-debugger */

// app Vue instance
var app = new Vue({
  name: 'SimpleDemoAPI_Computed',
  data() {
    return {
      count: 0,
    }
  },
  computed: {
    countComputed() {
      return this.count * 2;
    }
  },
  created() {
    console.log('alan->countComputed', this.countComputed);
  },
  methods: {
    plus() {
      this.count += 1;
    }
  }
})


// mount
app.$mount('#app')

console.log('alan-> app', app)
window.appVue = app
