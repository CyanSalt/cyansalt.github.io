---
createdAt: 2024-04-07T03:46:28.000Z
---

# 如何实现监听 CSS 变量？

先来看下这个效果（把 demo 写出来之后才发现效果还挺炸裂的）：

<video src="https://github.com/CyanSalt/notebook/assets/5101076/d8f8ec89-b82c-4770-b001-5f4b1bb03bb6" controls></video>

这相当于将 CSS 变量与 JS 彻底打通了。传统意义上我们似乎只能通过 JS 控制 CSS，但是看起来实际上也是可以反过来的。

## 怎么做到的？ {#how}

这个问题乍一想可能不难，但再想想可能也没那么简单。

### 方案一？ {#how-1}

有的同学可能知道 DOM 有一个 `getComputedStyle`，它会返回一个“实时的” CSSStyleDeclaration。也就意味着：

```js
const style = getComputedStyle(myAnchor)
style.textDecorationLine // none
// hover anchor
style.textDecorationLine // underline
```

然而，基于一个实时的 DOM 对象，我们只能实现“在访问它的时候获取最新值”，而不能实现“在它更新时触发某个回调”。

### 方案二？ {#how-2}

对 DOM 更加熟悉的同学可能会想到 `MutationObserver`，它允许我们监听 DOM 树上的几乎任意变化：

```js
new MutationObserver(() => {
  console.log('element added or removed')
}).observe(document, { childList: true, subtree: true });
```

然而，CSS 变化并不一定，甚至通常都不是 DOM 变化引起的。典型的例子就是伪类/伪元素的改变：按钮或者链接 hover 状态下有不同的样式，此时 DOM 树并未更新，显然 MutationObserver 也无法实现监听。

### 方案三？ {#how-3}

清明堵车的时候我想到了一个答案：

有一组 DOM 事件和 CSS 息息相关，那就是 `transition*` 和 `animation*`。例如最常见的：在 CSS 过渡结束后，元素的 `transitionend` 事件会被触发。我们有没有可能利用这个特性来实现监听 CSS 属性呢？

答案是可以！

首先我们需要知道一些事实：
- 过渡必须在一个 CSS 合法的范围内进行，例如 `color` 可以从 `red` 过渡到 `blue`，但是不能从 `red` 过渡到 `1px`
- 想要触发 `transition*` 事件，过渡必须是发生过的，意味着 `transition-duration` 必须大于 0

然后我们就可以寻找一些合适的方案啦！以演示的例子为例，我们可以将 `--my-integer` 映射到任意一个语法是 `<integer>` 的 CSS 属性上，比如 `z-index` 或者 `order`

```css
.custom-integer {
  z-index: var(--my-integer);
}
```

这里有一个问题是，这可能会影响元素本身的样式。所以一个更好的方案是，我们可以构造一个伪元素来完成：

```css
.custom-integer::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  visibility: hidden;

  z-index: var(--my-integer);
}
```

然后，我们需要在元素上构造一个有时间的过渡。如果有多个值也是可以的：

```css
.custom-integer::before {
  z-index: var(--my-integer);
  transition: z-index 1ms;
}
```

CSS 中 `<time>` 仅支持 `s` 和 `ms` 两个单位。考虑到浏览器的帧率一般不会高于 120 FPS 这个数量级，设置为 `1ms` 已经足够了。

另外在事件上我们也有更好的选择。`transition*` 有几个不同的事件：

- `transitionrun` 在过渡开始时触发，也就是选择器一旦作用（例如 button 被 hover）就会触发。
- `transitionstart` 在过渡开始进行时触发，也就是样式一旦生效就会触发。主要的区别在于，此时 `transition-delay` 的时间已经过去了。
- `transitionend` 在过渡结束后触发。

根据上面的信息，我们使用 `transitionrun` 将是更好的选择。

在 DOM 中，`TransitionEvent` 具有 `pseudoElement` 属性，使用它我们可以避免元素本身对这个机制的影响：

```js
element.addEventListener('transitionrun', event => {
  if (event.pseudoElement === '::before') {
    // ...
  }
})
```

有了这些，我们就完全能实现上面的效果了！当然对于 Vue，我们也可以包装一些更实用的 Composition API 出来，比方说：

```js
function useTransitionListener(pseudoElement) {
  const timestamp = ref()
  const listener = function (event) {
    if (typeof pseudoElement === 'string' && event.pseudoElement !== pseudoElement) return
    timestamp.value = event.timeStamp
  }
  return { timestamp, listener }
}

const { timestamp, listener } = useTransitionListener('::before')

const myInteger = computed(() => {
  void timestamp // 这里触发依赖收集
  return parseInt(getComputedStyle(elementRef.value).getPropertyValue('--my-integer'), 10)
})

// 接下来只要绑定 listener 给 elementRef，并设置好样式，就能实现良好的效果咯
```

### 方案四？ {#how-4}

上面的方案有什么问题呢？问题在于，如果我有一个 CSS 语法合法，但无法对应给 CSS 现有属性的值就崩了。比如：

```css
.custom-list {
  --my-list: 1px 0 1px 0 1px 0;
}
```

不好意思，CSS 没有属性支持**以空格分隔的超过四个的长度**，并且 CSS 也无法通过 `calc()` 等方法操作列表。这样要怎么办呢？

正在实施的 CSS Houdini 帮了我们一个大忙！在 Chromium 中，我们可以通过 `@property` “定义”一个 CSS 属性，比方说：

```css
@property --my-list {
  syntax: '<length>+ | auto';
  inherits: true;
  initial-value: 'auto';
}
```

这样我们就定义了一个支持“任意长度空格分隔的长度值，或者是 `auto`，并且会继承父元素” 的属性了。然后，我们就可以直接

```css
.custom-integer::before {
  transition: --my-list 1ms;
}
```

这样就一切完美！不过还是需要注意，上述用法仍然处于试验中，且只有 Chromium 支持。

## 应用场景 {#application}

说了这么多，有什么用呢？可以看下 https://roughness.vercel.app/ 关于样式的支持。当样式改变时，SVG/Canvas 可以自动重新绘制，也许这就是未来自定义元素的工作方式。
