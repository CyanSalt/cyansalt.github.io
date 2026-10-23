---
title: JavaScript 黑历史
createdAt: 2022-03-16T03:21:24.000Z
---

本文旨在分享一些较为罕见的，JavaScript 中让人直呼离谱的特性。这些特性大部分是历史因素导致的产物，众所周知，Eich 做 JS 第一版的设计实现一共只花了 10 天时间，而这 10 天留给 Web 的，除了一门顶级脚本语言外，还有很多隐藏的坑……

当然，我这里仅仅列举了一些比较有代表性的部分，还有非常多的古老特性没有提及，例如逻辑运算符的变化等等。感兴趣的同学可以阅读《JavaScript 20 年》或者其他相关资料。

> 参考：
> https://web.archive.org/web/20190320112431/https://brendaneich.com/2011/06/

## `Function#arguments` {#function-arguments}

如果我问你，函数有哪些专属的属性？你能想到多少呢？

相信阅读这篇文章的同学都能想到：`.call`、`.apply` 和 `.bind` 都是函数的方法。但是，除此之外呢？

聪明的同学可能也会想到，函数有 `name` 和 `length` 属性，代表函数名和参数长度。实际上，除此之外，函数还有两个特殊的属性：`arguments` 和 `caller`。

```js
function a(foo) {
  a.arguments[0] // 1
  a.caller == b // true
}
function b() {
  a(1)
}
b()
```

<br>

你可能已经开始觉得奇怪了：`arguments` 不是函数内的局部变量吗？实际上，在最初的设计中，`arguments` 是函数的一个属性。这好像也很好理解，毕竟快速实现嘛，比起实现一个特殊局部变量，直接挂在函数上看上去方便实现多了。在函数执行期间，`arguments` 属性就是本次执行的参数集合；在函数执行之外，`arguments` 属性的值就是 `null`。这个行为直至今天都是存在的。

然而在 JavaScript 1.0 中，这带来了一个非常奇葩的特性，那就是：

```js
function a() {
  a.arguments == a // true
}
a()
```

函数和 `arguments` 属性的引用竟然是一致的！尽管具体原因我已经不得而知，但看起来特别像是为了实现 `a.arguments.caller === a.caller` 导致的 Bug。

直到 JavaScript 1.2（随 SpiderMonkey、Navigator 4 发布），`arguments` 成为一个特殊的局部变量，这个 Bug 也随之消除。

<br>

手快的同学可能已经在自己的控制台里尝试了，但是可能会发现和我说的并不一致：

```js
(() => {}).arguments // 按理说是 null，但实际上却报错了
```

这是因为，箭头函数是没有 `arguments` 局部变量的。和 `this` 一样，箭头函数的 `arguments` 是对外部的引用，然而出于语义的一致性，你显然无法通过一个函数来访问一个不属于它的 `arguments` 对象，因此访问箭头函数的 `arguments` 属性总是会报错，看起来就像是这个函数开启了严格模式一样。

> 参考：
> https://cn.history.js.org/part-1.html#arguments-%E5%AF%B9%E8%B1%A1

## `Arguments` {#arguments}

说完了函数的 `arguments` 属性，我们来聊聊 `Arguments` 对象本身。

几年前，你可能还会经常看到这样的代码：

```js
var args = [].slice.call(arguments)
```

甚至是现在，在某些浏览器脚本代码中你依然可以看到这样的写法。如你所见，上述代码的作用是将 `arguments` 转化为一个数组。尽管这个用法存在着诸如性能等问题，但这实际上说明了一件事情：`arguments` 不是数组。事实上，它是 `Arguments` 函数的实例（注：由于早期的 JS 中没有类的概念，因此这里称为“函数”）。

于是问题出现了：为什么 `arguments` 不是数组？

<br>

很多同学也许都能想到：因为 `arguments` 有 `callee` 属性，而我们通常都不会见到有特殊属性的数组。如果你也这么想，可以试试：

```js
/a/g.exec('a')
```

或者对于 ES2015：

```js
console.log``
```

这些例子证明 `arguments` 即便是数组也并不特别。

<br>

对语言特性熟悉的同学可能知道：`arguments` 对象有“双向绑定”特性，这意味着：

```js
function a(foo) {
  foo // 1
  arguments[0] = 2
  foo // 2
}
a(1)
```

