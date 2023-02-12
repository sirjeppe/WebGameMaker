'use strict';

import { GameObject } from "./game_object.js";
import { AttributeTypes } from "./game_object_attribute.js";

export class Drawable extends GameObject {
  constructor() {
    super();

    // Set attributes
    this.setAttribute(AttributeTypes.Number, 'x', 0)
      .setAttribute(AttributeTypes.Number, 'y', 0)
      .setAttribute(AttributeTypes.Number, 'width', 0)
      .setAttribute(AttributeTypes.Number, 'height', 0)
      .setAttribute(AttributeTypes.Number, 'zIndex', 0)
      .setAttribute(AttributeTypes.Number, 'speedX', 0)
      .setAttribute(AttributeTypes.Number, 'speedY', 0)
      .setAttribute(AttributeTypes.Boolean, 'collides', true)
      .setAttribute(AttributeTypes.Number, 'weight', true)
      .setAttribute(AttributeTypes.Color, 'fillStyle', '#0000ff');

    // this.attributes = {
    //   'id': {
    //     'name': 'ID',
    //     'initialValue': 'sprite',
    //     'value': 'sprite',
    //     'type': 'text',
    //   },
    //   'speedX': {
    //       'name': 'X speed',
    //       'initialValue': 0,
    //       'value': 0,
    //       'type': 'number',
    //       'extraAttributes': {
    //           'step': 'any'
    //       },
    //   },
    //   'speedY': {
    //       'name': 'Y speed',
    //       'initialValue': 0,
    //       'value': 0,
    //       'type': 'number',
    //       'extraAttributes': {
    //           'step': 'any'
    //       },
    //   },
    //   'collides': {
    //       'name': 'Collides',
    //       'initialValue': true,
    //       'value': true,
    //       'type': 'checkbox',
    //   },
    //   'weight': {
    //       'name': 'Weight',
    //       'initialValue': 1,
    //       'value': 1,
    //       'type': 'number',
    //       'extraAttributes': {
    //           'step': 'any'
    //       },
    //   },
    //   'fillStyle': {
    //       'name': 'Fill color',
    //       'initialValue': '#0000ff',
    //       'value': '#0000ff',
    //       'type': 'color',
    //   },
    // }
  }

  draw() {
    throw Error('draw() must be overridden in class instance');
  }
}