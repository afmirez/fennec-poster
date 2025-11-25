---
# 🧩 FRONTMATTER
# • Fill in all fields.
# • Use strings (except 'order' = integer).
# • 'tags' must be a list of valid strings: JavaScript, Python.
# • ⚠️ Do NOT edit 'category' or 'id'.

title: "Understanding Objects"
description: "Understanding Objects"
order: 3
tags: ["JavaScript"]
category: The-Principles-of-Object-Oriented-JavaScript
id: 2b2e6f4d-129f-42ea-bc65-a25a8b1e9c95
---

# Understanding Objects

#### Object Property Attributes and Operations

###### Defining Properties

Objects are open by default, you can freely add or change properties. unless the object is explicitly made immutable (e.g., with `Object.freeze()` or `Object.seal()`).

- When you **add a new property**, the engine uses the internal method **`[[Put]]`**. This creates a new “slot” in the object and stores the property as its **own property**.
- When you **assign a new value** to an **existing property**, JavaScript uses **`[[Set]]`** instead. This doesn’t create anything new—it simply replaces the old value with the new one.

```
const user = {};
user.name = "Naruto"; // [[Put]]
user.name = "Sasuke"; // [[Set]]
```

###### Detecting Properties

Using `if (obj.prop)` only works when you care about the **value**, not the property’s existence. It returns `false` if the value is _falsy_ (`0`, `""`, `false`, `null`, or `undefined`), even when the property exists.

The **`'prop' in obj`** operator is better for checking **existence** — it returns `true` if the property exists anywhere in the object or its prototype chain, regardless of its value.

Finally, **`obj.hasOwnProperty('prop')`** checks whether the property belongs **directly** to the object (not inherited). Use this when you need to distinguish between the object’s own data and properties from its prototype.]

###### Removing Properties

The delete operator works on a single object property and calls an internal operation named `[[Delete]]

```
var person1 = { name: "Nicholas" };

console.log("name" in person1); // true
delete person1.name;
console.log("name" in person1); // false
console.log(person1.name); // undefined
```

###### Enumeration

Properties are **enumerable**, meaning they show up when you **iterate** over the object with a `for...in` loop. Internally, this is controlled by the property’s **`[[Enumerable]]`** attribute, which is set to `true` unless specified otherwise. **`for...in`** loops through **all enumerable properties**, including those **inherited** from the prototype chain. Use it when you just want to **iterate** over properties directly.

**`Object.keys(obj)`** returns an **array** of the object’s **own enumerable** property names.  
Use it when you need to **work with property names as a list**, for example with array methods like `.map()` or `.forEach()`.

###### Types of properties

In JavaScript, there are **two types of object properties**:

1. **Data Properties** – store a **direct value**.  
   These are the typical properties you define through assignment, like:
   `user.name = "Alice";`
2. **Accessor Properties** – don’t store a value themselves.  
   Instead, they define functions:
   - a **getter** (runs when the property is read)
   - a **setter** (runs when a value is assigned)

```
const user = {
  _name: "Alice", // underscore often marks a private field
  get name() {
    return this._name.toUpperCase();
  },
  set name(value) {
    this._name = value.trim();
  },
};
```

Accessor properties are useful when you want assigning or reading a value to **trigger behavior** — like computing a value dynamically or validating input.

---

#### Property Attributes

Every property in a JavaScript object has **hidden internal settings**, called **property attributes**, that define how that property behaves. These attributes determine things like whether the property shows up in loops, whether its value can be changed, or even whether it can be deleted.

###### Shared Attributes

Both **data properties** and **accessor properties** share two important attributes:

1. **`[[Enumerable]]`** – controls whether the property appears during iteration (e.g. `for...in`, `Object.keys()`).
   - `true` → visible in iteration
   - `false` → hidden
2. **`[[Configurable]]`** – controls whether the property’s definition can be changed or removed. - `true` → can be modified or deleted - `false` → locked in place
   By default, all properties you create are **enumerable** and **configurable**.

You can modify these attributes using **`Object.defineProperty()`**, which lets you explicitly define how a property behaves:

```
Object.defineProperty(obj, "name", {
  enumerable: false,
  configurable: false,
});
```

This gives developers precise control — allowing you to make properties **hidden**, **read-only**, or **permanent**, similar to how built-in JavaScript properties work.

###### Data property attributes

In addition to the shared attributes, data properties have **two unique attributes**:

1. **`[[Value]]`** – stores the actual **value** of the property.
   - This is automatically set when you create the property (e.g. `obj.key = 10`).
   - Any type of data, including functions, is stored here.
2. **`[[Writable]]`** – a Boolean that determines **whether the property’s value can be changed**.
   - `true` → you can reassign the value.
   - `false` → the value is read-only.
   - By default, all properties are **writable**.

```
Object.defineProperty(obj, "id", {
  value: 42,
  writable: false,
});
```

###### Accessor Property Attributes

**Accessor properties** don’t store a value directly. Instead, they define **functions** that run when the property is **read** or **written**.

1. **`[[Get]]`** – a function that runs when the property is **read**.
2. **`[[Set]]`** – a function that runs when a **new value is assigned**.
   These functions control how a property behaves rather than storing a static value.

```
const user = { _name: "Alice" };

