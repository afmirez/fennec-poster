---
# 🧩 FRONTMATTER
# • Fill in all fields.
# • Use strings (except 'order' = integer).
# • 'tags' must be a list of valid strings: JavaScript, Python.
# • ⚠️ Do NOT edit 'category' or 'id'.

title: "Constructors and Prototypes"
description: "Constructors and Prototypes"
order: 4
tags: ["JavaScript"]
category: The-Principles-of-Object-Oriented-JavaScript
id: a7413cea-64d4-4811-8489-eb438292eded
---

# Constructors and Prototypes

#### Constructors

A **constructor** is just a regular function meant to be called with the **`new`** keyword to create an object. When you use `new`, JavaScript automatically:

1. Creates a new empty object.
2. Sets the object’s prototype to the constructor’s `prototype`.
3. Binds `this` inside the constructor to that new object.
4. Returns the new object.
   Objects created by the same constructor share the same structure — they have the same properties and methods.

- By convention, constructor names start with a **capital letter**.
- Every instance created with a constructor has a **`constructor` property** that references the function that built it.
- If you **forget to use `new`**, `this` won’t refer to a new object — it will refer to the **global object**
- Constructors can also use `Object.defineProperty()` to set up controlled or hidden instance properties.

```
function Person(name) {
  this.name = name;
}

const user = new Person("Alice");
```

---

#### Prototypes

A **prototype** is like a **blueprint** for objects created by a constructor. Every constructor function (except some built-ins) has a **`prototype`** property that’s shared by all its instances.

When a new object is created, it links to this prototype, allowing all instances to **access shared properties and methods** without duplicating them.

```
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  return `Hi, I'm ${this.name}`;
};

// All objects created with `new Person()` share the same `sayHi` method through the prototype.
```

###### The `[[Prototype]]` property

Every object in JavaScript has an internal **`[[Prototype]]`** — a hidden link to another object that serves as its **prototype**. When you create an object with a constructor, the constructor’s `prototype` becomes the object’s `[[Prototype]]`.

You can access this link using **`Object.getPrototypeOf(obj)`**, and for regular objects created with `{}` or `new Object()`, it points to **`Object.prototype`**.

When you try to **read a property**, JavaScript first looks for it on the object itself.  
If it doesn’t exist, it searches up the `[[Prototype]]` chain until it finds it (or reaches the end).

**Note:** You **can’t assign** to an object’s `[[Prototype]]` directly from an instance — it’s read-only and controlled through constructors or methods like `Object.setPrototypeOf()`.

###### Using prototypes with constructors

Prototypes are perfect for **defining shared methods** for all instances created by a constructor.  
Since methods usually behave the same way for every object, defining them once on the prototype saves **memory and improves efficiency**.

```
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  return `Hi, I'm ${this.name}`;
};
```

You can also store other data on the prototype, but be cautious with **reference values** (like arrays or objects), since they’ll be **shared by all instances**.

###### Overwriting the Prototype

Instead of adding methods one by one, many developers replace the entire prototype with an **object literal** for brevity:

```
Person.prototype = {
  sayHi() {
    return `Hi, I'm ${this.name}`;
  },
};
```

However, this has a side effect: Overwriting the prototype **removes the original `constructor` property**, making it point to `Object` instead of `Person`. To fix that, you must manually **restore the `constructor`**:

```
Person.prototype.constructor = Person;
```

###### Changing Prototypes

All instances created from the same constructor share the **same prototype**, so if you modify that prototype, **all existing instances** immediately gain access to the new properties or methods.

```
function Person(name) {
  this.name = name;
}
const user = new Person("Alice");

Person.prototype.sayHi = function () {
  return `Hi, I'm ${this.name}`;
};

user.sayHi(); // Works — even though sayHi was added later
```

This happens because each instance’s **`[[Prototype]]`** simply points to the constructor’s prototype — any updates there are shared.

Calling **`Object.seal()`** or **`Object.freeze()`** affects only the **instance itself** and its **own properties**. It doesn’t lock the prototype. So even if an object is frozen, you can still **add or modify properties on its prototype**, and all instances will reflect those changes.

###### Built-in Object Prototypes

All **built-in objects** in JavaScript — such as `Object`, `Array`, `String`, `Number`, and others — have **constructors** and therefore their own **prototypes**. Because of that, you can technically **modify these prototypes** to add new methods or properties, even to primitive types like strings or numbers wrappers.

```
String.prototype.reverse = function () {
  return this.split("").reverse().join("");
};

console.log("hello".reverse()); // "olleh"
```

While it’s fine to **experiment** with prototype modification when learning or testing concepts, it’s **not recommended in production code**.
