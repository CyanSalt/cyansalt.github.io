---
title: 不要使用 DOM 的 onxxx 属性的第一万个理由
createdAt: 2022-08-17T03:09:31.000Z
---

直接来。首先创建一个 HTML 文件用于测试：

```html
<input onclick="console.log(body)">
```

保存成一个 test.html 文件，然后拖动到 Chrome 中

![input](https://ik.imagekit.io/cyansalt/2022/do-not-use-dom-onxxx/0001-input.png)

点一下，猜猜看控制台会打印什么呢？

<br>

小明：我知道！这里没有 body 变量的定义，所以会直接报错！TypeError: body is not defined 对不对？

![body](https://ik.imagekit.io/cyansalt/2022/do-not-use-dom-onxxx/0002-body.png)

咦，竟然打印出了 body 元素！

---

小明：我现在全明白了，原来**元素的 onxxx 属性里实际上可以访问到 document 的属性作为变量，就像是我们任何地方都能访问 window 的属性作为变量一样！**

好的小明，我们来改一下

```html
<title>ok</title>
<input onclick="console.log(title)">
```

这次打印出来什么？

小明：是 ok！对吧？对……对吗？

![empty-string](https://ik.imagekit.io/cyansalt/2022/do-not-use-dom-onxxx/0003-empty-string.png)

猜猜看，为什么？

---

只需要简单修改一下代码，就能够发现这个问题了：

```html
<title>ok</title>
<input onclick="console.log(title)" title="ko">
```

![title](https://ik.imagekit.io/cyansalt/2022/do-not-use-dom-onxxx/0004-title.png)

小明：哦！原来如此！所以 **onxxx 访问变量的时候，会先在元素本身的属性上查找，没有的话就会找到 document 和 window**。

---

为了继续调戏小明，我们再来修改一下代码：

```html
<form action="mailto:x">
  <input onclick="console.log(action)">
</form>
```

![action](https://ik.imagekit.io/cyansalt/2022/do-not-use-dom-onxxx/0005-action.png)

小明：哎，我怎么一下子没想到，显然 **onxxx 访问变量在发现本身没有该属性的时候，会沿着 DOM 结构向上查找，最终找到 document 和 window 上！**

---

小明小明，你再来看看：

```html
<label for="me">
  <input onclick="console.log(htmlFor)">
</label>
```

![html-for](https://ik.imagekit.io/cyansalt/2022/do-not-use-dom-onxxx/0006-html-for.png)

小明：我 X？为啥？？没天理了？！！

---

小刚：小明你起开，让我来！

```html
<input onclick="debugger">
```

![debugger](https://ik.imagekit.io/cyansalt/2022/do-not-use-dom-onxxx/0007-debugger.png)

小刚：小明你过来看看，实际上是 **onxxx 被浏览器包裹在多个 with 块中执行的，并且可能有多个**。

小明：切，这跟我说的有啥区别？

小刚：

```html
<input onclick="domain='gang.nb.com'">
```

![domain](https://ik.imagekit.io/cyansalt/2022/do-not-use-dom-onxxx/0008-domain.png)

小明：对哦，所以**实际上不仅能读取这些属性，还能够对其修改**！万一我不小心修改了刚才的 action 这种属性，岂不是连请求地址都错了！

小刚：你再好好读读 https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-content-attributes 吧，别再摸鱼了。

![html-spec](https://ik.imagekit.io/cyansalt/2022/do-not-use-dom-onxxx/0009-html-spec.png)

小明：小刚牛笔！
