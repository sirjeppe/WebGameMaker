'use strict';

import { GameObject } from "../game_object.js";

export class AudioSource extends GameObject {
  inputParams;
  outputChannels;

  play() {
    throw Error('play() must be overridden in class instance!');
  }

  pause() {
    throw Error('pause() must be overridden in class instance!');
  }

  stop() {
    throw Error('stop() must be overridden in class instance!');
  }
}