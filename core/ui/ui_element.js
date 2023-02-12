'use strict';

import { Guid } from "../guid.js";

class PropsCollection {
  node;
  strings;
  props = [];

  constructor(node, strings) {
    this.node =  node;
    this.strings = strings;
  }
}

export class UIElement {
  #id;
  #context;
  #element;
  #bindings;
  #bindingRegexp = /\{\{([^}]+)\}\}/g;
  #cssRegexp = /(^(?:\s|[^@{])*?|[},]\s*)(\/\/.*\s+|.*\/\*[^*]*\*\/\s*|@media.*{\s*|@font-face.*{\s*)*([.#]?-?[_a-zA-Z]+[_a-zA-Z0-9-]*)(?=[^}]*{)/g;
  #css;

  constructor() {
    this.#id = new Guid();
  }

  setCSS(css) {
    this.#css = css.replace(this.#cssRegexp, `$1$2 #${this.#id} $3`);

    // Apply if we already have a template
    if (this.#element) {
      let styleElement = this.#element.querySelector(`#${this.#id}-style`);
      if (styleElement) {
        styleElement.innerHTML = this.#css;  
      }
    }
  }

  setTemplate(templateCode) {
    // Parse DOM tree
    this.#element = new DOMParser().parseFromString(templateCode, 'text/html').querySelector('body').firstChild;
    this.#element.id = this.#id;

    // Traverse the tree and map bindings
    this.#traverseAndMapBindings(this.#element);

    // Insert <style> element for the styling
    const styleElement = document.createElement('style');
    styleElement.id = `${this.#id}-style`;
    this.#element.prepend(styleElement);

    // Apply css if we have it
    if (this.#css) {
      styleElement.innerHTML = this.#css;
    }
  }

  bindContext(context) {
    // Replace object with a proxy
    const that = this;
    this.#context = new Proxy(context, {
      set(obj, prop, value) {
        obj[prop] = value;
        const listIndex = that.#bindings[prop].props.indexOf(prop) * 2 + 1;
        that.#bindings[prop].strings[listIndex] = value;
        that.#applyBindings(true);
      }
    });
    this.#applyBindings();
    return this.#context;
  }

  getElement() {
    return this.#element;
  }

  #indexAndSplit(matches) {
    let list = [];
    let searchMe = matches[0].input;
    for (const match of matches) {
      const splitText = searchMe.split(match[0]);
      searchMe = splitText[1];
      list = list.concat([splitText[0], match[0]]);
    }
    if (searchMe.length) {
      list.push(searchMe);
    }
    return list;
  }

  #applyBindings(contextUpdated) {
    if (!this.#context) {
      return;
    }

    for (const binding of this.#bindings._) {
      if (!contextUpdated) {
        for (const i in binding.props) {
          const key = binding.props[i];
          if (key in this.#context) {
            const listIndex = parseInt(i) * 2 + 1;
            binding.strings[listIndex] = this.#context[key];
          }
        }
      }
      binding.node.nodeValue = binding.strings.join('');
    }
  }

  #traverseAndMapBindings(elm) {
    // Reset any previous bindings
    if (elm.parentNode.nodeName === 'BODY') {
      this.#bindings = {
        _: []
      };
    }

    for (const childNode of elm.childNodes) {
      if (childNode.firstElementChild) {
        this.#traverseAndMapBindings(childNode);
      } else {
        // element - 1
        // attribute - 2
        // text - 3
        // comment - 8
        if (childNode.nodeType === 1) {
          // Go through atrributes
          for (const attr of childNode.attributes) {
            if (attr.nodeType === 2) {
              const matches = [...attr.nodeValue.matchAll(this.#bindingRegexp)];
              if (matches.length) {
                const propsCollection = new PropsCollection(attr, this.#indexAndSplit(matches));
                for (let i = 0; i < matches.length; i++) {
                  const match = matches[i];
                  const prop = match[1];
                  this.#bindings[prop] = propsCollection;
                  propsCollection.props.push(prop);
                }
                this.#bindings._.push(propsCollection);
              }
            }
          }
        } else if (childNode.nodeType === 3) {
          const matches = this.#bindingRegexp.exec(childNode.nodeValue);
        }
      }
    }

    // Apply bindings to elements
    if (elm.parentNode.nodeName === 'BODY') {
      this.#applyBindings();
    }
  }
}