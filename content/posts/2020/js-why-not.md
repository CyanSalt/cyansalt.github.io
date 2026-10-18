---
createdAt: 2020-06-22T08:00:00.000Z
---

# JS Why Not 系列

## 为什么避免使用 ?. 操作符？ {#optional-chaining}

这里还是首先澄清一下，这一段**并不是说不要使用**可选链操作符，相反，可选链操作符由于语言支持的原因，比起任何其他方案（比如 lodash.get 或者 undefsafe）都要好（例如，对于类型系统的支持、JS 引擎优化等等）。那么，为什么还是要单独提出避免使用呢？

### 空对象模式 {#empty-object-pattern}

实际上这里并不针对可选链单种操作符：

```js
// Optional chaining
const myVar = myObject.prop_a?.prop_b
```

以下的写法同样是需要斟酌的（**或操作符**）：

```js
// OR operator
const myVar = myObject.prop_a || {}
```

这些写法本质上是一样的。考虑第一个可选链的例子，实际上等价于

```js
const propA = myObject.prop_a || {}
const myVar = propA.prop_b
```

某些情况下喜欢用**空对象模式**来形容这种操作。所谓空对象模式就是，当某个数据为空时，将其作为一个空对象处理。

### 类型问题 {#type-issue}

空对象模式有一定的好处。例如，考虑以下例子：

```js
function getFoo(arg) {
  return arg.foo || {}
}

function getBar(arg) {
  return getFoo(arg).bar || {}
}

function getBaz(arg) {
  return getBar(arg).baz || {}
}
```

当传入的 `arg` 参数缺少 `foo` 时，调用 `getBaz` 依然可以保证不出错。

但是空对象模式仍然是一种相当**反模式**的用法。考虑上述的 `arg` 参数的类型，本应为

```js
type Arg = {
  foo: {
    bar: {
      baz: unknown
    }
  }
}
```

但是当我们使用空对象时，实际上这个类型数据在后续的调用中丢失了，意味着它变成了

```js
type Arg = {
  foo?: {
    bar?: {
      baz: unknown
    }
  }
}
```

### 向下污染 {#downward-pollution}

上面的例子实际上说明了，使用可选链或者或操作符默认值的一个缺陷是**向下污染**。考虑一个具体的例子，假设我们在写一个组件：

```js
const FooComponent = props => (
  <div>{props.info.name}</div>
)

const BarComponent = props => (
  <FooComponent info={props.data.user.info} />
)
```

可能正常情况下这个组件工作得很好，但某个情况下，传给 `BarComponent` 的 `data` 没有 `user` 这个属性。按照上面的模式，代码会变成

```js
const FooComponent = props => (
  <div>{props.info?.name}</div>
)

const BarComponent = props => (
  <FooComponent info={props.data.user?.info} />
)
```

原本只是 BarComponent 对数据需要额外处理，现在变成了 `FooComponent` 也需要修改对应的实现了！这里显然，一个更好的解决方案是

```js
const FooComponent = props => (
  <div>{props.info.name}</div>
)

const BarComponent = props => (
  props.data.user ? <FooComponent info={props.data.user.info} /> : <div />
)
```

### 展现 {#exposing}

另一个问题是，使用可选链/或操作符可能错误地掩盖了我们遇到的问题。依然考虑上面的例子，当我们使用可选链来解决这个问题的时候，实际上我们解决的不是**问题**，而是**报错**。对于很多前端框架而言，代码依然在按照报错的情况运行，只是我们不再看得到 `Cannot read property 'info' of undefined` 了。通常这意味着我们忽略了真正的问题：

> 为什么传给 `BarComponent` 的 `data` 没有 `user` 这个属性？

显然对于这个问题，在不同的场景下都应该有更合适的处理方式：

- 如果是加载状态引起的，是否应该在组件内展示一个加载中的图标，而不是直接什么都不展示？
- 如果是接口失败引起的，是否应该是给出一个加载失败的提示？
- 如果是数据格式变动引起的，是否应该考虑这里需要兼容新/旧数据格式？
- …或者，我们根本就用错了组件呢？

其实可选链操作符很多时候还是有用的，但这种情况通常只发生在【对应的参数原本就接受一个可以为空的数据】的情况。如果大家觉得不好判断的话，只要在用的时候多想想，是否**现在或者未来**会有其他边缘情况的问题就好了；或者思考一下，当我们使用 TypeScript 去写的时候，是否就会有问题暴露出来？