Object.defineProperty(user, "name", {
  get() {
    return this._name.toUpperCase();
  },
  set(value) {
    this._name = value.trim();
  },
  enumerable: true,
  configurable: true,
});
```

Here, `Object.defineProperty()` lets you **add an accessor property to an existing object**, which you can’t do with object literal syntax.

As with data properties, you can also control whether the accessor is **enumerable** and \*_configurable_.

###### Defining Multiple Properties

It’s also possible to define multiple properties on an object simultaneously if you use **`Object.defineProperties()`**. This method takes two arguments:

1. The **target object** to modify.
2. An **object of property descriptors**, where each key is a property name and each value defines that property’s attributes.

```
const user = {};

Object.defineProperties(user, {
  name: {
    value: "Alice",
    writable: true,
    enumerable: true,
  },
  age: {
    value: 30,
    writable: false,
    enumerable: true,
  },
});
```

###### Retrieving Property Attributes

To **inspect a property’s attributes** in JavaScript, you can use
**`Object.getOwnPropertyDescriptor()`**. This method returns detailed information about how a property is defined, but it only works on the object’s **own properties**, not inherited ones. It takes two arguments:

1. The **object** to inspect.
2. The **property name** to retrieve.
   If the property exists, the method returns a **descriptor object** containing:

- `configurable`
- `enumerable`
- and either `value`/`writable` (for data properties) or `get`/`set` (for accessor properties).

```
const user = { name: "Alice" };
const descriptor = Object.getOwnPropertyDescriptor(user, "name");
console.log(descriptor);
// { value: "Alice", writable: true, enumerable: true, configurable: true }
```

---

#### Preventing object modification

Objects in JavaScript have internal attributes that control how flexible they are.  
One of these is **`[[Extensible]]`**, a Boolean value that determines whether **new properties can be added** to the object. By default, all objects are **extensible**

###### Preventing Extensions

**`Object.preventExtensions(obj)`** stops new properties from being added to `obj`.  
Existing properties remain unchanged, but you can still **modify** or **delete** them.

- Check if an object is extensible with **`Object.isExtensible(obj)`**.

```
const user = { name: "Alice" };
Object.preventExtensions(user);
user.age = 30; // fails silently (or throws in strict mode)
```

###### Sealing Objects

**`Object.seal(obj)`** goes a step further. You **can’t add or remove properties**. You **can’t change** a property’s type (data ↔ accessor). But you **can still read and write** existing data properties. Internally `[[Extensible]]` becomes `false`. All properties’ `[[Configurable]]` attributes become `false`.

- Check if an object is sealed with **`Object.isSealed(obj)`**.

```
const user = { name: "Alice" };
Object.seal(user);
delete user.name; // fails
user.name = "Bob"; // works
```

###### Freezing Objects

**`Object.freeze(obj)`** provides the **highest level of protection** as you **can’t add, remove, or modify** properties. All data properties become **read-only**. The object stays frozen permanently — it can’t be “unfrozen.”

- Check if an object is frozen with **`Object.isFrozen(obj)`**.

```
const user = { name: "Alice" };
Object.freeze(user);
user.name = "Bob"; // fails
```