*（值得一提的是，这个特性在 ES3 之前都是未定义的行为）*

关于这个特性，现在看起来可能依然会觉得奇怪：即便是在我们有了 `PropertyDescriptor` 和 `Proxy` 的今天，我们好像也很难间接修改一个【变量】的引用。

然而，如果和另外一个特性结合看，可能就更容易理解。在 JavaScript 1.1（随 Navigator 3 发布）中，`arguments` 新增了一个特性：

```js
function a(foo) {
  foo // 1
  arguments.foo // 1
  arguments.foo = 2
  foo // 2
  arguments.arguments == arguments // true
}
a(1)
```

会觉得眼熟吗？如果你用过 Vue，有没有觉得 `arguments` 就像是模板中的 `this` 一样？或者说，实际上上面的代码具有下面代码的对等语义：

```js
function a(foo) {
  with (arguments) {
    foo // 1
    arguments.foo = 2
    foo // 2
  }
}
a(1)
```

顺便提一句，在 JavaScript 1.0 中，`Object` 的实例也有这样的功能：

```js
var a = new Object()
a.foo = 1
a[0] // 1
```

所以，这就是 `arguments` 不是数组而是对象的真正原因了吧……然而，不！一个重要的问题，就在 `arguments` 支持了这个特性的 JavaScript 1.1，`Object` 刚好删除了这个特性，这至少说明 Eich 还是认为 `arguments` 和对象不是一回事。

<br>

其实，真实的原因非常简单：前文也提到了，函数的 `arguments` 属性来自于 JavaScript 1.0 版本，而在这一版本中，**还没有实现出数组这个东西**！尽管在 JavaScript 1.0 中就已经有了 `Array` 函数，但它和 `Object` 唯一的区别是：调试时显示的字符串是 `[object Array]`。没错，没有原型方法，没有 `length` 属性，它就是一个普通的对象！

直到 JavaScript 1.1，`Array` 才被完整地实现。

> 参考：
> https://cn.history.js.org/part-1.html#%E5%AF%B9%E8%B1%A1
> https://cn.history.js.org/part1.html#%E5%AF%B9%E6%95%B0%E5%80%BC%E5%B1%9E%E6%80%A7%E9%94%AE%E7%9A%84%E7%89%B9%E6%AE%8A%E5%A4%84%E7%90%86

## `Array.of` 和 `===`  {#array-of-and-triple-equals}

这两个放在一起说是因为它们非常类似，区别仅在于诞生的时间。

先说 `===`，我们都很熟悉，JS 有两套等值判定：`==` 和 `===`（实际上是三种，还有 `[SameValue]` 也就是 `Object.is`，一度几乎成为类似于 Python 的 `is` 关键字）。二者的区别主要在于是否进行隐式类型转换。

早在 JavaScript 1.0 和 1.1 时期，彼时的 JS 只有 Eich 一名开发者，JS 也还只有 `==` 一套判定方式，那时的 Eich 就意识到了 `==` 的隐式类型转换是一个坑。于是之后在 JavaScript 1.2 中，Eich 和新的 JS 开发组决定将 `==` 的行为修改为接近如今我们看到的 `===` 的样子。

不幸的是，IE 3 发布了，并且内置了 JScript 作为 JavaScript 的另一种实现，而在这一点以及其他很多地方都与 Netscape 的 JavaScript 不一致。为了避免这种情况，Netscape（天真地）与 Microsoft 共同组建了 JS 语言规范小组，也就是我们现在所知道的 TC39。

在 ES3 标准制订期间，来自 Microsoft 的 Katzenberger 第一次发现了对语言的修改会造成对现行网站的破坏，也就是所谓的 Web Reality，而他指出的正是 `==` 的类型判断这个特性。Eich 接受了这个观点，并在 JavaScript 1.3 中回滚了这一改动。随后 TC39 开始制订 ES3，并给出了 `===` 这个解决方案。

<br>

值得一提的是，在 JavaScript 1.0 中，Eich 还实现了一个特性，就是将 `if (a = b)` 视为 `if (a == b)`。你可能会感叹 Eich 作为程序员的经验如此实际，然而实际上这个特性来（chao）自于 GCC。而我们现在之所以不知道这个特性的存在，也是因为 JavaScript 1.3 遵循了 ES3 而移除了这个特性。

