---
title: TypeScript 开发技巧
createdAt: 2020-09-03T08:00:00.000Z
---

## 写在前面 {#intro}

本文假设读者有基本的 TypeScript 常识，如果你对于 TypeScript 本身完全不了解，建议先阅读 https://www.typescriptlang.org/docs/handbook/basic-types.html

本文不包含体操项目，如有需要请自行锻炼。

## 为啥要用 TypeScript ？ {#why}

这可能是最老生常谈的一个问题。类型系统的好处有很多：

- 可读性
- 工具链（编辑器自动提示、更精确的 Lint 等）
- 重构（例如，想要给某个变量改名，又怕漏掉）

以上好处都很明显，但同时，类型系统也有一些潜在的好处。例如，当你发现你的类型无法利用 TypeScript 声明时，一定程度上说明接口的设计是类型不友好的，或者说比较晦涩/容易出错，例如，Vue@2.x

但一定得注意：**TS 不会做任何运行时的校验**，所以如果你的代码最终会被编译成 JS，又有可能被 JS 代码调用，还是需要做好代码防御的。

## 怎么写类型 {#how}

最简单的，大家都会写的形式，就是声明+冒号+类型：

```ts
// code.js
const num = 1;
function setNum(value, defaultValue = 0) {
  num = value || defaultValue;
}

// code.ts
const num: number = 1;
function setNum(value: number, defaultValue: number = 0): void {
  num = value || defaultValue;
}
```

简单地说，就是在任何**声明变量**的地方（import 除外），以及**函数返回值**，在变量名的后面加上 :类型，就完事儿了！

对于函数而言，一种方式是通过参数和默认值声明，就像上面一样。同时你也可以写一个声明语句，例如：

```ts
const num: number = 1;

function function(value: number, defaultValue?: number): void

function setNum(value, defaultValue = 0): void {
  num = value || defaultValue;
}
```

> 上面的 ?: 代表这个参数可以不传的意思

### 类型推导 {#type-inference}

如果只是这样，那 TS 就太辣鸡了。TS 的一个比较优越的地方就是，如果我们假设代码是**静态类型**的，那么很多地方的类型就不需要我们自己声明了，就像 Java 中也有类似的机制。所以上面的代码其实只要这样就可以了：

```ts
// code.ts
const num = 1;
function setNum(value: number, defaultValue = 0) {
  num = value || defaultValue;
}
```

（注意 value 这个参数的类型无论如何也推导不出来，所以还是要自己声明）

### 对象和函数类型 {#objects-and-functions}

TS 也提供了 `interface` 语法来声明一些非 JS 内置的类型，例如

```ts
interface MyObject {
  key: string;
  name: string;
  value: number;
}

interface MyFunction {
  (value: number, defaultValue: number): void;
  staticProp: number;
}

interface MyClassInterface {
  constructor(value: number): MyClass;
  // 这里有一种老的写法是 new (value: number)，不过现在不太建议这么写了，类型匹配会有困难
}
```

同时也有一个 `type` 关键字，上面的类型也可以写成

```ts
type MyObject =  {
  key: string;
  name: string;
  value: number;
}

type MyFunction = (value: number, defaultValue: number) => void & { staticProp: number };

type MyClass = {
  constructor(value: number): MyClass;
  // 这里有一种老的写法是 new (value: number)，不过现在不太建议这么写了，类型匹配会有困难
}
```

（上面这些换行前的符号写成逗号也是一样的，神奇吧？）

两者看上去都可以完成一样的事情，事实也基本如此。但是还是会有一些细微的差别：

- `interface` 有一种 `implements` 的用法（下面这个例子实际上 `type` 可以通过改写成赋值语句的形式完成）

```ts
interface MyClassInterface {
  setValue(value: number): void;
}

class MyClass implements MyClassInterface {
  // 如果没有 setValue 就会报错
}
```

- `interface` 可以 `extends`（下面这个例子实际上 `type` 可以通过 `&` 运算完成）

```ts
interface A {
  key: string;
}

interface B extends A {
  name: string;
}
```

- `type` 可以把类型声明成基本类型，还可以使用类型运算

```ts
type MyProp = string

type MyKey = string | number | symbol
```

