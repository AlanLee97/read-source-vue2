/* @flow */
/* globals MutationObserver */

import { noop } from 'shared/util'
import { handleError } from './error'
import { isIE, isIOS, isNative } from './env'

export let isUsingMicroTask = false

// 收集回调函数的队列
const callbacks = []
// 定义状态
let pending = false

// 清空回调队列的函数
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]() // 把回调队列中的函数取出来执行
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).

// 定义定时器函数，后面赋值
let timerFunc

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
// 如果运行环境支持Promise，则使用Promise
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => { // 定义行数，赋值给timerFunc
    p.then(flushCallbacks) // 将flushCallbacks作为resolve的回调函数，执行完回调队列中的函数
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.

    // ios中有特殊情况
    // 在有问题的UIWebViews中，Promise.then不会完全中断，但它可能会陷入一种奇怪的状态，回调被推入微任务队列，但队列不会被刷新，直到浏览器需要做一些其他工作，例如处理计时器。
    // 因此，我们可以通过添加空计时器来“强制”刷新微任务队列。
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true // 标记使用微任务
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // 当运行环境不支持Promise时，判断下是否支持MutationObserver，如支持则使用MutationObserver
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  let counter = 1
  // 用flushCallbacks作为MutationObserver的回调函数
  const observer = new MutationObserver(flushCallbacks)
  // 创建临时的文本节点，用MutationObserver观测它的变化，以触发new MutationObserver(flushCallbacks)执行
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => { // 将更改DOM的函数赋值给timerFunc
    // 当执行nextTick时，会执行timerFunc，这里改变textNode的值，每次+1
    // 触发new MutationObserver(flushCallbacks)执行
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // 当运行环境不支持Promise、MutationObserver时，判断下是否支持setImmediate，如支持则使用setImmediate
  // setImmediate这个API只在node环境下可用

  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  // 如果上面的方式都不行，则使用setTimeout
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

// 调用$nextTick时，执行该函数
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve // 缓存Promise的resolve
  // 收集回调函数
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      // 执行Promise的resolve回调
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    // 执行定时器函数，核心逻辑
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
