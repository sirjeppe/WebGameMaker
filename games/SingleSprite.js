'use strict';

import { Game } from "../core/game.js";
import { Sprite } from "../plugins/sprite.js";

export class SingleSprite extends Game {
  constructor() {
    super();
    const sprite = new Sprite();
    sprite.move(10, 10);
    this.addPluginInstance(sprite);
  }
}
