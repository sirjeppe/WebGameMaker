'use strict';

export class AttributeTypes {
  static Number = Symbol('Number');
  static String = Symbol('String');
  static Boolean = Symbol('Boolean');
  static Color = Symbol('Color');
  static Enum = Symbol('Enum');
  static Button = Symbol('Button');
}

export class AttributeTypeInputMap {
  static Number = 'number';
  static String = 'text';
  static Boolean = 'checkbox';
  static Color = 'color';
  static Enum = 'enum';
  static Button = 'button';
}

export class UIExtraAttributes {
  min;
  max;
  step;
  callback;

  constructor(extraAttributesObject) {
    if (typeof (extraAttributesObject) === 'object') {
      for (const key in extraAttributesObject) {
        if (key in Object.keys(this)) {
          this[key] = value;
        }
      }
    }
  }

  setMinMax(min, max) {
    if (this.type === AttributeTypes.Number) {
      if (min == null || max == null) {
        throw Error('min/max cannot be undefined or null for UIExtraAttributes of type Number');
      }
      this.min = min;
      this.max = max;
    }
  }

  setStep(step) {
    this.step = step;
  }

  setCallback(callback) {
    this.callback = callback;
  }
}

export class GameObjectAttribute {
  type = null;
  name = null;
  #value = null;
  #selectedValues = null; // Special for enums
  #defaultValue = null;
  #readOnly = false;
  #exposeInUI = true;
  #uiAttributes = null;
  #uiElement = null;
  #uiExtraAttributes = null;

  constructor(attributeType, attributeName, attributeValue, attributeProperties) {
    if (attributeType == null || !AttributeTypes.hasOwnProperty(attributeType.description)) {
      throw Error('type cannot be undefined or null for UIExtraAttributes, must be of type UIInputTypes');
    }
    this.type = attributeType;

    if (attributeName == null || attributeName === '') {
      throw Error('attrName must not be omitted, null or empty');
    }
    this.name = attributeName;

    //attrValue, defaultValue, readOnly, exposeInUI, uiExtraAttributes

    // Check that attrValue is of type Array if type is Enum
    if (attributeType === AttributeTypes.Enum && (attributeValue == null || attributeValue instanceof Array === false)) {
      throw Error('attrValue must be of type Array when type is Enum')
    }
    this.value = attributeValue;
    this.defaultValue = attributeValue;

    this.setAttributeProperties(attributeProperties);
  }

  // Setter and getter for 'value'
  set value(attributeValue) {
    if (this.type === AttributeTypes.Number) {
      this.#value = Number(attributeValue);
    } else {
      this.#value = attributeValue;
    }
  }
  get value() {
    return this.#value;
  }

  // Setter and getter for 'defaultValue'
  set defaultValue(attributeValue) {
    if (this.type === AttributeTypes.Number) {
      this.#defaultValue = Number(attributeValue);
    } else {
      this.#defaultValue = attributeValue;
    }
  }
  get defaultValue() {
    return this.#defaultValue;
  }

  setAttributeProperties(attributeProperties) {
    if (attributeProperties == null) {
      return;
    }

    if ('defaultValue' in attributeProperties) {
      this.defaultValue = attributeProperties.defaultValue;
    }

    if ('readOnly' in attributeProperties && typeof attributeProperties.readOnly === 'boolean') {
      this.#readOnly = attributeProperties.readOnly;
    }

    if ('exposeInUI' in attributeProperties && typeof attributeProperties.exposeInUI === 'boolean') {
      this.#exposeInUI = attributeProperties.exposeInUI;
    }

    if ('uiExtraAttributes' in attributeProperties && typeof attributeProperties.uiExtraAttributes === 'object' && attributeProperties.uiExtraAttributes instanceof UIExtraAttributes) {
      this.#uiExtraAttributes = attributeProperties.uiExtraAttributes;
    }
  }

  getHTMLElement() {
    if (!this.#exposeInUI) {
      throw Error('Attribute is not exposed to UI shouldn\'t be called getHTMLElement() upon');
    }

    // Create the element if not already created
    if (this.#uiElement == null) {

      // Enum type
      if (this.type === AttributeTypes.Enum) {
        const inputElem = document.createElement('select');
        for (const [option, i] of this.value.entries()) {
          let o = document.createElement('option');
          o.value = option.value;
          o.textContent = option.name;
          if (o.value == this.defaultValue) {
            o.selected = 'selected';
          }
          inputElem.options.add(o);
        }
        this.#uiElement = inputElem;

      // Input type
      } else {
        const inputElem = document.createElement('input');
        inputElem.type = AttributeTypeInputMap[this.type.description];
        // Checkboxes takes 'checked', not 'value'
        if (this.type === AttributeTypes.Boolean) {
          inputElem.checked = this.defaultValue;
        } else {
          inputElem.value = this.defaultValue;
        }
        if (this.type === AttributeTypes.Button) {
          inputElem.onclick = this.#uiAttributes.callback;
        }
        this.#uiElement = inputElem;
      }

      if (this.#readOnly) {
        this.#uiElement.readOnly = true;
      }

    }

    return this.#uiElement;
  }

  copy() {
    return new Object(this);
  }
}

export class GameObjectAttributeCollection {
  attributes = {};

  setAttribute(type, attributeName, attributeValue, attributeProperties) {
    if (attributeProperties != null && typeof (attributeProperties) !== 'object') {
      throw Error('attributeProperties must be of type object')
    }

    // Find already existing attribute
    if (attributeName in this.attributes) {
      // Double check type is not changing before allowing changing the value
      if (this.attributes[attributeName].type !== type) {
        throw Error(`Attribute ${attributeName} cannot be changed from ${this.attributes[attributeName].type.description} to ${type.description}`);
      }
      this.attributes[attributeName].value = attributeValue;
      if (attributeProperties != null) {
        this.attributes[attributeName].setAttributeProperties(attributeProperties);
      }
    } else {
      this.attributes[attributeName] = new GameObjectAttribute(type, attributeName, attributeValue, attributeProperties);
    }
  }

  getAttribute(attributeName) {
    if (attributeName in this.attributes) {
      return this.attributes[attributeName];
    }

    return undefined;
  }

  getAttributes() {
    return this.attributes;
  }

  copy() {
    const copy = new GameObjectAttributeCollection();
    for (const attribute in this.attributes) {
      copy.attributes[attribute] = this.attributes[attribute].copy();
    }
    return copy;
  }
}
