---
title: 「TypeScript」类（class）与接口
urlname: aa86ar
date: '2021-08-20 17:03:31 +0800'
tags:
  - ts
categories:
  - TypeScript
---

### 类

> 传统方法中，JavaScript 通过构造函数实现类的概念，通过原型链实现继承。而在 ES6 中，我们终于迎来了 `class`。
>
> TypeScript 除了实现了所有 ES6 中的类的功能以外，还添加了一些新的用法。

#### 概念

- 类（Class）：定义了一件事物的抽象特点，包含它的属性和方法
- 对象（Object）：类的实例，通过 `new` 生成
- 面向对象（OOP）的三大特性：**封装、继承、多态**
  - 封装（Encapsulation）：将对数据的操作细节隐藏起来，只暴露对外的接口。外界调用端不需要（也不可能）知道细节，就能通过对外提供的接口来访问该对象，同时也保证了外界无法任意更改对象内部的数据
  - 继承（Inheritance）：子类继承父类，子类除了拥有父类的所有特性外，还有一些更具体的特性
  - 多态（Polymorphism）：由继承而产生了相关的不同的类，对同一个方法可以有不同的响应。比如 `Cat` 和 `Dog` 都继承自 `Animal`，但是分别实现了自己的 `eat` 方法。此时针对某一个实例，我们无需了解它是 `Cat` 还是 `Dog`，就可以直接调用 `eat` 方法，程序会自动判断出来应该如何执行 `eat`
- 存取器（getter & setter）：用以改变属性的读取和赋值行为
- 修饰符（Modifiers）：修饰符是一些关键字，用于限定成员或类型的性质。比如 `public`表示公有属性或方法
- 抽象类（Abstract Class）：抽象类是供其他类继承的基类，抽象类不允许被实例化。抽象类中的抽象方法必须在子类中被实现
- 接口（Interfaces）：不同类之间公有的属性或方法，可以抽象成一个接口。接口可以被类实现（implements）。一个类只能继承自另一个类，但是可以实现多个接口

#### ES6 类

[ECMAScript 6 入门 - Class](http://es6.ruanyifeng.com/#docs/class)

##### 属性和方法

使用 `class` 定义类，使用 `constructor` 定义构造函数。

通过 `new` 生成新实例的时候，会自动调用构造函数。

```javascript
class Animal {
    public name;
    constructor(name) {
        this.name = name;
    }
    sayHi() {
        return `My name is ${this.name}`;
    }
}

let a = new Animal('Jack');
```

##### 继承

使用 `extends` 关键字实现继承，子类中使用 `super` 关键字来调用父类的构造函数和方法。

```javascript
class Cat extends Animal {
  constructor(name) {
    super(name); // 调用父类的 constructor(name)
    console.log(this.name);
  }
  sayHi() {
    return "Meow, " + super.sayHi(); // 调用父类的 sayHi()
  }
}

let c = new Cat("Tom"); // Tom
console.log(c.sayHi()); // Meow, My name is Tom
```

##### 存取器

使用 getter 和 setter 可以改变属性的赋值和读取行为：

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  get name() {
    return "Jack";
  }
  set name(value) {
    console.log("setter: " + value);
  }
}
let a = new Animal("Kitty"); // setter: Kitty
a.name = "Tom"; // setter: Tom
console.log(a.name); // Jack
```

##### 静态方法

使用 `static` 修饰符修饰的方法称为静态方法，只能直接通过类来调用：

```javascript
class Animal {
  static isAnimal(a) {
    return a instanceof Animal;
  }
}

let a = new Animal("Jack");
Animal.isAnimal(a); // true
a.isAnimal(a); // TypeError: a.isAnimal is not a function
```

#### ES7 类

##### 实例属性

ES6 中实例的属性只能通过构造函数中的 `this.xxx` 来定义，ES7 提案中可以直接在类里面定义：

```javascript
class Animal {
  name = "Jack";

  constructor() {
    // ...
  }
}

let a = new Animal();
console.log(a.name); // Jack
```

##### 静态属性

使用 `static` 定义一个静态属性，与静态方法类似：

```javascript
class Animal {
  static num = 42;
}

console.log(Animal.num); // 42
```

#### TS 类

##### public private 和 protected

> TypeScript 可以使用三种访问修饰符（Access Modifiers），分别是 `public`、`private` 和 `protected`。

- `public` 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 `public` 的；
- `private` 修饰的属性或方法是私有的，不能在声明它的类的外部访问；
- `protected` 修饰的属性或方法是受保护的，它和 `private` 类似，区别是它在子类中也是允许被访问的；

```typescript
class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
}

let a = new Animal("Jack");
a.name; // Jack

class Animal {
  private name;
  public constructor(name) {
    this.name = name;
  }
}

let a = new Animal("Jack"); // error
```

注：**TypeScript 编译之后的代码中，并没有限制 **`**private**`** 属性在外部的可访问性**。

当构造函数修饰为 `private` 时，该类不允许被继承或者实例化：

```typescript
class Animal {
  public name;
  private constructor(name) {
    this.name = name;
  }
}
class Cat extends Animal {
  constructor(name) {
    super(name);
  }
}

let a = new Animal("Jack"); // error
```

当构造函数修饰为 `protected` 时，该类只允许被继承：

```typescript
class Animal {
  public name;
  protected constructor(name) {
    this.name = name;
  }
}
class Cat extends Animal {
  constructor(name) {
    super(name);
  }
}

