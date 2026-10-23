---
title: 如何编写单元测试
createdAt: 2020-12-20T12:22:40.000Z
---

## 什么是单元测试 {#what}

**单元测试**是什么？有些同学可能会觉得，在项目中可以通过命令运行的测试过程就是单元测试。如果这样理解的话，那你可能把单元测试和**自动化测试**搞混了。

单元测试是自动化测试的一种。一般来说（自动化）测试可以简单划分为单元测试、集成测试和功能测试。

- 单元测试：针对一个基本单元，一般是代码的一个模块，进行全方位的用例测试
- 集成测试：针对一整块逻辑进行测试
- 功能测试：针对整个系统进行测试

看起来，似乎只有单元测试能够实现自动化，但实际上并不是。比如我们也可以使用 Headless Chrome/Puppeteer/Selenium 进行自动化集成测试。

## 为啥要写单元测试 {#why}

有个管理 Bug 的软件叫做 BugFree，这个名字除了表示它免费开源之外，bug-free 本身也被传播为一个形容词，表示一段程序是完全没有 Bug 的。当然这里仅只代码本身，否则硬杠的话你也可以说解释器/浏览器/操作系统/电路出毛病也会产生 Bug。通常来说如果想要实现 bug-free，最好的方式就是列举出足够多的用例，并保证这些用例都能够符合预期地工作。这其实就是单元测试的概念。

当然，只针对单个模块的单元测试并不能保证完整功能的 bug-free，比如有个经典例子：

