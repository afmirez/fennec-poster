---
# 🧩 FRONTMATTER
# • Fill in all fields.
# • Use strings (except 'order' = integer).
# • 'tags' must be a list of valid strings: JavaScript, Python.
# • ⚠️ Do NOT edit 'category' or 'id'.

title: "Functions"
description: "Functions"
order: 2
tags: ["JavaScript"]
category: The-Principles-of-Object-Oriented-JavaScript
id: c0fc5b47-136c-4331-9e07-8c3c6f0c603e
---

# Functions

In JavaScript, functions are objects with an internal property called `[[Call]]`.This hidden property (not directly accessible in code) is what allows the function object to be _invoked_.

Since only functions have `[[Call]]`, the `typeof` operator reports `"function"` for them.

---

#### Declarations vs Expressions

JavaScript has two literal forms of functions:

- **Function declarations**: use the `function` keyword followed by a name. These are **hoisted** to the top of their scope, so they can be called before their actual definition in code.

```
// Works even before definition (hoisting)
sayHi();

function sayHi() {
  console.log("Hello there!");
}
```

- **Function expressions**: can be anonymous or assigned to a variable. They are **not hoisted**, meaning they can only be used after the point where they are defined.

```
// sayHi(); // Error: Cannot access before initialization

const sayHi = function () {
  console.log("Hello there!");
};

sayHi();
```

---

#### Functions as Values

JavaScript has first-class functions, so you can use them just as you do any other objects. You can assign them to variables, add them to objects, pass them to other functions as arguments, and return them from functions.

You can use a function anywhere you would use any other reference value.

```
// 1. Assign a function to a variable
function greet() {
  console.log("Hello!");
}
const sayHello = greet;
sayHello(); // Hello!

// 2. Pass a function as an argument
function run(fn) {
  console.log("Running function...");
  fn();
}
run(greet); // Running function... Hello!

// 3. Return a function from another function
function createMultiplier(x) {
  return function (y) {
    return x * y;
  };
}
const double = createMultiplier(2);
console.log(double(5)); // 10

// 4. Store functions in a data structure
function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}

const operations = [add, subtract];
console.log(operations[0](5, 3)); // 8
console.log(operations[1](5, 3)); // 2
```

---

#### Parameters

A function in JavaScript can be called with **any number of arguments**, regardless of how many parameters it declares.

- If you **pass fewer arguments**, the missing ones are set to `undefined`.
- If you **pass extra arguments**, they are not discarded; they are stored in the special **array-like `arguments` object**.
- Parameters are **position-based**, so the order in which you pass values determines how they are assigned.
- The function’s `.length` property reflects the **number of declared parameters**, not how many were actually passed.

```
function demo(a, b, c) {
  console.log("a:", a);
  console.log("b:", b);
  console.log("c:", c);

  console.log("arguments:", arguments);
  console.log("expected params (length):", demo.length);
}

// Fewer arguments → missing ones are undefined
demo(1);
// a: 1, b: undefined, c: undefined

// Extra arguments → accessible through arguments
demo(1, 2, 3, 4, 5);
// a: 1, b: 2, c: 3
// arguments: [1, 2, 3, 4, 5]
// expected params (length): 3
```

Using arguments

```
function sum() {
  let result = 0;
  let i = 0;
  let len = arguments.length;

  while (i < len) {
    result += arguments[i];
    i++;
  }

  return result;
}

console.log(sum(1, 2, 3, 4)); // 10
console.log(sum(5, 10)); // 15
```

Modern Approach: Rest Parameters

```
function sum(...args) {
  return args.reduce((acc, n) => acc + n, 0);
}

console.log(sum(1, 2, 3, 4)); // 10
```

---

#### Overloading

JavaScript does **not** support real function overloading (there is no function's signature -> name + number/type of parameters ); the last function with the same name overwrites the previous ones.

You can handle variations by checking parameters:

- With `arguments.length`
- Or by testing if a named parameter is `undefined` (more common).

```
function greet(name) {
  if (name === undefined) {
    console.log("Hello!");
  } else {
    console.log("Hello, " + name + "!");
  }
}

greet(); // Hello!
greet("Bob"); // Hello, Bob!
```

---

#### Object methods

An object’s **property** whose value is a function is called a **method**.

###### The `this` object

In JavaScript, functions need a way to know **which object they belong to at the time they are called**. Instead of hardcoding object names inside functions (which would make them inflexible and tied to a single object), JavaScript provides the special keyword `this`. The value of `this` depends on the **calling context**: when a function is called as a method of an object, `this` refers to that object; when it is called in the global scope, `this` refers to the global object (`window` in browsers).

This design makes it possible to write one function and reuse it across different objects without rewriting the code:``

```
function sayNameForAll() {
  console.log(this.name);
}

var person1 = { name: "Nicholas", sayName: sayNameForAll };
var person2 = { name: "Greg", sayName: sayNameForAll };
var name = "Michael"; // global variable

person1.sayName(); // "Nicholas"
person2.sayName(); // "Greg"
sayNameForAll(); // "Michael" (global this)
```

By relying on `this`, the function dynamically adapts to the object that invoked it, which is why `this` is a cornerstone of how methods work in JavaScript.

###### Explicit `this` binding

You can change the value of `this` to achieve different goals.

- The `call()` method lets you execute a function immediately while explicitly setting what `this` refers to. The first argument defines the value of `this`, and any following arguments are passed to the function. This is useful when you want to reuse a function across different objects or control the execution context directly.

```
function sayNameForAll(label) {
  console.log(label + ":" + this.name);
}

var person1 = { name: "Nicholas" };
var person2 = { name: "Greg" };
var name = "Michael";

sayNameForAll.apply(this, ["global"]); // outputs "global:Michael"
sayNameForAll.apply(person1, ["person1"]); // outputs "person1:Nicholas"
sayNameForAll.apply(person2, ["person2"]); // outputs "person2:Greg"
```

- The `apply()` method works exactly like `call()`: it executes a function immediately with an explicitly set `this` value. The difference is that `apply()` only takes two arguments—the value for `this` and an array (or array-like object) of parameters. This makes it convenient when your data is already in an array, while `call()` is better when you have individual variables.

```
function greet(greeting, punctuation) {
  console.log(greeting + ", " + this.name + punctuation);
}

const person = { name: "Alice" };
greet.apply(person, ["Hello", "!"]); // Hello, Alice!
```

- The `bind()` method works like `call()` and `apply()` in that it lets you set the value of `this`, but instead of executing the function immediately, it returns a **new function** with `this` permanently bound to the given value. You can then call that new function later, optionally passing arguments. This is useful when you want to fix the execution context for callbacks or event handlers.

```
function greet(greeting, punctuation) {
  console.log(greeting + ", " + this.name + punctuation);
}

const person = { name: "Alice" };
const boundGreet = greet.bind(person);

boundGreet("Hello", "!"); // Hello, Alice!
```
