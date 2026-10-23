---
title: 让代码更具可读性
createdAt: 2020-05-28T08:00:00.000Z
---

可读性是衡量代码是否书写优秀的一个重要指标，良好的可读性有助于阅读的开发者理解代码本身的意图，便于后续的修改和维护。在编写过程中或 Code Review 时，可以依照以下依据来判断代码是否具备良好的可读性：

## 变量和方法的命名 {#naming}

> 变量命名是一门学问 —— 沃兹基硕德

### 原则 {#principle}

最重要的一点是，保持语法的正确性。避免书写如下的代码

```js
// Bad
function checkNowStatus() {}
function goNextUrl() {}

// Good
function checkCurrentStatus() {}
function redirectToNextURL() {}
```

在命名变量/方法时，应该保持足够的区分度。例如：

```js
// Bad
const name1 = '';
const name2 = '';

// Good
const originalName = '';
const currentName = '';
```

此外，一个好的变量名应该能够准确表达意图，例如：

```js
// Bad
const lStatus = false;
// Good
const isLoading = false;
```

前者虽然保持了区分度，但并不能让人直接理解其含义。

另外，可以避免用太短/太长的名字，避免例如：https://github.com/eclipse/org.aspectj/blob/master/org.aspectj.matcher/src/main/java/org/aspectj/weaver/patterns/HasThisTypePatternTriedToSneakInSomeGenericOrParameterizedTypePatternMatchingStuffAnywhereVisitor.java

### 约定 {#convention}

通常来说，我们可以按照如下的约定命名：

- 使用相同的书写规则，例如遵循代码风格指南中的约定，**全部使用 camelCase 格式**
- 用正确的方式处理缩略词可以避免误会，但多数情况也可以不理会。例如

```js
// Not the best
function getCurrentUrl() {}
function isSaasUser() {}
function checkTceStatus() {}

// Good
function getCurrentURL() {}
function isSaaSUser() {}
function checkTCEStatus() {}
```

- 命名标量常量时全部子母大写，命名类和枚举类型时首字母大写，其他情况保持首字母小写。

```js
// Bad
const cookieDelimiter = ';'
const myComponent = Vue.extend({})
const orderStatus = { started: 1 }

// Good
const COOKIE_DELIMITER = ';'
const MyComponent = Vue.extend({})
const OrderStatus = { started: 1 }
```

- 布尔类型的变量通常使用能够作为定语的类型，例如【过去分词】/【形容词】；如果能够以 is 或 has 开头更佳。例如

```js
// Bad
const verify = true;
const activeEl = true;
const noNeg = true;

// Good
const verified = true;
const active = true;
const isPositive = true;
const hasQualified = true;
```

- 在 ES2015+ 中使用 Promise 类型时，使用【现在分词】来表示其类型。例如

```js
// Bad
const image = loadImageAsync();
await image;

// Good
const loadingImage = loadImageAsync();
await loadingImage;
```

- 在命名方法时，尽可能使用谓语+宾语的格式，也就是保持方法名的第一个词是【动词】；某些情况下当行为容易理解时，也可以单独使用【介词+间接宾语】。例如：

```js
// Bad
function taskCategory2Platform() {}
function forEachList() {}
function Json() {}

// Good
function getPlatformByTaskCategory() {}
function normalizeList() {}
function toJSON() {}
```

## 尽量避免动态类型 {#avoid-dynamic-types}

古人云，动态类型一时爽，代码重构火葬场。尽管 JavaScript 是动态类型语言，但从工程化的角度而言，还是应当尽可能保持静态类型保持鲁棒性，并通过约定联合类型的方式保持灵活性。

```js
// Bad
let formatter = 'get_value';
if (data.is_number) {
    formatter = function (value) { return Number(value) }
}
return typeof formatter === 'string' ? data[formatter](value) : formatter(value);

// Good
let formatter = data.get_value;
if (data.is_number) {
    formatter = function (value) { return Number(value) }
}
return formatter(value);
```

除了变量外，对于函数参数类型和返回值类型，也应当尽可能注意这一点（但某些出于便利性/兼容性的场景可以理解）。

## 使用合适的方法表达语义 {#semanticization}

JavaScript 中一些方法本来就是为了提升语义存在的。在合适的场景下，更适合使用这些方法。例如

```js
// Bad
if (arr.find(x => this.isValid(x))) {}
// Good
if (arr.some(x => this.isValid(x))) {}

// Bad
const result = [];
arr.forEach(item => {
  if (item.enabled) result.push(item.value)
});
// Good
const result = arr
  .filter(item => item.enabled)
  .map(item => item.value)

// Bad
arr.map(item => {
  item.value = this.getValue(item.key)
})
// Good
arr.forEach(item => {
  item.value = this.getValue(item.key)
})

// Bad
let sum = 0;
arr.forEach(item => {
  sum += item.value;
})
// Good
const sum = arr.reduce((total, item) => total + item.value, 0)
```

但注意不要滥用。例如我小时候曾经写过一篇 https://github.com/CyanSalt/notebook/issues/17 主张使用 some 代替 forEach，但请勿在生产场景下这样使用。

## 抽象、抽象，以及抽象 {#abstract}

