---
# 🧩 FRONTMATTER
# • Fill in all fields.
# • Use strings (except 'order' = integer).
# • 'tags' must be a list of valid strings: JavaScript, Python.
# • ⚠️ Do NOT edit 'category' or 'id'.

title: "Inheritance"
description: "Inheritance"
order: 5
tags: ["JavaScript"]
category: The-Principles-of-Object-Oriented-JavaScript
id: 101fb278-9037-4251-aef8-7bf35f912729
---

# Inheritance

#### Prototype chaining and `Object.prototype`

Prototype chaining is JavaScript’s form of inheritance: each object inherits from its **prototype**, which may also inherit from another. This chain continues until it reaches **`Object.prototype`**, the root of all objects.  
Objects created with literals or constructors automatically have **`Object.prototype`** as their final link in the chain.

###### Methods Inherited from Object.prototype

All objects inherit several fundamental methods from **`Object.prototype`**, including:

- **`hasOwnProperty()`** → checks if a property exists **directly** on the object (not inherited).
- **`propertyIsEnumerable()`** → checks if an own property is **enumerable**.
- **`isPrototypeOf()`** → verifies whether one object appears in another’s **prototype chain**.

These two are special because they control how objects behave when converted to **primitive values** or **strings**.

- **\*`valueOf()`** → returns the **primitive value** that represents the object. JavaScript calls this method automatically when an object is used in a numeric or logical context. You can override it to define how your object behaves in calculations.

```
const counter = {
  count: 3,
  valueOf() {
    return this.count;
  },
};
console.log(counter + 2); // 5
```

- **`toString()`** → returns a **string representation** of the object. It’s called when the object is used in a string context (like concatenation or template literals). Overriding it makes your objects display more meaningful text.

```
const user = {
  name: "Alice",
  toString() {
    return `User: ${this.name}`;
  },
};
console.log(`${user}`); // "User: Alice"
```

###### Modifying `Object.prototype`

While it’s **technically possible** to modify `Object.prototype`, doing so is **strongly discouraged**.  
Every object in JavaScript inherits from it, so any changes affect **all objects**, which can cause bugs, naming conflicts, and unexpected behavior. Example of what _not_ to do:

```
Object.prototype.add = function (v) {
  return this + v;
};
```

This makes every object—from plain objects to browser elements—have an unnecessary `add()` method.

---

###### Object Inheritance

The simplest form of inheritance in JavaScript is **object-to-object inheritance**, where one object serves as the **prototype** for another.

By default, object literals inherit from **`Object.prototype`**, but you can explicitly set an object’s **`[[Prototype]]`** using **`Object.create()`**.

```
const parent = {
  greet() {
    return "Hello";
  },
};
const child = Object.create(parent);
child.name = "Alice";

console.log(child.greet()); // "Hello" — inherited from parent
```

**`Object.create(proto, descriptors)`**

- **First argument:** the prototype to link to.
- **Second argument (optional):** property descriptors (same format as `Object.defineProperties()`), allowing you to define new properties during creation.

###### Constructor Inheritance

Every function has a **`prototype`** object that inherits from **`Object.prototype`** and includes a **`constructor`** property pointing back to the function.

So, instances created with `new` form a chain: `instance → Constructor.prototype → Object.prototype`.

```
function Person(name) {
  this.name = name;
}
const user = new Person("Alice");

console.log(user instanceof Person); // true
console.log(user instanceof Object); // true
```

When changing the prototype chain manually (for example, linking a constructor’s prototype to another object), you must ensure:

- The constructor can run **safely without required arguments**.
- It doesn’t modify **global state**, since it may be called only to set up inheritance, not to create real instances.

```
function Animal() {
  this.type = "mammal";
}
function Dog(name) {
  this.name = name;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

const rex = new Dog("Rex");
console.log(rex.type); // "mammal"
```

###### Calling the Supertype Constructor

In JavaScript, a **subtype constructor** can call its **supertype constructor** using `call()` or `apply()` to initialize inherited properties. This technique is called **constructor stealing** and is often combined with **prototype inheritance** — together known as **pseudoclassical inheritance**.

```
function Animal(type) {
  this.type = type;
}

function Dog(name) {
  // Call the supertype constructor
  Animal.call(this, "mammal");
  this.name = name;
}

// Inherit methods
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

const rex = new Dog("Rex");
console.log(rex.type); // "mammal"
console.log(rex.name); // "Rex"
```

- **Constructor stealing (`call`)** → inherits **properties**.
- **Prototype chaining** → inherits **methods**.
  This pattern imitates class-based inheritance in traditional OOP languages.

###### Accessing supertype methods

When a **subtype** overrides a method from its **supertype**, you can still call the original version by accessing it directly on the supertype’s prototype and using `call()` or `apply()` to run it in the subtype’s context.

```
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} makes a noise.`;
};

function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Override speak()
Dog.prototype.speak = function () {
  const base = Animal.prototype.speak.call(this); // call supertype method
  return `${base} ${this.name} barks.`;
};

const rex = new Dog("Rex");
console.log(rex.speak()); // "Rex makes a noise. Rex barks."
```