- `interface` 可以用[索引签名](https://bytedance.feishu.cn/wiki/wikcnNlnC6xWMrIAVB1LnWmlgJb#jxyS1D)
- `type` 可以用更高级的[类型参数](https://bytedance.feishu.cn/wiki/wikcnNlnC6xWMrIAVB1LnWmlgJb#n5bUkT)

从实现上来说，`interface` 是声明了新的类型，而 `type` 只是类型的别名，有一点点像值和引用的区别。

### 常量类型 {#constants}

TS 的类型有时候如同你想象中一样工作，所以，如果想不出来的话，可以写下来试试

```ts
type A = true // A 类型的变量就必须得是 true
type B = 'oops' // B 类型的变量就必须得是 oops
type C = [string, number] // C 类型的变量就必须得是一个数组，必须得有两个元素，必须分别是 string 和 number
```

### 枚举 {#enums}

没啥可说的，自己看文档就好了 https://www.typescriptlang.org/docs/handbook/basic-types.html#enum

### 奇奇怪怪的类型 {#utilities}

最经典的大概就是 `any` 了。鲁迅曾经说过，如果你不知道怎么写 TS 类型，那就写 any 就完事了。当然实际上这样做会被打的。

`any` 是顶层类型也是底层类型，也就是说，**啥都是 `any`，`any` 也啥都是**。比方说

```ts
// 啥都是 any
function myFunction(value: any) {}
let v: number
myFunction(v) // OK!

// any 啥都是
function myFunction(value: number) {}
let v: any
myFunction(v) // OK!
```

也因为如此，**使用 `any` 等于放弃了类型**。并且很重要的是，**`any` 具有传播性**，也就是说，`any` 和任何类型的联合类型都是 `any`，比如 `any | number`。所以，尽量避免使用 `any`，除非明确地知道就是没有类型

除了 `any` 之外另一个常见的类型是 `unknown`，这俩有点像，但是 `unknown` 的提出就是为了解决 `any` 的各种问题的。

`unknown` 是顶层类型，但不是底层类型，也就是说，**啥都是 `unknown`，`unknown` 啥也不是**。比方说

```ts
// 啥都是 unknown
function myFunction(value: unknown) {}
let v: number
myFunction(v) // OK!

// unknown 啥也不是
function myFunction(value: number) {}
let v: unknown
myFunction(v) // TS error
```

尽管 `unknown` 同样有传播性，但是“unknown 啥也不是”限制了它实际使用时必须要强制类型声明，通常来说，这意味着 `unknown` 不太会被滥用。一般来说，如果你发现一个**函数的返回值没用到**，那么就用 `unknown` 就对了。

`never` 是一个看起来和他俩没关系，但实际上又有点关系的东西。`never` 是实质上的底层类型，也就是说，**啥都不是 `never`， `never` 啥都是**。 通常在 TS 里面， `never` 表示一个不可能出现的类型。比方说：

```ts
type A = true & false // never

function foo(): never { // no error
  throw new Error()
}
```

所以，如果你期待一个分支逻辑永远不可能走到，那么就可以为这个分支的变量、类型或者是返回值声明类型 `never`

> 从集合论的角度来看，`never` 实际上是类型领域的 ∅，而 `unknown` 是全集。`any` 某种程度上可以理解为所谓的“全部集合构成的集合”，也就是罗素所指的极限类。在 ZF 公理系统中，由于正则公理的存在，这样的东西并不是一个集合，因为它涉及一个无法良定义的自指。这也可以强行解释为啥不要用 `any`

另外还有一个内置类型是 `void`。这个类型曾经是用来解决没有 `unknown` 时的一系列问题的，简单地说，`void` 作为函数类型的返回值时是顶层类型，作为独立类型则等价于 `undefined`。也就是说

```ts
type A = () => void

const a: A = () => true // no error

function foo(): void {
  return 1 // error
}

function bar(): void {
  return undefined // no error
}
```

目前来说应当尽量避免使用 `void` 类型，通常来说应该使用 `undefined`；而对于二者不同的情况，使用 `unknown` 是更加安全的选择。

### 类型运算和类型参数 {#operations-and-type-parameters}

在上面的例子里你可能看到过了，类型支持一种像是位运算的东西，就是与或操作符：

```ts
type A = string | number // 要么是 string，要么是 number
type B = A & (number | symbol) // 现在 B 只能是 number 了
```

> 注意类型是没有非这个操作的，如果要实现这个效果就要用到 `extends` 或者是内置工具类型了

除了这俩操作符之外，你还可以用这些东西：

- 下标操作符

```ts
type A = { name: string }
type B = A['name'] // string
```

注意不能写成 `A.name` 哦！

- `keyof` 操作符

```ts
type A = { name: string }
type B = keyof A // 'name'
```

有聪明的小朋友会问了，那有没有 `valueof` 呀？

你看看这样行不：

```
type A = { name: string }
type B = A[keyof A] // string
```

你觉得不好用？那等会儿你再看看（

- `typeof` 操作符

```ts
let el: HTMLElement
type A = typeof el // HTMLElement
```

（其实还有一些其他的关键字操作符，但实际使用的场景极少）

然后你发现，哦豁，这样的话类型有点像一种变量似的，可以声明，又可以运算，就差整一个给类型用的函数了。

这个真有！如果你写过 C++ 的话，这就和传说中的模板一样：

```ts
type A<X, Y> = X | { name: Y }

type B = A<string, number> // string | { name: number }
```

你甚至可以写参数的默认值

```ts
type K<Value, Key = string> = Value[Key]
```

甚至是“类型的类型”（使用 extends 限定类型参数的类型）

```ts
type K<Value, Key extends keyof Value> = Value[Key]
```

于是刚才说的 `valueof` 终于有了着落：

```ts
type ValueOf<T> = T[keyof T]
```

### 访问修饰符 {#access-modifiers}

在 TypeScript 世界里你可以声明一些仅限于编译期的限制，例如 `private`：

```ts
class Foo {
  private name: string;
}
```

这样外部就不能访问 `Foo` 实例的 `name` 属性了。同理也可以使用 `protected` 和 `public`。

除了这些之外还有一个很常用的是 `readonly`：

```ts
interface Bar {
  readonly id: string;
}
```

这样就可以表示 `Bar` 类型的对象的 `id` 是不能被修改的

## 类型匹配 {#type-matching}

有没有思考过一个问题，TypeScript 和 Java 的类型系统有哪里不一样？如果你够敏感的话，从上面的例子可能会发现一些端倪。

假设我给我的函数声明了一个类型：

```ts
interface MyInterface {
  name: string
}

function printName(value: MyInterface) {
  console.log(value.name)
}
```

然后又调用了这个函数

```ts
printName({ name: '123' })
```

你会发现，这段代码！！竟然！！运行的好好的！！！！

你可能觉得有点大惊小怪，但是仔细想一想，你的字面量 `{ name: '123' }` 并没有被声明成 `MyInterface` 类型的，而 TypeScript 也无从推导。但实际上，`{ name: '123' }` **就像是** `MyInterface` —— 因为从某种角度评估来说他们的类型就是能够匹配的，这个角度就是 TypeScript 的**类型匹配**。在主流的静态类型语言中，你是不可能遇到这种情况的，而这就是 TypeScript 能够适合前端开发的重要原因之一。

也正因为如此，在这个例子里，你可以把 `{ name: '123', value: 123 }` 传给 `printName` —— TypeScript 并不会因为你多一个字段而拒绝你，因为这个类型依然是能够匹配的。

## 强制类型声明 {#type-assertions}

到现在为止，你已经成为一个拥有 TypeScript 开发能力的前端了！作为一个优秀的 TypeScript 开发者，你总是谨记上面说的，不用 `any` 不用 `any`，也不用 `unknown`。终于有一天，你遇到了一个自己写不出来的代码：

```ts
function readFile(file: File, callback: (value: string) => unknown) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.addEventListener('load', () => callback(reader.result)); // error!
}
```

你发现，`reader.result` 的类型是 `string | Buffer | null`，可是你很委屈，文档上说这里的 `result` 就是字符串呀！

显然不是文档写错了，也不是 TypeScript 内置的 DOM 类型有问题。因为 `FileReader` 这个类还有一个 [readAsArrayBuffer](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader/readAsArrayBuffer) 的方法。在这里，`result` 显然不能提前预知你到底调用的是 `readAs` 啥。那这个时候应该怎么办呢？

很简单，你可以告诉 TypeScript，**我不要你觉得，我要我觉得**！这里的类型就是 `string`！这个语法有点像类型参数：

```ts
callback(<string>reader.result)
```

这个操作就叫**强制类型声明**。注意这个尖括号的优先级是很低的，有时候你可能需要加括号来使用：

```ts
(<string>reader.result).length
```

OK，现在一切都没有问题了对不对？并不！如果你使用 React，你就会发现，这个语法好像很熟悉！

```ts
type div = {
  name: string
}


console.log(<div>{name: 2})
```

对于转译器来说，它不能理解你这里的 <div> 究竟是 JSX 标签还是强制类型声明。为了解决这个问题，TypeScript 引入了 `as` 操作符，你可以写成

```ts
callback(reader.result as string)
```

通常来说我们提倡使用 `as` 来避免语法冲突。同时，`as` 也具有相当强的语义，你可以一眼看出来这里有一个强制类型转换操作。

当使用 `as` 时也有一个特殊的 `as const` 的用法，对于类型推导很有帮助

```ts
let foo = 'abc' // foo 的类型为 string
let bar = 'abc' as const // bar 的类型为 'abc'
```

很多时候我们既可以使用类型参数又可以使用强制类型声明。例如：

```ts
const a = [videoInfo, userInfo].reduce<CommonInfo>((prev, current) => Object.assign(prev, current)), {})

const a = [videoInfo, userInfo].reduce((prev, current) => Object.assign(prev, current)), {} as CommonInfo)
```

这两种写法都是可以正常工作的。通常来说，**能够使用类型参数的情况就可以不使用强制类型声明**。在一些复杂的重载情况中，这会提高类型检查的性能。

## 函数 {#functions}

### `this` 类型 {#this-type}

JavaScript 有一个让新手头疼的特性，就是函数的 `this` 绑定。一个函数会在不同的使用场合出现不同的 `this`，这就意味着 `this` 的类型是无从推导的。

但你仍然可以手动声明 `this` 的类型，以避免 TypeScript 把你的 `this` 当做 `any`

```ts
function get(this: Array, index: number) {
  return this[index >= 0 ? index : this.length + index]
}

get.call([1, 2, 3], -1) // 3
```

把 `this` 写成**第一个参数**，某种程度上，这不就是 Python 嘛？

```py
class foo(list):
  def get(self, index):
    return self[index if index >= 0 else len(self) + index]
```

### 重载 {#overloading}

有时候可能复合的类型不足以满足你描述一个函数的返回值。比方说：

```ts
function getPrimaryKey(el: HTMLAnchorElement | HTMLImageElement): 'href' | 'src'
```

如果像上面这样写的话，TypeScript 就会理解为：这个函数可以接受链接或者图片元素，返回的可能是两个字符串中的任意一个。

但是实际上，这里的类型是有关系的：当传入的参数为 `HTMLAnchorElement` 时，返回就只可能是 `'href'` ，反之亦然。这种情况下我们就会用到重载：

```ts
function getPrimaryKey(el: HTMLAnchorElement): 'href'
function getPrimaryKey(el: HTMLImageElement): 'src'
```

简单地说，就是把每个分支情况都声明一遍就好了

### `is type`

很多时候，使用类型系统都会遇到一个头疼的问题，就是类型的收紧：

```ts
function isNumber(arg: unknown): boolean {}

function run(arg: number | string) {
  if (isNumber(arg)) {
    arg = String(arg)
  }
  arg.startsWith('http:') // ts-error
}
```

上面的代码里，尽管从代码阅读的角度可以明白，`arg` 在执行 `startsWith` 的时候一定是一个字符串，但是类型系统并不能确定此时 `arg` 已经不可能是数字了。`is type` 就是用来帮助类型系统确信的。

本质上来说 `is` 也是一种类型运算，`value is type` 是 `boolean` 的一个子类型，且只能作为函数返回值的类型，但它包含了一部分**运行时**的信息。当函数返回值作为 `true` 使用时，`value` 的类型将被推导为 `type`。例如上面的例子，我们可以改为：

```ts
function isNumber(arg: unknown): arg is number {}
```

这样 TypeScript 就能正确推导了。通常来说这个语法不是很常用，一般只在书写运行时类型判断的情况下会使用。

## 类型表达式 {#type-expressions}

### 索引签名 {#index-signatures}

考虑一下我们常用的 `process.env` 这个东西，它的类型应该怎么写呢？它的每一个键都是 `string`，值也都是 `string`。如果使用 `interface` 的话，就可以通过索引签名来完成：

```ts
interface ProcessEnv {
  [key: string]: string;
}
```

本质上其实和 JS 里面变量索引的写法是类似的。

不仅如此，你也可以针对性的为某些 key 声明 `string` 的**子类型**：

```ts
interface ProcessEnv {
  NODE_ENV: 'production' | 'development';
  [key: string]: string;
}
```

### 映射的对象类型 {#mapped-types}

对于类型别名而言，有一个类似的语法，但实际上完成了不同的操作

```ts
type ProcessEnv = {
  [K in string]: string
}
```

上面这个类型意味着 `ProcessEnv` 的键名类型为 `string`，值的类型都是 `Object`。但是注意这里有一些细节的差别：

- 映射中你可以将任意的 `string | number | symbol` 的子类型写在 `in` 的后面，比如你可以写一个表达式：

```ts
type Foo = {
  [K in 'abc' | 'xyz']: string
}
```

但是在索引类型中，你只能引用某一种基础类型。

- 映射中你可以在值里引用键的具体类型，例如：

```ts
type Bar = {
  [K in keyof Foo]?: Foo[K]
}
```

### `extends` 和 `infer` {#extends-and-infer}

一个只有加减乘除的玩具并不能算作程序语言，想要实现一个程序语言最重要的就是要能执行条件逻辑。有时候你想要实现这样的东西：

```
// 这可不是 TypeScript
if (T is number) {
  type Foo<T> = string
} else {
  type Foo<T> = never
}
```

TypeScript 一个很常见的特性就是 `extends` 三元组。上面的逻辑可以实现为：

```ts
type Foo<T> = T extends number ? string : never
```

注意，这可不是 JS 里面的三元操作符，相反，只有带上 `extends` 才是合法的语法；另外，`extends` 意味着，只要前面的类型是后面类型的子类就行了，而不必是充分必要条件。

有了这个特性，你可以实现很多有意思的操作，例如**获取数组的元素类型**

```ts
type ElementType<T> = T extends any[] ? T[number] : never
```

但你一定不满足于此。例如，你想要实现**获取函数的返回值类型**

```ts
type ReturnType<T> = T extends (...args: any[]) => any ? [the second any] : never
```

这这这，这个 [the second any] 要咋写呀？真希望有一个类似于正则表达式替换的 `$n` 这种东西呀！

`infer` 关键字实际上就是干这个的：

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
```

你可以在 `extends` 三元组的 `extends` 右侧利用 `infer` 声明一个变量作为占位符，然后在 `?` 后面使用它。

## 内置的工具类型 {#built-in-types}

事实上，上面介绍的很多特性使用的场景都很有限，所以在这些场景里，TypeScript 已经内置了一些工具类型，尽管使用就可以了：

- `PropertyKey`
    - 就是 `string | number | symbol` 的别名
- `ThisParameterType<T>`
    - 当 T 是一个函数时，返回 T 绑定的 this 类型
- `OmitThisParameter<T>`
    - 返回未绑定 `this` 的 `T` 类型
- `PromiseLike<T>` 和 `ArrayLike<T>`
    - 前者是一个 thenable 的对象类型（将会 resolve `T` 类型的值），后者是 `T` 的类数组
- `Partial<T>`
    - 可以返回一个所有属性都可以缺少的 `T` 类型
- `Required<T>`
    - 返回一个所有属性都不可缺少的 `T` 类型
- `Readonly<T>`
    - 返回一个所有属性都 `readonly` 的 `T` 类型
- `Pick<T, K>`
    - 从对象 `T` 中选取 `K` 这些键
```ts
type Foo = Pick<{ a: string, b: number, c: boolean }, 'a' | 'b'>
// { a: string, b: number }
```
- `Record<K, T>`
    - 就是我们通常所说的对象类型，键的类型为 `K`，值的类型为 `T`
- `Exclude<T, U>`
    - 从 `T` 中排除 `U`
```ts
type Foo = Exclude<'a' | 'b' | 'c', 'a' | 'b'>
// 'c'
```
- `Extract<T, U>`
    - 反向 `Exclude`，从 `T` 中提出 `U`
```ts
type Foo = Extract<'a' | 'b' | 'c', 'a' | 'b' | 'd'>
// 'a' | 'b'
```
- `Omit<T, K>`
    - 反向 `Pick`，从对象 `T` 中省略 `K` 这些键
```ts
type Foo = Omit<{ a: string, b: number, c: boolean }, 'a' | 'b'>
// { c: boolean }
```
- `Parameters<T>`
    - 返回函数 `T` 的参数
```ts
type Foo = Paramaters<(a: string, b: number) => boolean>
// string | number
```
- `ReturnType<T>`
    - 返回函数 `T` 的返回值
```ts
type Foo = ReturnType<(a: string, b: number) => boolean>
// boolean
```
- `InstanceType<T>`
    - 返回类 `T` 的实例类型
```ts
type Foo = InstanceType<ObjectConstructor>
// Object
```
- `ThisType<T>`
    - 用来将一个对象下的所有属性的 `this` 都声明为 `T` 类型
    - 可以考虑如何声明 Vue 组件选项的 `methods` 这个对象的类型
