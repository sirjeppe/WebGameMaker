'use strict';

import { Drawable } from "../core/drawable.js";
import { AttributeTypes } from "../core/game_object_attribute.js";

export class Text extends Drawable {

  constructor() {
    super();

    this.setAttribute(AttributeTypes.Boolean, 'collides', false, { defaultValue: false });
    this.setAttribute(AttributeTypes.String, 'font', 'Verdana', { defaultValue: 'Verdana' });
    this.setAttribute(AttributeTypes.Number, 'fontSize', 14, { defaultValue: 14 });
    this.setAttribute(AttributeTypes.String, 'text', 'Sample text', { defaultValue: 'Sample text' });
  }

  static getDescription() {
    return 'Lets you add text to the game';
  }

  draw(info) {
    info.canvasContext.fillStyle = this.getAttribute('fillStyle').value;
    info.canvasContext.font = this.getAttribute('fontSize').value + 'px ' + this.getAttribute('font').value;
    info.canvasContext.fillText(
      this.getAttribute('text').value,
      this.getAttribute('x').value,
      this.getAttribute('y').value
    );
  };

}
