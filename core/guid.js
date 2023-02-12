'use strict';

export class Guid {
  #value;

  constructor() {
    this.#value = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
    
    // Force first char to be a-f to comply with id attribute value limitations
    if (this.#value[0].match(/\d/)) {
      this.#value = String.fromCharCode(97 + crypto.getRandomValues(new Uint8Array(1))[0] % 6) + this.#value.substring(1);
    }
  }

  toString() {
    return this.#value;
  }
}