> 一个测试工程师走进一家酒吧，要了一杯啤酒
> 一个测试工程师走进一家酒吧，要了一杯咖啡
> 一个测试工程师走进一家酒吧，要了0.7杯啤酒
> 一个测试工程师走进一家酒吧，要了-1杯啤酒
> 一个测试工程师走进一家酒吧，要了2^32杯啤酒
> 一个测试工程师走进一家酒吧，要了一杯洗脚水
> 一个测试工程师走进一家酒吧，要了一杯蜥蜴
> 一个测试工程师走进一家酒吧，要了一份asdfQwer@24dg!&*(@
> 一个测试工程师走进一家酒吧，什么也没要
> 一个测试工程师走进一家酒吧，又走出去又从窗户进来又从后门出去从下水道钻进来
> 一个测试工程师走进一家酒吧，又走出去又进来又出去又进来又出去，最后在外面把老板打了一顿
> 一个测试工程师走进一
> 一个测试工程师走进一家酒吧，要了一杯烫烫烫的锟斤拷
> 一个测试工程师走进一家酒吧，要了NaN杯Null
> 1T测试工程师冲进一家酒吧，要了500T啤酒咖啡洗脚水野猫狼牙棒奶茶
> 1T测试工程师把酒吧拆了
> 一个测试工程师化装成老板走进一家酒吧，要了500杯啤酒并且不付钱
> 一万个测试工程师在酒吧门外呼啸而过
> 一个测试工程师走进一家酒吧，要了一杯啤酒';DROP TABLE 酒吧
>
> 测试工程师们满意地离开了酒吧。然后一名顾客点了一份炒饭，酒吧炸了

（引用来源：https://www.zhihu.com/question/20034686/answer/52063718）

软件开发中有一种模式叫做**测试驱动开发**（Test-Driven Development, **TDD**）。一般来说就是，在开发功能/进行重构/编写测试之前，我先把测试编写好，然后以能够实现这些测试用例为目标来编写/修改我的代码。TDD 可以很大程度上保证代码的测试覆盖率，并且保证代码总是按照最初的预期进行工作。

但是 TDD 有一个问题是，我的测试用例要精确到什么程度。比如我要实现一个类，我需要测试它的私有属性吗？我需要测试它在不同情况下的不同副作用吗？如果过于精细的话，可能会导致“测试用例本身变成了代码”的情况，这样代码的正确性就变成了测试用例的正确性，测试本身就失去了意义。因此一般也会通过另一种叫做**行为驱动开发**（Behavior-Driven Development, **BDD**）的模式来进行约束。

BDD 和 TDD 的概念基本上是一致的，但是 BDD 是面向结果而非过程的。也就是说，我不需要测试一段代码往数据库/Web Storage 里究竟写了什么值，我只需要知道它的返回值是正常的就可以。这一特点使得 BDD 编写测试的方式通常和 TDD 也有风格上的差异。

## 怎么写单元测试 {#how}

其实说起来写单元测试很简单。比如你有一段代码：

```js
function getText() {
  return 'Hello, World!'
}
```

如果想要验证它的输出，最简单的单元测试就是：

```js
// unit-test.js
function test() {
  if (getText() !== 'Hello, World!') throw new Error('Unexpected output!')
}
test()
```

每当我想要运行测试的时候，只需要运行 unit-test.js 查看是否有报错就可以了。但这可能会导致一些问题：当测试用例越来越多时，这样的管理方式可能不是很理想。

因此，我们通常需要一个**测试框架**。测试框架能提供给我们的不只是测试文件的管理，也包括：

- 断言
- 并行执行
- Mock
- 测试覆盖率

...等等。

因此在具体了解测试框架之前，可以先聊聊这些测试框架的功能。

### 断言 {#assertion}

写过其他语言的同学对这个概念应该不会陌生。在 C 语言里面就有 assert.h 这个头文件内置了断言的功能（一个小知识是，C 的 assert 实际上是一个宏而不是函数）。在其他语言里也有完全一致的功能，例如在浏览器中你也可以

```js
console.assert(1 + 1 === 0, 'Oops!')
```

但这显然不够。比如某些情况可能我们需要：

```js
const value = foo()
console.assert(
  value && value.a === 1 && value.b === 2 && value.c === 3,
  'foo() does not return { a: 1, b: 2, c: 3 }!',
)
```

在 Node.js 中，实际上有一个内置的模块 [assert](https://nodejs.org/api/assert.html)，包含了一个断言的常见功能：deepEqual。例如

```js
const assert = require('assert')

const value = foo()
assert.deepEqual(value, { a: 1, b: 2, c: 3 })
```

此外，NPM 生态中也有很多例如 [power-assert](https://www.npmjs.com/package/power-assert) 这样的库，在 assert 的基础上提供了更多实用的功能。

assert 风格通常被认为是 TDD 风格的，而在 BDD 中，由于 assert 并不能准确地表达“行为”这个概念，所以也有一些断言库为 Node 另一种风格的 API，最经典的就是 [chai](https://www.npmjs.com/package/chai)。

Chai 同时支持 TDD/BDD 风格的 API。所谓 TDD 风格也就是 assert 函数，而 BDD 风格则书写为：

```js
const { expect } = require('chai')

const value = foo()
expect(value).to.equal({ a: 1, b: 2, c: 3 })
```

实际上两种风格能够实现的功能是一致的，但也可以看出，assert 是一种面向特性的风格，而 expect 则是一种面向结果的风格。

### 并行执行 {#parallel}

按照单元测试的习惯，每个测试之间都应该是互不干扰且没有副作用产生的。因此，测试之间应当是可以并行执行的。

常见的测试框架都支持并行执行。当然，如果一定不要使用框架的话，也可以通过 shell 命令来完成。不过“多条 shell 命令并行执行，但在任意一个触发错误后即停止所有命令”也是一个经典的问题。

### Mock {#mock}

自动化的单元测试几乎一定需要 Mock 功能。试想你需要测试的功能依赖定时器函数，总不至于我需要等待多少时间执行定时器，测试代码就运行多少时间吧？再例如，我需要使用 Node.js 的 http 模块，但是我不希望在测试中直接发送请求。上面的情况都是需要对对应的模块进行 mock 的。

目前比较主流的 mock 库基本就是 [Sinon](https://www.npmjs.com/package/sinon) 了。首先，它提供了可以监听函数调用的功能：

```js
const spay = sinon.spy($, 'ajax')
$.ajax(/* ... */)
expect(spay.callCount).to.be(1)
```

另外它也可以实现对于某个函数/访问器实现的模拟。详细的接口可以看他们的[官网](https://sinonjs.org/)。

### 测试覆盖率 {#coverage}

顾名思义，测试覆盖率指的是运行单元测试可以检查到的代码的占比。目前主流的覆盖率分析工具是 [istanbul](https://www.npmjs.com/package/istanbul) 及其继任者 [nyc](https://www.npmjs.com/package/nyc)。

一般来说，覆盖率测试是通过 babel 这样的工具或是某些解释器提供的功能，来检查测试代码运行后执行过的代码行数、函数数量和分支数等等，最终给出一个近似的比例。

### 框架 {#framework}

目前主流的测试框架有：[Jest](https://www.npmjs.com/package/jest)、[Mocha](https://www.npmjs.com/package/mocha)、[Ava](https://www.npmjs.com/package/ava) 等

Mocha 是一个相当老牌的测试框架，来自于非著名设计师 TJ Holowaychuk。上述功能它基本上都不支持，也正因如此，上述的主流工具库大多是为了填补 Mocha 的空白出现的。所以尽管 Mocha 支持的功能有限，但是 Mocha + Chai + Sinon + Nyc 就是一套测试利器了。

Jest 是 facebook 出品的一套大而全的测试框架，也是目前这些测试框架中下载量最高的，尽管主要原因是 create-react-app 内置了它。上述功能 Jest 都有内置，并且接口格式基本和主流库一致。

Ava 的卖点是轻量，但是之前一直都有一些稳定性问题。

总的来说，在工程化的项目中，使用 Jest 可能不是最好的选择，但基本是最简单的选择。

## 使用 Jest 编写测试 {#using-jest}

了解了背景知识之后，就可以开始写了。下面的内容都假设我们使用了 Jest 作为测试框架。

一般来说，我们项目中会约定一些专门用于存放单元测试文件的目录（比如 `__tests__`，`__specs__`，或者直接就是 tests 或 specs），或者是通过后缀名（.test.js 或者 .spec.js）来区分。在 Jest 里面，默认支持 `__tests__` 和两种后缀名。如果觉得下划线文件夹比较丑的话，后缀名其实是个很好的选择，这和 .d.ts 或者 .stories.js 也比较一致。尽管如此，把测试放在单独的目录也是比较容易管理的，因为你可能会在某些工具库中对测试代码单独进行配置，比方说 ESLint 之类的。

对于 Jest 来说，一些常见的方法，比如 describe、test/it、expect 还有 jest 对象都是全局变量，所以不需要使用 import 或者 require。直接新建一个 .test.js，然后开始写就完了。

假设我们有一个 foo.js

```js
export function getFoo(value) {
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value)
    } catch {
      return undefined
    }
  }
  return value.foo
}
```

OK，我们可以开始写测试了：

```js
import { getFoo } from './foo'

describe('getFoo', () => {
  // ...
})
```

describe 实际上是在描述你在测试哪个模块，它可以帮助我们在一个文件里面进行多个类别的测试。比方说我们可能一般习惯对于每一个 .js 都建一个 .test.js，然后每一个导出都写一个 describe。

describe 的回调函数里则可以编写测试代码：

```js
import { getFoo } from './foo'

describe('getFoo', () => {

  it('should return the value of `foo` when receiving an object', () => {
    expect(getFoo({ foo: 1 })).toBe(1)
  })

})
```

这是一个最简单的测试用例。这个 it 函数用来声明接下来的测试内容测试的是什么样的用例，很多时候也写作 test，不过 it 可能更具有语义性。内容则很简单，是一段 BDD 风格的测试代码。总的来说，这个例子还是比较像是一段英语的。

有时候你也可以做更加详细的测试，例如

```js
import { getFoo } from './foo'

describe('getFoo', () => {

  it('should visit the value of `foo` when receiving an object', () => {
    const object = { foo: 1 }
    const spy = jest.spyOn(object, 'foo', 'get')
    const result = getFoo({ foo: 1 })
    expect(result).toBe(1)
    expect(spy).toHaveBeenCalledTimes(1)
  })

})
```

这个例子除了返回值之外，还测试了对对象的 foo 属性是否访问过，且是否只访问了一次。但是，这样详细的测试实际上是对实现的耦合，很大程度上和 BDD 的思想是相悖的。通常我们只需要验证结果就可以了，如果希望也可以验证属性是否被访问，但是验证访问次数就显得多余了。

有时候你可能有多个用例，希望复用一些 mock 代码，则可以：

```js
import { getFoo } from './foo'

beforeEach(() => {
  localStorage.setItem('foo', 'bar')
})

describe('getFoo', () => {

  it('should return the value of `foo` when receiving an built-in object', () => {
    expect(getFoo(localStorage)).toBe('bar')
  })

})
```

beforeEach 会在每个测试运行前执行。如果希望只执行一次，可以用 beforeAll。

上面的这个例子有一个明显的问题，就是没有清理掉额外写入的 localStorage，这会对其他的测试产生影响，所以应该要：

```js
import { getFoo } from './foo'

beforeEach(() => {
  localStorage.setItem('foo', 'bar')
})

afterEach(() => {
  localStorage.removeItem('foo')
})
```

实际上，你也可以不访问 localStorage 来避免实际写入值：

```js
import { getFoo } from './foo'

beforeEach(() => {
  localStorage.setItem('foo', 'bar')
})

describe('getFoo', () => {

  it('should return the value of `foo` when receiving an built-in object', () => {
    const spy = jest.spyOn(localStorage, 'foo', 'get')
      .mockImplemention(() => 'bar')
    expect(getFoo(localStorage)).toBe('bar')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

})
```

另外有些时候，你可能还需要测试一些异步的过程，Jest 对于异步的支持也是比较好的：

```js
import { getAsyncFoo } from '../foo'

describe('getAsyncFoo', () => {

  it('should work well', async () => {
    const result = getAsyncFoo()
    expect(result).toBeInstanceOf(Promise)
    await expect(result).resolves.toBe('foo')
    // 或者也可以
    // const value = await result
    // expect(value).toBe('foo')
  })

})
```

编写更多的测试用例有助于你发现一些逻辑问题。比如上面的 getFoo，在测试了足够的用例之后就能发现，当传入 null 时会发生错误。针对这样的情况，就可以修改代码来进行修复，从而进一步接近 bug-free。
