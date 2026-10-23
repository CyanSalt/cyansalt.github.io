---
title: 为什么我不推荐你使用“结构化样式”
createdAt: 2025-11-25T08:26:06.000Z
---

在 Web 开发中，结构、样式、逻辑代码的组织关系是一个老生常谈的问题。当我们普遍认为“组件化”是解决工程复杂度的最佳实践时，很多人会将结构-样式-逻辑的内聚和耦合混淆起来。以样式为例，一种常见的情况是这样的：

```css
.list {
  /* ... */
}
.list .list-item {
  /* ... */
}
```

当然这只是一个使用基本 CSS 的例子。如果你使用 Less/SCSS/Stylus，可以构造出更加“结构化”的代码，但它们本质上并没有不同。

今天想要和大家一起讨论的就是，为什么我觉得这是一种不好的设计，以及在当下，如何解决复杂样式的抽象问题。

## 白马首先是马，还是白色的东西？ {#is-a-white-horse-foremost-a-horse-or-a-white-thing}

这里请让我举一个很常见的例子。为了更好地表达现代工程中可能出现的问题，下面我会使用 SCSS 作为示例。

假设我们的组件是一个卡片，卡片中有一个徽标。我们很容易写出这样的实现：

```scss
.card {
  display: flex;
}
.badge {
  appearance: none;
}
```

现在我们需要实现一个特性：当卡片处于禁用状态时，徽标的透明度将会提高。接下来，我们有两种选择：

第一种是：**卡片的禁用状态与卡片直接相关**，因此这个需求应该是：

```scss
.card {
  display: flex;
  &.is-disabled .badge { // [!code ++]
    opacity: 0.5; // [!code ++]
  } // [!code ++]
}
.badge {
  appearance: none;
}
```

第二种是：**尽管禁用是卡片的状态，但本质上我们是在实现一个徽标的变体**。因此应该实现为：

```scss
.card {
  display: flex;
}
.badge {
  appearance: none;
  .card.is-disabled & { // [!code ++]
    opacity: 0.5; // [!code ++]
  } // [!code ++]
}
```

你认为比较合理的是哪一种呢？

---

如果这个例子不那么直观，我们可以将它扩展一下。在一个复杂的项目中，我们可以给出更多条件：

- 徽标本身就有透明度设置
- 卡片中除了徽标，还有更多结构

于是这个代码可能是：

```scss
.card {
  display: flex;
}
.header {
  /* ... */
}
.body {
  /* ... */
}
.badge {
  appearance: none;
  opacity: 0.8;
}
```

不装了，我摊牌了，其实我就是【第二种方式】的鼓吹者。因为只有把同一个元素在不同条件下的样式都放在一起，才能确保该元素的样式能够得到统一维护。

本质上，`.card.is-disabled &` 相当于是 `.badge` 的“Props”，我们总是应该尽可能把针对 Props 的逻辑放在组件内部，而不是在父组件完成处理再传入一个大的 `children` 进来（你会这么做吗？）。

## 你首先是你自己，然后才是…… {#you-are-first-yourself-and-then-others}

这个例子和我说的“结构化样式”有什么关系呢？当然有。我在示例中使用的样式都是“扁平化”的，假设我们采用嵌套的形式编写，它可能会是：

```scss
.card {
  display: flex;
  .header {
    /* ... */
    .badge {
      appearance: none;
      opacity: 0.8;
    }
  }
  .body {
    /* ... */
  }
}
```

那么此时，我应该如何将 `.card.is-disabled &` 条件添加到已有的样式里呢？

当然，你可以觉得，既然这样，那在这种条件下，我们就不要使用层层嵌套的形式了嘛，直接把它挪到外面，这样我们也不用纠结前面讨论的问题了！

```scss
.card {
  display: flex;
  .header {
    /* ... */
  }
  .badge {
    appearance: none;
    opacity: 0.8;
  }
  &.is-disabled .badge {  // [!code ++]
    opacity: 0.5;  // [!code ++]
  }  // [!code ++]
  .body {
    /* ... */
  }
}
```

那么在这里，我的问题是：凭啥？为什么我需要为了增加一个变体，改变原有的样式结构，甚至**影响到样式的优先级**？

这里我想表达我的第二个观点：**我们总是应该保持工程样式的最简化**。这不仅是为了可读性，同时也是“面向结构的样式”和“面向元素的样式”之间的 PK。我的意思是，即使不使用嵌套，我也不会使用下面的写法：

```css
.card {
  /* ... */
}
.card .header {
  /* ... */
}
.card .header .badge {
  /* ... */
}
.card.is-disabled .header .badge {
  /* ... */
}
```

在上面的这些例子里，`.badge` 不因 `.card` 和 `.header` 而存在，尽可能保持非结构化更有助于我们在原本的样式中进行状态派生，而无论状态改变发生在哪个元素上；更何况，简单的样式能够让我们尽可能避免为了解决样式冲突而产生的 `.badge.badge.badge` 或者 `!important`。

