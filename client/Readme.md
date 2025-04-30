# Mini Frontend Framework Documentation

This documentation provides a comprehensive guide to our lightweight frontend framework, designed for creating simple, reactive web applications with a component-based approach.

## Framework Overview

Our framework offers a minimalist yet powerful approach to building web applications with the following features:

- **JSX-like Syntax**: Create UI elements using a familiar syntax similar to React
- **Component-Based Architecture**: Build UIs by composing reusable components
- **State Management**: Simple Redux-like store for application state
- **Event Handling**: Custom event system for DOM interactions
- **Routing**: Basic hash-based routing for navigation between views

## Core Concepts

### Creating Elements

The framework uses a JSX-like syntax to create DOM elements. You can create elements using the `jsx` function.

```javascript
// Basic element creation
const div = DOM.Jsx("div", { classNam: "div" }, "exmple");

const buttom = DOM.Jsx("botton", { classNam: "button" }, "click me");
```

### Event Handling

The framework provides a custom event system for handling DOM events:

```javascript
// Adding a click event
const button = DOM.Jsx(
  "button",
  {
    onClick: (event) => {
      console.log("Button clicked!", event);
    },
  },
  "Click Me"
);

// Adding other events
const input = DOM.Jsx("input", {
  type: "text",
  onKeyup: (event) => {
    if (event.key === "Enter") {
      console.log("Enter pressed!", event.target.value);
    }
  },
});
```

The framework automatically converts attributes like `onClick` to proper DOM event listeners. All standard DOM events are supported - just prefix them with `on` followed by the event name in camelCase (e.g., `onClick`, `onSubmit`, `onKeyup`).

### Nesting Elements

Elements can be nested to create complex UI structures:

```javascript
// Complex nested structure
const userProfile = DOM.Jsx(
  "div",
  { className: "profile" },
  DOM.Jsx(
    "div",
    { className: "profile-header" },
    DOM.Jsx("img", { src: "avatar.png", className: "avatar" }),
    DOM.Jsx("h2", { className: "username" }, "John Doe")
  ),
  DOM.Jsx(
    "div",
    { className: "profile-body" },
    DOM.Jsx("p", { className: "bio" }, "Frontend Developer"),
    DOM.Jsx(
      "div",
      { className: "stats" },
      DOM.Jsx("span", {}, "Posts: 42"),
      DOM.Jsx("span", {}, "Followers: 1024")
    )
  )
);
```

You can also use the spread operator with arrays of children:

```javascript
const items = ["Apple", "Banana", "Cherry"];
const list = DOM.Jsx(
  "ul",
  { className: "fruit-list" },
  ...items.map((item) => DOM.Jsx("li", {}, item))
);
```

### Components

Components are functions that return JSX elements. They let you create reusable pieces of UI:

```javascript
function Button({ text, onClick }) {
  return DOM.Jsx(
    "button",
    {
      className: "custom-button",
      onClick,
    },
    text
  );
}

// Using the component
const myButton = DOM.Jsx(Button, {
  text: "Submit",
  onClick: () => console.log("Button clicked"),
});
```

### Adding Attributes

You can add various HTML attributes to elements:

```javascript
// Standard attributes
const image = DOM.Jsx("img", {
  src: "image.jpg",
  alt: "Description",
  width: "100",
  height: "100",
});

// Using className for CSS classes
const styledDiv = DOM.Jsx("div", {
  className: "container primary large",
  id: "main-container",
});

// Inline styles (as string)
const styledElement = DOM.Jsx(
  "p",
  {
    style: "color: blue; font-size: 16px;",
  },
  "Styled text"
);
```

## State Management

The framework includes a simple Redux-like store for state management:

```javascript
// Counter component
function Counter() {
  const [count, setCount] = DOM.useStates(0);

  return DOM.Jsx(
    "div",
    { className: "counter" },
    DOM.Jsx("h1", {}, "Counter App"),
    DOM.Jsx("div", { className: "counter-display" }, count),
    DOM.Jsx(
      "div",
      { className: "counter-controls" },
      DOM.Jsx(
        "button",
        {
          className: "btn decrement",
          onClick: () => {
            setCount((pre) => pre + 1);
          },
        },
        "-"
      ),
      DOM.Jsx(
        "button",
        {
          className: "btn increment",
          onClick: () => {
            store.dispatch({ type: "INCREMENT" });
            update();
          },
        },
        "+"
      )
    )
  );
}

// Render application

import { router } from "router.js";
// for defend rout and its style
router.defend("/", Counter, ["./style.css"]);

// for start routing
router.init();
```

## Implementation Details

### How the JSX Function Works

The `jsx` function creates virtual DOM nodes:

```javascript
function Jsx(tag, props, ...children) {
  if (typeof tag === "function") {
    return tag({ ...props, children });
  }

  return { tag, props: props || {}, children };
}
```

If `tag` is a function, it's treated as a component and called with props. Otherwise, it creates a virtual node object with the tag name, attributes, and children.

### How Element Creation Works

The framework transforms virtual DOM nodes into real DOM elements:

This function:

1. Creates text nodes for string/number values
2. Creates DOM elements for tags
3. Sets attributes and registers event listeners
4. Recursively processes and appends children

### Event System

The custom event system abstracts DOM event handling:

## Best Practices

1. **Component Organization**: Create small, focused components for better reusability
2. **State Management**: Keep application state centralized in the store
3. **Event Handling**: Use the framework's event system for all DOM interactions
4. **Re-rendering**: Call the update function after state changes to refresh the UI
5. **Routing**: Use hash-based routing for navigation between views

## Conclusion

This mini framework provides a simple yet effective way to build web applications with a component-based approach. While it lacks some features of larger frameworks, it offers enough functionality for small to medium-sized applications while maintaining a small footprint.

## for run server

```bash
  npm start
```

