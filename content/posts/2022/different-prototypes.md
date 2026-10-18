---
createdAt: 2022-08-19T11:09:11.000Z
---

# 什么？不同函数的 prototype 竟然会表现不同？

之前在 Code Review 的时候发现了这样的代码：

```js
const formatter = options?.formatter ?? Function.prototype
const value = formatter(data)
```

你能理解这里的 `Function.prototype` 的含义吗？

## 基本类型的 `prototype` {#primitive-prototypes}

在上面的代码里，`Function.prototype` 实际上起到了 noop 的作用。可以打开控制台试一下：

```javascript
Function.prototype() // undefined
Function.prototype(1) // undefined
Function.prototype(1, 2) // undefined
;(0, Function.prototype)() // undefined
```

在 JavaScript 里面，**基本类型的原型都是该函数的实例**。但是请注意，我们是不能用 `instanceof` 来验证的，因为 `instanceof` 只检查该对象的原型与函数的 `prototype` 的关系，因此 `Foo.prototype instanceof Foo` 总是 `false`。

那 `Function.prototype` 的行为是一个巧合吗？比如 `Number` 或者 `String` 呢？

对于几个基本类型的包装对象，我们可以通过 `.valueOf()` 来获取其原始值。我们可以对 `prototype` 也做类似的操作：

```javascript
Number.prototype.valueOf() // 0
String.prototype.valueOf() // ''
Boolean.prototype.valueOf() // false
```

好像……还挺符合直觉的？这些原型的值都是空值，也就是 falsy 的。

## 非基本类型的 `prototype` {#non-primitive-prototypes}

对于非基本类型，情况会不同吗？比如我们熟悉的数组。尽管不能使用 `.valueOf()` 检查了，但对于数组我们还有一个大杀器：

```javascript
Array.isArray(Array.prototype) // true
```

我们甚至可以把 `Array.prototype` 当成一个数组来使用！

```javascript
Array.prototype.length // 0
Array.prototype.push(42)
Array.prototype[0] // 42
Array.prototype.length // 1

// 然而...
[][0] // 42
```

于是看上去，似乎非基本类型也遵循一样的规则：`prototype` 也是一个“原始”的实例。

如果是其他类似数组的东西呢？

```javascript
let foo
foo = Object.getPrototypeOf((function () { return arguments })()) // Arguments {}
foo.length // undefined
```

看起来 `Arguments` 好像又和 `Array` 不一样了。

现在我们知道，在早期的 JavaScript （ES3 之前）中，实际上只有很少几种内置的非基本类型对象，除了 `Array` 我们还有 `Date`。那么 `Date` 是否也如此呢？

```javascript
Date.prototype.valueOf() // [!code error]
// Uncaught TypeError: this is not a Date object.
```

咦？这好像和之前我们的结论不同！再试试：

```javascript
Date.prototype.toString() // [!code error]
// Uncaught TypeError: Method Date.prototype.toString called on incompatible receiver [object Object]
```

呃，为何会这样呢？

