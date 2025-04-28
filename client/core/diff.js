import { createElement } from "./dom.js";

function diff(oldVNode, newVNode) {
  if (!oldVNode || !newVNode) return;
  const parentEl = oldVNode.ref;
  const oldChildren = oldVNode.children || [];
  const newChildren = newVNode.children || [];

  let currentDomIndex = 0;
  const matchedOld = new Set();

  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    let matchIndex = -1;

    // Prefer key-based match if available
    if (newChild.props?.key != null) {
      for (let j = 0; j < oldChildren.length; j++) {
        if (matchedOld.has(j)) continue;

        const oldChild = oldChildren[j];
        if (oldChild.props?.key === newChild.props.key) {
          matchIndex = j;
          break;
        }
      }
    }

    // Fallback: match by tag/type
    if (matchIndex === -1) {
      for (let j = 0; j < oldChildren.length; j++) {
        if (matchedOld.has(j)) continue;

        const oldChild = oldChildren[j];
        const isMatch =
          (newChild.tag && oldChild.tag && newChild.tag === oldChild.tag) ||
          (newChild.type === "text" && oldChild.type === "text");

        if (isMatch) {
          matchIndex = j;
          break;
        }
      }
    }

    if (matchIndex !== -1) {
      const oldChild = oldChildren[matchIndex];
      patchElement(oldChild, newChild);
      if (newChild.tag) {
        diff(oldChild, newChild); // recurse
      }
      matchedOld.add(matchIndex);

      const existing = oldChild.ref;
      const refAtIndex = parentEl.childNodes[currentDomIndex];
      if (refAtIndex !== existing) {
        parentEl.insertBefore(existing, refAtIndex || null);
      }

      newChild.ref = existing;
    } else {
      if (typeof newChild != "boolean") {
        const newEl = createElement(newChild);
        newChild.ref = newEl;
        const refAtIndex = parentEl.childNodes[currentDomIndex];
        parentEl.insertBefore(newEl, refAtIndex || null);
      } 
    }

    currentDomIndex++;
  }

  // Remove unmatched old nodes
  oldChildren.forEach((oldChild, index) => {
    if (!matchedOld.has(index)) {
      oldChild.ref?.remove();
    }
  });

  oldVNode.children = newVNode.children;
}

function patchElement(oldVNode, newVNode) {
  const el = oldVNode.ref;
  newVNode.ref = el;

  if (newVNode.tag === 'input'){
    if (newVNode?.props?.value !== undefined) {
      newVNode.ref.value = newVNode.props.value;
    }
    // Apply styles to input
    if (newVNode.props?.style) {
      Object.assign(el.style, newVNode.props.style);
    }
    return;
  }

  if (newVNode.type === "text") {
    if (newVNode.value !== oldVNode.value) {
      el.nodeValue = newVNode.value;
    }
    // Apply styles to text node
    if (newVNode.props?.style) {
      Object.assign(el.style, newVNode.props.style);
    }
    return;
  }

  const oldProps = oldVNode.props || {};
  const newProps = newVNode.props || {};

  // Handle style updates
  if (newProps.style) {
    // Clear old styles first
    if (oldProps.style) {
      Object.keys(oldProps.style).forEach(key => {
        el.style[key] = '';
      });
    }
    // Apply new styles
    Object.assign(el.style, newProps.style);
  } else if (oldProps.style) {
    // Clear old styles if new node doesn't have styles
    Object.keys(oldProps.style).forEach(key => {
      el.style[key] = '';
    });
  }

  // Handle other props
  Object.keys(newProps).forEach((key) => {
    if (key === 'style') return; // Skip style as it's handled above
    
    const val = newProps[key];
    const oldVal = oldProps[key];

    if (val !== oldVal) {
      if (key.startsWith("on") && typeof val === "function") {
        el[key.toLowerCase()] = val;
      } else if (key === "className") {
        el.className = val;
      } else {
        el.setAttribute(key, val);
      }
    }
  });

  Object.keys(oldProps).forEach((key) => {
    if (key === 'style') return; // Skip style as it's handled above
    
    if (!(key in newProps)) {
      if (key.startsWith("on")) {
        el[key.toLowerCase()] = null;
      } else {
        el.removeAttribute(key);
      }
    }
  });
}

export { diff };