另外，关于 Katzenberger 这个人，为什么作为一个 Microsoft 的工程师，会对 Netscape 的 JavaScript 如此了解？因为这个人主导了 IE 3 的 JScript 支持工作，并且通过反编译 Navigator 发现了很多 Navigator 和 JavaScript 的问题。这成为了推动 TC39 成立的原因之一。

<br>

至于 `Array.of`，可能并不是所有同学都熟悉。它来自于 ES2015，其作用是将所有参数构造为一个数组：

```js
Array.of(1, 2, 3) // [1, 2, 3]
```

你可能会说，我直接用 `Array` 构造函数不就完了嘛？前文提及，`Array` 构造函数来自于 JavaScript 1.1，当时为了保持便捷（以及看起来更像 Java），当 `Array` 只接受一个参数时，这个参数将作为数组的长度。如你所见，这个行为至今仍然存在。

很多情况下这个行为都是一个坑。同样是在 JavaScript 1.2 中，`Array` 构造函数被修改为总是使用参数构造一个数组。然后又因为上面的原因，在 JavaScript 1.3 中被回滚。

不同于 `===`，直到近 20 年后，ES2015 才重新给出这个问题的解决方案：`Array.of`。

> 参考：
> https://web.archive.org/web/19970630092741/http://developer.netscape.com:80/library/documentation/communicator/jsguide/operator.htm

## `'use strict'` {#use-strict}

如果说 ES2015 体现了 JS 语言在激进和保守中的平衡的话，ES5 可以说是保守性的典范了，以至于只有两个语法变动：Getter/Setter 和**严格模式**。

严格模式给了开发者主动禁用部分语言能力，以减轻解释器负担的机制，在 JS 里也算是史无前例了，尽管我觉得它可能受到了最早的 JS 方言：ActionScript 3 的严格模式的启发。不过也侧面反映出在多年的发展里 JS 积累了多少坑……

说到严格模式的语法，大家应该基本都见过，只需要在脚本或者函数体的顶部加上一个 `'use strict'`。对 Web 生态有感触的同学可能会认为这是一个不错的创意：将字符串字面量作为新语法，既能兼容旧的解释器，又能实现新功能。

<br>

说到这儿，有的同学可能会提出宝贵的反对意见：`'use strict'` 不能算是“语法”吧？最多算是一个代码标识？有两个方面：

- 严格模式不一定需要这个语法。例如对于 ESModule 文件默认就会启用严格模式。
- 对于符合严格模式要求的文件，这个字符串是完全自由的，加上或者删掉都没事儿。

但是，第二点真的如此吗？现在我们可以打开控制台，然后输入：

```js
(function (...args) { 'use strict' })()
```

怎么报错了？竟然还是语法错误？难道上面的代码不符合严格模式吗？

<br>

实际上，正是由于如此保守的设计，才导致了严格模式指令没能做到完美的“向前兼容”。

在严格模式语法设计之初，考虑到作用粒度的问题，`'use strict'` 指令支持了脚本范围和函数范围两种方式。脚本范围没有问题，但函数范围在当时就已经存在兼容问题了：

```js
function a(let) { 'use strict' }
```

按照严格模式的要求，`let` 这样的保留字不能作为参数名和变量名，毕竟为了向前兼容嘛。但是这对于解释器的实现却是一件难事，因为这意味着**后面的语句会影响到前面的语法是否正确**。

当时解释器的实现通常是：在解析函数的时候，额外记录下函数名、参数名信息，然后在之后识别到严格模式指令时再判断是否报错。毕竟只是存储几个名字也没什么成本。

但很快，在 ES2015 诞生之前，某些解释器就已经开始实现**参数默认值**这样的特性了。

```js
function a(foo = function b() {}) { 'use strict' }
```

那么问题来了，在这个例子里，函数 b 需要遵循严格模式吗？当时并没有确定的结论，但在 ES2015 规范中，规定了这种情况也需要遵循严格模式。

这下芭比 Q 了。这甚至不只是存储的问题了，连实现都变得困难起来。当时 SpiderMonkey 的实现就反复修改了几次，最终实现为：先正常解析，如果遇到 `'use strict'`，就再回去重新解析一遍。

现在压力来到了 V8 这边（Trident？还需要考虑它吗？）。V8 经过讨论，最终达成的结果是……

是……

