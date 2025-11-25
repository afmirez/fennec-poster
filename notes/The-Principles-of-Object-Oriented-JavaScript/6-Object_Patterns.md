---
# 🧩 FRONTMATTER
# • Fill in all fields.
# • Use strings (except 'order' = integer).
# • 'tags' must be a list of valid strings: JavaScript, Python.
# • ⚠️ Do NOT edit 'category' or 'id'.

title: "Object Patterns"
description: "Object Patterns"
order: 6
tags: ["JavaScript"]
category: The-Principles-of-Object-Oriented-JavaScript
id: 89fe2e12-b43b-4637-8b24-af58880e3a3e
---

# Object Patterns

#### Private and Privileged members

All object properties are **public by default**, and JavaScript has **no built-in privacy keyword**.  
Using a leading underscore (e.g. `_name`) is just a **convention**, not real protection.

###### The Module Pattern

The **module pattern** creates **singleton objects with private data** using an **immediately invoked function expression (IIFE)**. The IIFE defines local variables (private) and returns an object with methods (public) that can access them — these are called **privileged methods**.

```js
const counter = (function () {
  let count = 0; // private
  return {
    increment() {
      count++;
    },
    getCount() {
      return count;
    },
  };
})();
```

Here, `count` is hidden from the outside but accessible through the returned methods.

A variation called the **revealing module pattern** defines all variables and functions at the top of the IIFE, then returns an object that maps the public API:

```js
const counter = (function () {
  let count = 0;
  function increment() {
    count++;
  }
  function getCount() {
    return count;
  }
  return { increment, getCount };
})();
```

###### Private Members for constructors

You can use a **module-like pattern inside a constructor** to create **private, instance-specific data**. This works by defining variables inside the constructor’s scope and exposing them through methods defined within it.

```js
function User(name) {
  let _name = name; // private
  this.getName = () => _name;
}
const user1 = new User("Alice");
console.log(user1.getName()); // "Alice"
console.log(user1._name); // undefined
```

This approach keeps data private for each instance, though it’s **less memory-efficient** than using the prototype.

If you want **private data shared across all instances**, you can create it in a **closure outside the constructor**, then expose it through prototype methods.

```js
const User = (function () {
  let secretKey = "XYZ123"; // shared private data

  function User(name) {
    this.name = name;
  }

  User.prototype.getSecret = function () {
    return `${this.name}'s key is ${secretKey}`;
  };

  return User;
})();

const alice = new User("Alice");
const bob = new User("Bob");

console.log(alice.getSecret()); // "Alice's key is XYZ123"
console.log(bob.getSecret()); // "Bob's key is XYZ123"
```

###### Mixins

**Mixins** allow one object to **copy properties** from another **without changing the prototype chain**.  
The receiver object simply gets new properties from the supplier through **assignment**, creating a form of **pseudo-inheritance**.

```JS
function mixin(receiver, supplier) {
  for (let key in supplier) {2
    if (supplier.hasOwnProperty(key)) {
      receiver[key] = supplier[key];
    }
  }
  return receiver;
}

const canFly = {
  fly() { console.log("Flying!"); }
};

const bird = { name: "Eagle" };
mixin(bird, canFly);

bird.fly(); // "Flying!"
```

Here, `bird` gains `fly()` from `canFly` without altering its prototype.

Notes:

- This creates a **shallow copy**, so shared object properties still reference the same data.
- **Accessor properties** (getters/setters) become **plain data properties** during copying, so they can be accidentally overwritten.

###### Mixins — Safer Alternative

To preserve property descriptors—including getters, setters, and flags like `enumerable`—use a safer mixin based on `Object.getOwnPropertyDescriptors()`:

```js
function safeMixin(receiver, supplier) {
  Object.defineProperties(receiver, Object.getOwnPropertyDescriptors(supplier));
}

const canTalk = {
  get message() {
    return "Hello!";
  },
};

const person = {};
safeMixin(person, canTalk);

console.log(person.message); // "Hello!"
```

This version copies **properties exactly as defined**, keeping accessors and configuration intact.

###### Scope Safe-Constructors

Because constructors in JavaScript are just functions, calling them without `new` changes the meaning of `this`: in non-strict mode it refers to the global object, and in strict mode it throws an error. Many built-in constructors like `Array` and `RegExp` are **scope-safe**, meaning they work correctly whether or not `new` is used.
You can make your own constructors scope-safe by checking whether they were called with `new` using `this instanceof Constructor`. If not, you can return a new instance manually

```js
function Person(name) {
  if (this instanceof Person) {
    this.name = name;
  } else {
    return new Person(name);
  }
}
```

This pattern ensures consistent behavior and prevents bugs caused by accidentally omitting `new`.