## 为什么避免使用 `.then()` 等方法？ {#promise-methods}

回顾一下异步处理的历史：

- ES3：callback
- ES2015：Promise、co
- ES2017：async function
- ES2019：async iterator
- ……

异步处理的方式随着语言的发展越来越多，我们很多时候是全部都在使用的。但这里想要提的是，我们应当尽量避免使用 Promise 的**原型方法**，而是使用 async function 来代替。

### 可读性 {#readability}

众所周知，async function 的可读性远大于 Promise。这是因为 Promise 本身就是异步操作的**原语**，相当于是说，Promise 实际上只提供了底层接口，而 async function 则是开发层面的使用方式。

简单对比一下：

```js
async function checkStatus(time, interval) {
  return new Promise(resolve => {
    function poll() {
      if (time <= 0) {
        resolve(undefined)
        return
      }
      fetchValue().then(value => {
        if (value) {
          resolve(value)
          return
        }
        time -= 1
        setTimeout(poll, interval)
      })
    }
  })
}
```

和

```js
function wait(interval) {
  return new Promise(resolve => setTimeout(resolve, interval))
}

async function checkStatus(time, interval) {
  let value
  while (time > 0) {
    try {
      value = await fetchValue()
      if (value) return value
    } catch {
      // continue
    }
    await wait(interval)
    time -= 1
  }
  return value
}
```

显然下面的可读性更好（而且是在上面的代码已经被抽象过的条件下，不然会更加糟糕）

为什么会有可读性的差异呢？除了所谓的可以写成同步的方式之外，一个比较重要的原因在于：我们可以在 async function 里使用**大部分的语言结构**（for/while/try-catch 等），JS 已经为其做了同步/异步的处理。

### 异步化 {#asynchronous}

继续上面的这一点来展开的话，之所以在 async function 内可以使用多数语言结构，一个重要的原因在于，await 操作本身语义也被统一了。考虑一下：

```js
let value
function getValue() {
  if (value) return value
  return new Promise(resolve => {
    return fetchValue()
  }).then((result) => {
    value = result
    return value
  })
}
```

上面的例子似乎也挺自然的，如果有一个缓存的值则使用这个值，如果没有则返回一个 Promise。就好像我们写

```js
let value
async function getValue() {
  if (value) return value
  value = await fetchValue()
  return value
}
```

好像也没什么区别呀？

但是，正如这篇文章要讨论的，考虑下面的调用情况

```js
function printValue() {
  getValue().then(value => {
    console.log(value)
  })
}
```

在第一个例子中，这段代码会有一个问题，就是当 value 有缓存值的时候，getValue 的返回值并没有 then 方法。除非：

```js
function printValue() {
  const result = getValue()
  if (typeof result.then === 'function') {
    result.then(value => {
      console.log(value)
    })
  } else {
    console.log(result)
  }
}
```

或者聪明的同学会想到

```js
function printValue() {
  Promise.resolve(getValue()).then(value => {
    console.log(value)
  })
}
```

然而，如果我们使用第二个例子是，实际上 async 关键字已经将我们的返回值统一成了 Promise，在调用的时候便没有后顾之忧了。

不仅如此，假设我们的调用是

```js
async function printValue() {
  const value = await getValue()
  console.log(value)
}
```

那么不论上面哪一种写法，都是可以工作的，因为 await 关键字也已经将返回值统一成了 Promise 来处理。这意味着当我们使用 async 或者 await 的时候，同步值也会作为异步来处理，也就不需要我们关心两者的区别。

### 兼容性 {#compatibility}

另一个问题是，**原型方法**只能 polyfill，而 async/await 及其涉及的语法可以**转译**。两者的最大区别在于转译可以保证生产环境使用兼容的代码，而原型 polyfill 只能靠 browserslist 的声明来推断。

在这个问题上，最明显的表现是 Promise#finally（ES2019）。当某些浏览器没有被 browserslist 覆盖到时，使用 .finally 就会报错。

尽管目前在肉眼可见的未来内，Promise 对象不会有新的原型方法了，我们只需要对 .finally做特殊处理就可以；但是未来的事情，谁又能说清呢？:)