<br>

在 ES2016 中，规定了对于包含默认值和剩余参数的函数（也就是包含 ES2015 新语法的函数），禁止使用 `'use strict'` 指令，也就是我们现在看到的这样。

毕竟，本来就是为了降低编译器成本的东西，你搞这么复杂，不是适得其反嘛？

> 参考：
> https://web.archive.org/web/20070814045117/http://www.crockford.com:80/javascript/recommend.html
> （备注：Crockford 也是一位对 JS 产生深远影响的大佬：JSON 的创造者和《JS 语言精粹》的作者）
> https://bugzilla.mozilla.org/show_bug.cgi?id=769072

## 关于注释 {#comments}

一个小问题：JS 有几种注释格式？

在我学习前端的时候，有个网站我总能搜到，他叫 w3cschool。就在刚才，我在 Google 里面搜索【JS 注释】，它依然在很靠前的位置。我点开一看，上面写了有两种：单行注释 `//` 和多行注释 `/**/`。

但是有一些年长的前端工程师可能会知道，实际上 JS 还有另一种单行注释，是以 `<!--` 开头的。

<br>

年轻的同学此时会问：啥？这不是 HTML 注释吗？而且应该是多行注释吧？`<!--` 和 `-->` 一对儿。
别着急。事情的经过是这样的：

<br>

JavaScript 1.0 是随着 Navigator 2 一起发布的，也就是在这时，HTML 才开始有了 `<script>` 这个标签，但在当时，互联网已经存在不少 Web 页面了，毕竟在那个年代，没有 JS 也没什么大不了的，就像我们现在写 Markdown 一样。所以 Navigator 2 就面临一个问题：如果开发者用了 `<script>` 标签，那岂不是对于其他浏览器，这个标签的内容就直接像 `<span>` 一样展示出来了吗？

Eich 可不是普通人。他指出，开发者可以用这种方式实现对其他浏览器的兼容：

```html
<script>
<!--
alert('hello')
-->
</script>
```

这样旧浏览器就把脚本的内容当做是 HTML 注释不展示了。

<br>

但是现在又有新问题了：`<!--` 和 `-->` 也不是 JS 语法啊。Eich 表示，只要让 JS 支持 `<!--` 开头的单行注释就行了，至于 `-->`，只要前面加个 `//` 就完事儿了。

```html
<script>
<!--
alert('hello')
// -->
</script>
```

这样不论浏览器是否支持 `<script>`，上面的代码都能正确被解析了。

但尽管如此，这个语法从来都不被认为是 JS 语言的一部分，因为 JS 一直认为自己是一门独立的语言，并不受到 HTML 的影响，哪怕这个用法早已被广泛使用了。

直到 ES2015 开始，JS 终于认清了现实，开始将一些广为使用的“特性”正式列入标准。除了前端都见到过的 `__proto__` 属性，还有就是 `<!--` 单行注释语法了。

> 参考：
> https://www.w3school.com.cn/js/js_comments.asp

## 关于 DOM {#dom}

### `document.all` {#document-all}

思考一下，如何构造一个符合下面条件的值：

```js
let a = ?

typeof a // 'undefined'
Boolean(a) // false

a instanceof Object // true
```

符合前两个条件的值你肯定能想到 `undefined`，但是第三个……这可能吗？这意味着 `a` 是一个对象，但是它的类型竟然是 `undefined`？这真的是 JS 吗？

<br>

这个问题要再次回到 Navigator 和 IE 争锋的年代了。在当时，为了和持有正统 JavaScript 的 Navigator 抗衡，IE 迅速推出了 IE 4。尽管 ES3 已经定义了 JS 语言的规范，但是 DOM 还是可以随便加功能的。于是 IE 实现了一个超级方便的 API：`document.all`。

`document.all` 的值是一个 `HTMLAllCollection`，这意味着：

- 它包含了页面内的所有元素
- 它是随着页面结构变化动态变化的
- 你可以用 `document.all.foo` 访问 `#foo` 元素，也可以用 `document.all.namedItem('foo')` 访问 `[name='foo']` 元素

初级前端工程师直呼好用，线上代码安排起来：

```js
document.all.foo.style.color = 'red'
```

高级前端工程师更加谨慎：不能完美兼容的代码我不用，不过我刚好可以用它判断环境：

