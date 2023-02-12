'use strict';

import { Guid } from "./guid.js";
import { AttributeTypes, GameObjectAttribute, GameObjectAttributeCollection } from "./game_object_attribute.js";

export class GameObject {
  // Public attributes
  attributesCollection = new GameObjectAttributeCollection();
  runtimeAttributesCollection = new GameObjectAttributeCollection();
  id = null;
  
  constructor() {
    this.id = new Guid();

    // Default name is always just 'defaultName' for all game objects
    this.setAttribute(AttributeTypes.String, 'name', 'defaultName');
  }

  static getDescription() {
    throw Error('getDescription() must be overridden in class instance!');
  }

  setAttribute(type, attributeName, attributeValue, attributeProperties) {
    this.attributesCollection.setAttribute(type, attributeName, attributeValue, attributeProperties);

    return this;
  }

  getAttribute(attributeName) {
    return this.attributesCollection.getAttribute(attributeName);
  }

  getAttributes() {
    return this.attributesCollection.getAttributes();
  }

  getRuntimeAttribute(attributeName) {
    return this.runtimeAttributesCollection.getAttribute(attributeName);
  }

  getRuntimeAttributes() {
    return this.runtimeAttributesCollection.getAttributes();
  }

  reset() {
    this.runtimeAttributesCollection = this.attributesCollection.copy();
  }

  tick() {
    throw Error('tick() must be overridden in class instance!');
  }
}