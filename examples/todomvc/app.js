/* eslint-disable no-undef */
// Full spec-compliant TodoMVC with localStorage persistence
// and hash-based routing in ~150 lines.

// localStorage persistence
var STORAGE_KEY = 'todos-vuejs-2.0'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

// visibility filters
var filters = {
  all: function (todos) {
    return todos
  },
  active: function (todos) {
    return todos.filter(function (todo) {
      return !todo.completed
    })
  },
  completed: function (todos) {
    return todos.filter(function (todo) {
      return todo.completed
    })
  }
}

// eslint-disable-next-line no-unused-vars
const TodoCount = {
  name: 'TodoCount',
  template: `<section>
    <div>todoCount: {{count}}</div>
    <div><button @click="add" style="background: red; padding: 10px;">+1</button></div>
  </section>`,
  inject: ['foo'],
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      count: 0
    }
  },
  beforeCreate() {
    console.log('alan->', 'todo-cpn beforeCreate')
  },
  created() {
    console.log('injected foo', this.foo) // => "bar"
    console.log('alan->', 'todo-cpn created')
  },
  beforeMount() {
    console.log('alan->', 'todo-cpn beforeMount')
  },
  mounted() {
    console.log('alan->', 'todo-cpn mounted')
  },
  methods: {
    add() {
      this.count += 1;
    }
  }
}

// eslint-disable-next-line no-debugger
debugger
// app Vue instance
var app = new Vue({
  // app initial state
  beforeCreate() {
    console.log('alan->', 'root-app beforeCreate')
  },
  created() {
    console.log('alan->', 'root-app created')
  },
  beforeMount() {
    console.log('alan->', 'root-app beforeMount')
  },
  mounted() {
    console.log('alan->', 'root-app mounted')
  },
  // components: {
  //   TodoCount
  // },
  provide: {
    foo: 'bar'
  },
  props: {
    hello: {
      type: String,
      default: 'hello todomvc'
    }
  },
  data: {
    count: 0,
    todos: todoStorage.fetch(),
    newTodo: '',
    editedTodo: null,
    visibility: 'all',
    currentTodoItem: {}
  },

  // watch todos change for localStorage persistence
  watch: {
    todos: {
      handler: function (todos) {
        todoStorage.save(todos)
      },
      deep: true
    }
  },

  // computed properties
  // https://vuejs.org/guide/computed.html
  computed: {
    filteredTodos: function () {
      return filters[this.visibility](this.todos)
    },
    remaining: function () {
      return filters.active(this.todos).length
    },
    allDone: {
      get: function () {
        return this.remaining === 0
      },
      set: function (value) {
        this.todos.forEach(function (todo) {
          todo.completed = value
        })
      }
    }
  },

  filters: {
    pluralize: function (n) {
      return n === 1 ? 'item' : 'items'
    }
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    setCurrent(item) {
      // this.count += 1
      this.currentTodoItem = item
      // setTimeout(() => {
      //   console.log('alan->count', this.count)
      // })
    },
    addTodo: function () {
      var value = this.newTodo && this.newTodo.trim()
      if (!value) {
        return
      }
      this.todos.push({
        id: todoStorage.uid++,
        title: value,
        completed: false
      })
      this.newTodo = ''
    },

    removeTodo: function (todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
    },

    editTodo: function (todo) {
      this.beforeEditCache = todo.title
      this.editedTodo = todo
    },

    doneEdit: function (todo) {
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = null
      todo.title = todo.title.trim()
      if (!todo.title) {
        this.removeTodo(todo)
      }
    },

    cancelEdit: function (todo) {
      this.editedTodo = null
      todo.title = this.beforeEditCache
    },

    removeCompleted: function () {
      this.todos = filters.active(this.todos)
    }
  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // https://vuejs.org/guide/custom-directive.html
  directives: {
    'todo-focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  }
})

// handle routing
function onHashChange () {
  var visibility = window.location.hash.replace(/#\/?/, '')
  if (filters[visibility]) {
    app.visibility = visibility
  } else {
    window.location.hash = ''
    app.visibility = 'all'
  }
}

window.addEventListener('hashchange', onHashChange)
onHashChange()

// mount
// 后置挂载元素
// mountComponent -> updateComponent(更新时 beforeUpdate) / new Watcher(初始化时), 观察vm，vm变化->执行updateComponent
// mounted
app.$mount('.todoapp')

console.log('alan-> app', app)
window.appVue = app