```js
if (typeof document.all !== 'undefined') {
  alert('It is IE!')
}
```

就这样，IE 随后发布了 5 和 6，并最终将 Navigator 消灭。在这期间，有一个浏览器趁乱发育，它的名字叫 Opera。Opera 对标 IE 实现了 `document.all`，以支持那些初级前端工程师写的网站。

但是问题来了，这回高级前端工程师写的网站没法在 Opera 上运行了。Opera 表示这回我真的无能为力了，这最终导致 Opera 仍然竞争不过 IE。

<br>

直到 Navigator 最终换了 Firefox 的马甲残血复活。作为 Firefox 的开发者，Eich 表示我们要夺回属于我们的一切！于是 Firefox 也实现了 `document.all`，但聪明的 Eich 在这里 Hard Code 了一下：我们支持 `document.all`，但是：

```js
typeof document.all // 'undefined'
Boolean(document.all) // false
```

于是 Firefox 在不破坏现行网络的情况下完美兼容了初级和高级前端工程师编写的网站。

<br>

不久后，Safari 也开始参与角逐。Safari 参考 Firefox，在 Webkit 中用同样的方式实现了 `document.all`。这直接影响了使用 Webkit 的 Chrome，及其 JS 引擎 V8。

浏览器大战随着 Chrome 的参战又一次打响。Opera 带着它最后的倔强将 `typeof document.all` 改成了 `'undefined'`。所有浏览器终于决定一起对抗 IE，并成功地将这个行为写进了 HTML5 规范中。

<br>

故事的最后是 IE。为了兼容 Chrome 的特性，IE 11 也将 `typeof document.all` 改成了 `'undefined'`。

很快，ES2015 也发布了。前面也说到，这时的 JS 规范终于认清了现实，于是规定了语言内的值可以拥有 `[IsHTMLDDA]` 这个内部属性，如果拥有该属性，则 `typeof` 运算符返回 `'undefined'`，`ToBoolean` 的值返回 `false`。

谁说 DOM 不能反过来影响 JS 啦？

> 参考：
> https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#the-htmlallcollection-interface
> https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot

### 全局变量 {#global-variables}

有经验的同学在阅读前面一小节时可能会有一个疑问：我们不是已经有全局访问 `id` 的方式了吗？为什么还需要 `document.all`？

为了防止大家不理解，这个特性是这样的：

```html
<div id="foo"></div>

<script>
window.foo // [object HTMLDivElement]
</script>
```

如你所见，具有 `id` 属性的元素会直接变成 `window` 对象的属性，也意味着它成为了一个全局变量。并且正如你此刻所想的，这个特性，它最早也是 IE 实现的。
和之前的故事一样，Opera 抄了 IE，Firefox 抄了 IE，Safari 抄了 Firefox，Chrome 继承了 Safari，最终成为了标准……但是，这就结束了吗？

<br>

与 `document.all` 不同的是，全局变量不仅仅包含具有 `id` 属性的元素，还有可能是 `name` 属性：具有 `name` 属性的 `embed` `form` `frame` `frameset` `iframe` `img` `object` 元素也会成为全局变量。

先别急着感叹，现在也许你也开始习惯想问：为什么？

<br>

不管是 TC39 还是 W3C，它们都是为了【**统一**】这件事情本身而产生的，在这个例子里面，对应的就是 Navigator 和 IE 的统一。

看起来好像没什么关联是吧？实际上，`id` 这个属性就是 IE 带来的，在这之前，Navigator 一直用的是 `name` 属性。但是 `name` 不唯一，且缺少与样式表的直接关联，因此 W3C 将非表单元素的 `name`（也就是上面提到的那些元素）标记为已弃用，但仍然保留在了规范之中。

Navigator 并不能接受这样的结果，直到它的覆灭。而那个一直包容着它的、伟大的竞争对手 IE，选择接受了曾经一起建造出来的规范，将它的精神传承了下来，并最终带入了 HTML5。

> 参考：
> https://html.spec.whatwg.org/multipage/window-object.html#named-access-on-the-window-object

## 思考题 {#thinking}

如果我们像 `Map` 对象一样，给 `Object` 原型上添加一个 `get` 方法：

```js
const a = { foo: 1 }
a.get('foo') // 1
```

这有可能会导致什么问题？

（提示：这可能与 ES5 的某个特性相关）