重要的事情说三遍，抽象的意思就是尽可能的把可复用的部分/功能独立的部分单独剥离出来。通常来说你可以按照如下原则来对照：

- 相同的代码不写两遍，包括现在以及未来
- 在一个作用域下，对同一个路径的属性只访问一次；如果还有第二次，那么它应当被赋值给一个变量
- 如果在模板/JSX中循环生成一个 VirtualDOM，并且它有自己的数据逻辑，那么它应当被单独抽象成一个组件
- ……

但同时也要注意，过渡的抽象也是不好的，可能会造成修改成本的提高。抽象的原则取决于你如何理解一段代码的功能，是仅仅服务于你的代码本身的，还是可能被其他部分复用的。如果是前者，尽量将它改的通用，或者是通过命名和注释标注。

## 保持函数的纯度 {#keep-pure}

纯函数是 FP 领域的常见称呼，在 React/Redux 横行的当下也算是在 JS 届有一定地位。通常我们认为纯函数更加适合表达一段独立的逻辑，这主要是由其特点决定的。

纯函数的一个判定方式就是**幂等性**，也就是说，对于相同的参数，不论在什么场景下调用，都会产生相同的结果。考虑以下方法

```js
function addItem(arr, item) {
  arr.push(item)
  return arr
}
```

显然不是一个纯函数，因为如果不停的对一个数组调用，这个数组将会越来越大。下面的写法就更“纯”一些：

```js
function addItem(arr, item) {
  return arr.concat([item])
}
```

不纯的函数最显著的问题是存在**副作用**，这在 JavaScript 中尤其严重，因为 JS 中是可以访问函数作用域上层的变量的。考虑下面的递归

```js
function doSomething(node) {
  const iterateNode = () => {
    if (node && node.children) {
      for (let child of node.children) {
        node = child
        node.setAttribute('data-track', String(Math.random()).slice(2))
        iterateNode()
      }
    }
  }
}
```

可能直觉看上去挺合理的，但是实际上它只会遍历到每个元素的第一个子元素，因为 node = child 这个操作实际上是一个副作用，它修改的是函数的外部变量。上述代码的纯函数写法应该是

```js
function doSomething(node) {
  const iterateNode = (element) => {
    if (element && element.children) {
      for (let child of element.children) {
        child.setAttribute('data-track', String(Math.random()).slice(2))
        iterateNode(child)
      }
    }
  }
  iterateNode(node)
}
```

这样就可以正常的工作。

通常来说问题并不会像上面的例子这样简单，但使用纯函数很多时候可以避免一些潜在的 bug。对于 coder 而言，一个很重要的能力就是意识到自己的代码哪些地方产生了副作用，以及这些副作用是否符合预期，或者是否在合适的时机被消除。

## 保持信任，不避讳异常 {#keep-trust}

很多时候我们喜欢写这样的代码：

```js
{
  template: '<div>{{ name }}</div>',
  props: {
    info: {
      type: Object,
    },
  },
  computed: {
    name() {
      return this.info.author && this.info.author.name
    },
  }
}
```

这通常来说很有效，尤其是在 ES2020 中你甚至可以直接 `info?.author.name`，更加方便了。但是，这样更多时候只是让你看不到 `"Cannot read property 'name' of undefined"` 而已，很容易因为这样的写法忽略了一些问题，例如：

- 是否 author 本应是必传的，而外部忘记了传递？
- 是否 author 不存在意味着加载尚未完成，此时应该展示 loading 而不是空白的 div 元素？
- 是否当 author 不存在时，外部就不应该渲染 MyComponent 元素？

通常来说，这样的“防御”更像是蒙住眼睛不去管这些问题。通常来说，尽管有相同的结果，但更鼓励大家这样实现：

```js
{
  template: '<div>{{ name }}</div>',
  props: {
    info: {
      type: Object,
      required: true,
      // 一种可能的情况是通过 validator 直接校验 props，但注意 props 校验仅在开发环境生效
      // validator(value) {
      //   return Boolean(value.author)
      // },
    },
  },
  computed: {
    name() {
      // 显式地表达“这里 author 有可能为空，这种情况就单独处理”，而不是忽略这个问题
      if (!this.info.author) return ''
      return this.info.author.name
    },
  }
}
```

这种问题同样发生在函数参数上，有时候，不给函数参数提供默认值，也是一种提前发现错误的方式；此外，对于异步过程的调用（Promise/async function）也有类似的情况。

## 尾声 {#end}

```sh
node -e "console.log(require('child_process').execSync('python -c \'import this\'').toString())"
```

> Python 之道 - Tim Peters
>
> 优美胜于丑陋。
> 显式胜于隐式。
> 简洁胜于复杂。
> 复杂胜于凌乱。
> 扁平胜于嵌套。
> 稀疏胜于紧凑。
> 可读性很重要。
> 实用性大于保持纯净，但特例不足以打破这些规则。
> 错误不应静默地消逝，除非明确地沉默。
> 面对模棱两可时切勿猜测，总会有一个——最好是唯一的——显然的方式，尽管在一开始可能并不明显，除非你是大佬。
> 现状胜于未来，尽管未来通常胜于**当下**的现状。
> 难以解释的实现都是坏主意，易于解释的实现可能会是好主意。
> 命名空间就是一个超棒的主意——来做更多这样的事情！
