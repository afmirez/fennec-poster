---
# 🧩 FRONTMATTER
# • Fill in all fields.
# • Use strings (except 'order' = integer).
# • 'tags' must be a list of valid strings: JavaScript, Python.
# • ⚠️ Do NOT edit 'category' or 'id'.

title: "Primitive and reference types"
description: "Primitive and reference types"
order: 1
tags: ["JavaScript"]
category: The-Principles-of-Object-Oriented-JavaScript
id: d40b72af-70b6-4201-be69-cb38792b95f1
---

# Primitive and reference types

JavaScript makes objects central: almost all data is either an object or accessed through objects.

#### What are types?

- **Primitives** are stored directly as simple values.
- **References** are stored as objects. Variables hold a pointer to the memory location of the object.

---

#### Primitive Types

When assigned, primitives are copied **by value**: the variable directly holds the value itself, so each variable has its own independent copy, and changes don’t affect others.

- `Boolean, Number, String, Null, Undefined.`
- Each has a literal form (e.g., `true`, `42`, `"text"`).

Use the `typeof` operator to get a string indicating the type of data.

###### Primitive Wrapper Types

In JavaScript, primitive values `boolean`, `number`, and `string` are not objects, but the language provides a mechanism called **primitive wrapper types**.

When you call a method on a primitive:

```
const name = "Goku";
console.log(name.toUpperCase());
```

JavaScript automatically creates a temporary object (`Boolean`, `Number`, or `String`) that provides access to methods and properties. This object is immediately destroyed after the operation, which is why you cannot add custom properties to primitives.

This design keeps primitives lightweight and efficient while still giving them object-like behavior when needed.

---

#### Reference Types

Represent objects in JavaScript. An object is an unordered collection of properties, where each property has a string key and a value. If the value is a function, it’s called a _method_.

A **constructor** is just a function invoked with `new` to create an object:

```
var object = new Object();
```

When you assign an object to a variable, you’re assigning a pointer. Copying that variable only copies the pointer, so both variables reference the same object in memory.

###### Built-in types

JavaScript provides reference types like **Array, Date, Error, Function, Object, RegExp**, which can be created with `new()`. Many also have **literal forms**—syntax to define values without explicitly calling a constructor.

Object and Array Literals

- **Object literal**: define properties inside `{}`.
- **Array literal**: list comma-separated values inside `[]`.

Function literals: Almost always defined with their literal form

```
function reflect(value) {
  return value;
}
```

Regular Expression Literals: Defined with `/pattern/flags` instead of `new RegExp()`.

```
var numbers = /\d+/g;
```

###### Property Access

Name/value pairs stored on an object. They can be accessed with **dot notation** or with **bracket notation**, where the property name is given as a string.

```
var arr = [];
array.push("Hello");
array["push"]("Bye");
```

###### Identifying reference Types

When working with objects, `typeof` isn’t very helpful because it returns `"object"` for all reference types, making it hard to distinguish between them (the exception is functions, where `typeof` returns `"function"`).

`instanceof` is more useful: it checks whether a value was created by a specific constructor. It takes an object and a constructor as parameters, returning `true` if the object is an instance of that type, and `false` otherwise.

```
var items = [];
var object = {};
function reflect(value) {
  return value;
}

console.log(items instanceof Array);
console.log(items instanceof Object);
console.log(object instanceof Object);
console.log(object instanceof Array);
console.log(reflect instanceof Function);
console.log(reflect instanceof Object);
```

###### Identifying Arrays

When working with multiple frames or iframes, using `instanceof` to check if a value is an array can be unreliable. Each frame has its own global context (and its own `Array` constructor), so an array created in one frame is not recognized as an instance of `Array` in another.

To avoid this issue, the safer and consistent way to detect arrays is by using `Array.isArray()`. This method should return true when it receives a value that is a native array from any context.