## BEM 是组织样式代码的方式吗？

在上面的例子里，我始终没有聊到的一个原因是**打包体积**。一旦我们讨论到体积问题，反驳者会提出这样的东西：

```scss
.card {
  &-header {
    /* ... */
    &-badge {
      /* ... */
    }
  }
}
```

仿佛这样就用他们想要的样子实现了“扁平化”。从我们前面讨论的例子不难看出，这实际上和 class 嵌套并无二致。反对者可能会拿出 BEM 来反驳，并指出它是曾经很多主流组件库的“标准”：

```scss
.card {
  &__header {
    /* ... */
    &__badge {
      /* ... */
    }
  }
}
```

而我想指出的则是：**BEM 不是用来组织样式代码的**！BEM 的唯一作用是“命名”。它诞生的时候之所以流行，是因为解决了这些问题：

- 因为 HTML 的元素过于“裸”，我们不得不在很多层级上添加很多元素，于是结构里出现了很多 .container、.wrapper、.content、.body……
- 由于 CSS 的“Cascading”性质，我们总是希望尽量避免 class 名称的冲突，于是一种唯一性的生成逻辑可以最低成本帮助我们规避命名冲突

所有的这些优势，都和结构-样式的关联无关，BEM 最初就是为了解决命名问题。如今我们有 CSS Modules，有 Scoped CSS，有各种 CSS-in-JS 方案，命名的问题早就不存在了，BEM 现在主要的作用变成了降低命名成本，毕竟——

> There are only two hard things in Computer Science: cache invalidation and naming things. —— Phil Karlton

## 预处理：CSS 的遗产

既然讨论到 BEM，我们不得不聊到 CSS Nesting。如果你还不知道，Chrome 120 也就是 2023 年开始，浏览器开始原生支持样式嵌套：

```css
.badge {
  appearance: none;
  .card.is-disabled & {
    opacity: 0.5;
  }
}
```

它等价于 `:is(.card.is-disabled) .badge`。使用 CSS Nesting 或许是一种历史趋势，因为 Sass 团队一直在致力于使 SCSS 的嵌套与 CSS 兼容，即使其再次成为 CSS 的超集。

但是如果你也想使用它，你必须知道：

- 不是所有的 SCSS 嵌套语法在 CSS 中都支持，例如这个：
    ```css
    .card {
      &__badge {
    /*^ 这是一个语法错误 */
      }
    }
    ```
- CSS Nesting 的优先级与 SCSS 有一点不同。这种不同会随着嵌套层数增加变得更加明显。关于这一点，我推荐你阅读 [CSS Nesting, the `:is()` pseudo-class, and a guide to panicking about Sass](https://blog.frankmtaylor.com/2024/07/18/css-nesting-the-is-pseudo-class-and-a-guide-to-panicking-about-sass/)。

因此，从向前兼容的角度，使用扁平化+非结构化 CSS 也是一种更好的选择。当然，扁平-嵌套的问题，已经有很多人讨论过了，这并不是我们今天要聊的重点；不过，使用扁平化样式会让我们自然而然使用“非结构化”样式，尽管这两者没有强烈的联系。

## TailwindCSS 和内联样式

在这里我想讨论的另一个问题是，怎样脱离结构声明样式？

一个反直觉的事实是，“CSS 命名”本身就是在和结构耦合。当我们写下

```css
.card {}
```

实际上就预设了这个元素的某种“结构”——它是一个卡片，所以它可能会有头部、主题内容，甚至带点交互。所以这里可能比较让人难以接受的事实是：真正的“非结构化样式”其实就是**内联样式**。

---

不论是 Styled Components 还是 CSS Modules，这些方案本质上都是在用“非结构化样式”代替“结构化样式”，实现的方式就是“避免 CSS 命名”。实际上他们都是在做这样的事情：

```tsx
const card = 'display: flex'
const header = 'font-weight: 500'
const badge = 'opacity: 0.7'

return (
  #div style={card}#
    #div style={header}#
      #div style={badge}##/div#
    #/div#
  #/div#
)
```

和直接写 CSS 的区别在哪里呢？难道只是 `class` 变成了 `style` ？

——其实最大的区别就是，CSS-in-JS 是“不 Cascading 的”，我声明的标识符 card 就是唯一的，只在我使用它的地方生效，而不会应用在其他的元素上。对于 Web 应用来说，这种有限的预期才是我们通常想要的。这也是我讨论“非结构化”的初衷。

---

所以，就像很多批评的声音一样，TailwindCSS 是不是就是内联样式？没错。但是这就是我们想要的。内联样式（非结构化样式）就是比语义化样式（结构化样式）更适合现代前端工程，正因如此 TailwindCSS 才会越来越流行。所以，如果你还不能接受内联样式和 TailwindCSS，先从淘汰掉你的“结构化样式”开始吧。