let a = new Animal("Jack"); // error
```

##### 参数属性

修饰符和`readonly`还可以使用在构造函数参数中，等同于类中定义该属性同时给该属性赋值：

```typescript
class Animal {
  // public name: string;
  public constructor(public name) {
    // this.name = name;
  }
}
```

`readonly`，只读属性关键字，只允许出现在属性声明，索引签名或构造函数中：

```typescript
class Animal {
  readonly name;
  public constructor(name) {
    this.name = name;
  }
}
```

如果同时出现其他访问修饰符，`readonly`需要写在其他修饰符后面：

```typescript
class Animal {
  // public readonly name;
  public constructor(public readonly name) {
    // this.name = name;
  }
}
```

##### 抽象类

`abstract` 用于定义抽象类和其中的抽象方法。

- 抽象类是不允许被实例化的：

```typescript
abstract class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
  public abstract sayHi();
}

let a = new Animal("Jack"); // error
```

- 抽象类中的**抽象方法**必须被子类实现：

```typescript
abstract class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
  public abstract sayHi();
}

class Cat extends Animal {
  public eat() {
    console.log(`${this.name} is eating.`);
  }
}

let cat = new Cat("Tom"); // error, 没有实现抽象方法sayHi
```

```typescript
abstract class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
  public abstract sayHi();
}

class Cat extends Animal {
  public sayHi() {
    console.log(`Meow, My name is ${this.name}`);
  }
}

let cat = new Cat("Tom");
```

#### 类的类型

在 TS 内给类加上类型与接口类似：

```typescript
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  sayHi(): string {
    return `My name is ${this.name}`;
  }
}

let a: Animal = new Animal("Jack");
console.log(a.sayHi()); // My name is Jack
```

### 类与接口

> 接口（Interfaces）可以用于对「对象的形状（Shape）」进行描述。

同时接口还可以对类的一部分行为进行抽象。

#### 类实现接口

> 实现（implements）是面向对象中的一个重要概念。一般来讲，一个类只能继承自另一个类，有时候不同类之间可以有一些共有的特性，这时候就可以把特性提取成接口（interfaces），用 `implements` 关键字来实现。这个特性大大提高了面向对象的灵活性。

举例来说，门是一个类，防盗门是门的子类。如果防盗门有一个报警器的功能，我们可以简单的给防盗门添加一个报警方法。这时候如果有另一个类，车，也有报警器的功能，就可以考虑把报警器提取出来，作为一个接口，防盗门和车都去实现它：

```typescript
interface Alarm {
  alert(): void;
}

class Door {}

class SecurityDoor extends Door implements Alarm {
  alert() {
    console.log("SecurityDoor alert");
  }
}

class Car implements Alarm {
  alert() {
    console.log("Car alert");
  }
}
```

一个类可以实现多个接口：

```typescript
interface Light {
  lightOn(): void;
  lightOff(): void;
}
class Car implements Alarm, Light {
  alert() {
    console.log("Car alert");
  }
  lightOn() {
    console.log("Car light on");
  }
  lightOff() {
    console.log("Car light off");
  }
}
```

#### 接口继承接口

```typescript
interface Alarm {
  alert(): void;
}

interface LightableAlarm extends Alarm {
  lightOn(): void;
  lightOff(): void;
}
```

#### 接口继承类

常见的面向对象语言中，接口是不能继承类的，但是在 TypeScript 中是可以的：

```typescript
class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

interface Point3d extends Point {
  z: number;
}

let point3d: Point3d = { x: 1, y: 2, z: 3 };
```

在 TypeScript 内，当我们在声明 `class Point` 时，除了会创建一个名为 `Point` 的类之外，同时也创建了一个名为 `Point` 的类型（实例的类型）。

所以我们既可以将 `Point` 当做一个类来用（使用 `new Point` 创建它的实例），也可以将 `Point` 当做一个类型来用（使用 `: Point` 表示参数的类型）。

```typescript
// 作为类
const p = new Point(1, 2);

// 作为类型
function printPoint(p: Point) {
  console.log(p.x, p.y);
}

printPoint(new Point(1, 2));
```

当我们声明 `interface Point3d extends Point` 时，`Point3d` 继承的实际上是类 `Point` 的实例的类型。

上面作为类型来使用的例子其实等价于：

```typescript
interface PointInstanceType {
  x: number;
  y: number;
}

function printPoint(p: PointInstanceType) {
  console.log(p.x, p.y);
}

printPoint(new Point(1, 2));
```

新声明的 `PointInstanceType` 类型，与声明 `class Point` 时创建的 `Point` 类型是等价的。

可以理解为定义了一个接口 `Point3d` 继承另一个接口 `PointInstanceType`：

```typescript
// 等价于 interface Point3d extends PointInstanceType
interface Point3d extends Point {
  z: number;
}
```

`PointInstanceType` 相比于 `Point`，缺少了 `constructor` 方法，这是因为声明 `Point` 类时创建的 `Point` 类型是不包含构造函数的。另外，除了构造函数是不包含的，静态属性或静态方法也是不包含的（实例的类型当然不应该包括构造函数、静态属性或静态方法）。

**声明 **`**Point**`** 类时创建的 **`**Point**`** 类型只包含其中的实例属性和实例方法。**

在接口继承类的时候，也只会继承它的实例属性和实例方法。
