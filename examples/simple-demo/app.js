/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-debugger */

debugger
const logStyle = 'color: blue; font-weight: bold;'

const countDemo = {
  name: 'CountDemo',
  template: `
    <section class="cpn--count-demo">
      <div>count: {{count}}</div>
      <div><button @click="add">+ 1</button></div>
      <div class="slot-content">
        <slot></slot>
      </div>
    </section>
  `,
  props: {
    initValue: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      count: 0
    }
  },
  computed: {
    countComputed() {
      return this.initValue
    }
  },
  beforeCreate() {
    console.log('%c count-demo->lifecycle beforeCreate', logStyle)
  },
  created() {
    console.log('%c count-demo->lifecycle created', logStyle)

    this.count = this.initValue
  },
  beforeMount() {
    console.log('%c count-demo->lifecycle beforeMount', logStyle)
  },
  mounted() {
    console.log('%c count-demo->lifecycle mounted', logStyle)
    console.log('countComputed', this.countComputed);
  },
  beforeUpdate() {
    console.log('%c count-demo->lifecycle beforeUpdate', logStyle)
  },
  updated() {
    console.log('%c count-demo->lifecycle updated', logStyle)
  },
  beforeDestroy() {
    console.log('%c count-demo->lifecycle beforeDestroy', logStyle)
  },
  destroyed() {
    console.log('%c count-demo->lifecycle destroyed', logStyle)
  },

  watch: {
    count: function (newVal) {
      console.log('count-demo-> watch count', newVal)
    }
  },

  methods: {
    add() {
      this.count = this.count + 1
    }
  }
}

// app Vue instance
var app = new Vue({
  name: 'SimpleDemo',
  components: {
    // countDemo
  },
  data() {
    return {
      msg: 'Hello Simple Demo'
    }
  },
  methods: {
    changeMsg() {
      this.msg += '>'
    }
  }
})


// mount
app.$mount('#app')

console.log('alan-> app', app)
window.appVue = app
