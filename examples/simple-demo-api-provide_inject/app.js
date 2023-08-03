/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-debugger */

// app Vue instance

const store = {}

const DisplayCount = {
  name: 'DisplayCount',
  template: `
    <div>
      DisplayCount: {{$store.state.count}}
    </div>
  `,
  inject: ['$store'],
  data() {
    return {
      
    }
  },
}

var app = new Vue({
  name: 'SimpleDemoAPI_Provide_Inject',
  components: {
    'display-count': DisplayCount
  },
  provide: {
    $store: store
  },
  data() {
    return {
      count: 0
    }
  },
  created() {
    store.state = this.$data
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
