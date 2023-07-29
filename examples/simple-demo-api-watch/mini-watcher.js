
class MiniWatcher {
  vm = null; // 当前vue/vue组件实例
  cb = () => {}; // 回调函数
  getter = () => {}; // 取值函数
  expression = ''; // watch的键名
  user = false; // 是否是用户定义的watch
  value; // 当前观察的属性的值

  constructor(vm, expOrFn, cb, options = {}) {
    this.vm = vm;
    this.cb = cb;
    this.expression = expOrFn;
    this.getter = parseExpression(this.expression, vm, this);
    this.user = options.user;
    this.value = this.get();
  }

  get() {
    const value = this.getter();
    return value;
  }

  update() {
    nextTick(() => {
      this.run();
    })
  }

  run() {
    // 获取新值和旧值
    const newValue = this.get();
    const oldValue = this.value;
    this.value = newValue;
    this.cb.call(this.vm, newValue, oldValue);
  }
}

class MiniDep {
  static target = null;
  subs = [];

  depend(sub) {
    if(sub && !this.subs.includes(sub)) {
      this.subs.push(sub);
    }
  }

  notify() {
    this.subs.forEach(sub => {
      sub && sub.update();
    })
  }
}

// 解析表达式，返回一个函数
function parseExpression(key, vm, watcher) {
  return () => {
    MiniDep.target = watcher;
    // 取值，触发getter，取值前先把watcher实例放到target中
    const value = vm.data[key];
    // 取完值后，清空Dep.target
    MiniDep.target = null;
    return value;
  }
}

function nextTick(cb) {
  return Promise.resolve().then(cb);
}

function MiniVue(options = {}) {
  const vm = this;
  this.vm = this;
  this.data = options.data;
  this.watch = options.watch;
  this.deps = new Set();

  initData(this.data); // 初始化data
  initWatch(this.watch); // 初始化watch

  function observe(data) {
    for (const key in data) {
      defineReactive(data, key);
    }
  }

  function defineReactive(data, key) {
    const dep = new MiniDep();
    vm.deps.add(dep);
    const clonedData = JSON.parse(JSON.stringify(data));
    Object.defineProperty(data, key, {
      get: function reactiveGetter() {
        // console.log('alan->', 'get', clonedData[key]);
        dep.depend(MiniDep.target);
        return clonedData[key];
      },
      set: function reactiveSetter(value) {
        // console.log('alan->', 'set', key, value);
        dep.notify();
        clonedData[key] = value;
        return value;
      }
    });
  }
  
  function initData(data = {}) {
    for (const key in data) {
      vm[key] = vm.data[key];
      observe(vm.data);
    }
  }

  function initWatch(watch = {}) {
    for (const key in watch) {
      new MiniWatcher(vm, key, watch[key], {user: true}); // user = true，标记这是用户定义的watch
    }
  }
}

const vm = new MiniVue({
  data: {
    count: 0
  },
  watch: {
    count(newVal, oldVal) {
      console.log('alan->watch count', {newVal, oldVal})
    }
  }
})

// console.log('alan->', vm);

const btn = document.getElementById('btnPlus');
const res = document.getElementById('res');
btn.onclick = () => {
  vm.data.count = vm.data.count + 1;
  const count = vm.data.count
  console.log('alan->count', count);
  console.log('alan->vm', vm);
  res.innerHTML = count;
}