我想一些对 JS 非常熟悉的同学可能能给出可能的解释：毕竟 `Date` 是一个非常妖魔的函数——全 JS 只有 `Date` 实例的 `.valueOf()` 返回非本身类型的结果（很久以前我甚至基于此特性写过 [跨环境可用的判断对象是否为 Date 类型方法
](https://scrapbook-cyansalt.vercel.app/is-date)）。事实如此吗？我们可以随着历史的脚步继续前进。

## 新的标准 {#new-specs}

ES3 引入了一些新的类型，比如 `Error` 和 `RegExp`。我们现在试一下：

```javascript
Error.prototype.toString() // 'Error'
RegExp.prototype.toString() // '/(?:)/'
```

看上去是如此合理。而且如果我们使用 `.valueOf()`，它们也不会像 `Date` 一样报错。这样看来确实是 `Date` 是异类吗？不要忘记，`RegExp` 也是可以交互的，我们来试试：

```javascript
RegExp.prototype.test('foo') // [!code error]
// Uncaught TypeError: Method RegExp.prototype.exec called on incompatible receiver [object Object]
```

咦，这和 `Date.prototype.toString()` 的报错竟然是一致的！为什么 `RegExp.prototype.toString()` 却不会报错呢？

我们过会儿再看这个问题。再看看 `Error`。尽管 `Error.prototype` 表现得很像是一个 `Error`，但实际上它不一致的更彻底：

```javascript
Object.prototype.toString.call(Error.prototype) // '[object Object]'
```

它甚至都没有 `Error` 的标签！说明它就是一个普通的对象，只是因为 `Error` 具有特殊的 `.toString()` 逻辑才有此输出。

再来看看其他的类型吧，比如更后面的 `Array` 的亲戚 `UInt8Array`：

```javascript
Uint8Array.prototype.set([], 0) // [!code error]
// Uncaught TypeError: this is not a typed array.
```

呃，画风突变？

继续看看其他的。ES2015 之后又引入了很多很多类型：`Symbol`、`Set`、`Map`、`Promise` 等等。我们可以挑几个典型的试试看。

首先是 `BigInt`。按理说应该和 `Number` 的行为类似，试试看：

```javascript
BigInt.prototype.valueOf() // [!code error]
// Uncaught TypeError: BigInt.prototype.valueOf requires that 'this' be a BigInt
```

咦，又是一种新的报错？实际上错误与之前的错误不同的原因是因为，BigInt 是没有包装类型的，也就是不存在 `typeof new BigInt() === 'object'` 这回事。事实上你甚至无法 `new BigInt()`。

再试一个基本类型，`Symbol` 同样是没有包装类型的，那么：

```javascript
Symbol.prototype.valueOf() // [!code error]
// Uncaught TypeError: Symbol.prototype.valueOf requires that 'this' be a Symbol
```

果然如此。那么让我们试试非基本类型吧，看看 `Array` 的其他亲戚们。先试试 `Set`：

```javascript
Set.prototype.add(1) // [!code error]
// Uncaught TypeError: Method Set.prototype.add called on incompatible receiver #<Set>
```

好嘛，那 `Map` 等等就先不用试了。再试一下 `Promise`：

```javascript
Promise.prototype.then(console.log) // [!code error]
// Uncaught TypeError: Method Promise.prototype.then called on incompatible receiver #<Promise>
```

行吧。我们最后再试一个没有暴露构造函数的类型：

```javascript
let foo
foo = Object.getPrototypeOf(function *() {}) // GeneratorFunction {}

foo() // [!code error]
// Uncaught TypeError: foo is not a function
```

我们现在总结一下，实际上，这些内置类型的 `prototype` 可以按照表现分为以下几类：

1. `prototype` 实际上就是一个实例，包括：`Function`、`Number`、`String`、`Boolean`、`Array`（早期）
2. `prototype` 的某些方面像是一个实例，包括 `RegExp`、`Error`（ES3）
3. `prototype` 完全不是实例，包括：`Arguments`、`Date`（早期）、`Symbol` 等所有 ES2015 及之后的类型

那么问题来了？为何会这样？

## 原因 {#reason}

在 ES2015 之前，所有的内置类型实际上都是第一类，也就是它们的 `prototype` 均表现为自身的实例；也就是说 `Date` 和 `RegExp` 在那时与现在不同。这样处理的原因目前不得而知，对于 JS 来说好像也没什么不正常的。

然而在 ES2015 讨论过程中，TC39 决定对 ES2015 新引入的类型[取消这个行为](https://esdiscuss.org/topic/must-built-in-prototypes-also-be-valid-instances-was-why-dataview-prototype-object-s-class-is-object)。从某种角度似乎也能理解，比如 `TypedArray` 如果具有像 `Array` 一样的全局行为似乎很难接受。

既然如此，那么我们是不是可以对历史的类型也取消这一行为呢？TC39 是这样想的，于是也这么做了，但在实施的时候发现了本文最开始这种写法，以及早期 underscore 也使用了 `Array.prototype` 的表现，因此彼时并未修改 `Function` 和 `Array`。

对前端新特性感兴趣的同学应该听说过 [“Smoosh 门”](https://developer.chrome.com/blog/smooshgate/)，是当初 `Array.prototype.flat` 还叫做 `Array.prototype.flatten` 的时候被发现与 Mootools 不兼容，因此最后改名了。实际上像 Mootools 这种修改原型的库总是引发向前不兼容的罪魁祸首，在 ES2015 发布后就发现其依赖了 `Number.prototype` 的行为。为了保险起见，TC39 在 ES2016 中又回滚所有早期类型的改动。这就有了我们看到的第一类类型。

同时，有些网站还使用了 `RegExp.prototype.toString()` 导致不兼容。不过这个问题 TC39 选择了一个折衷方案：既然 `RegExp` 和 `Error` 本来就有特殊的 `.toString()` 逻辑，那就让它们适配 `prototype` 就好了。这也就是我们看到的第二类类型。
