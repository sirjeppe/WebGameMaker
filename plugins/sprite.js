'use strict';

import { Drawable } from "../core/drawable.js";
import { AttributeTypes } from "../core/game_object_attribute.js";

export class Sprite extends Drawable {

    constructor() {
        super();

        this.setAttribute(AttributeTypes.Number, 'width', 100)
            .setAttribute(AttributeTypes.Number, 'height', 100);
    }

    static getDescription() {
        return 'Adds a sprite to the game';
    }

    // settings = {
    //     'id': {
    //         'name': 'ID',
    //         'initialValue': 'sprite',
    //         'value': 'sprite',
    //         'type': 'text',
    //     },
    //     'x': {
    //         'name': 'X',
    //         'initialValue': 0,
    //         'value': 0,
    //         'type': 'number',
    //     },
    //     'y': {
    //         'name': 'Y',
    //         'initialValue': 0,
    //         'value': 0,
    //         'type': 'number',
    //     },
    //     'width': {
    //         'name': 'Width',
    //         'initialValue': 100,
    //         'value': 100,
    //         'type': 'number',
    //     },
    //     'height': {
    //         'name': 'Height',
    //         'initialValue': 100,
    //         'value': 100,
    //         'type': 'number',
    //     },
    //     'zIndex': {
    //         'name': 'Z index',
    //         'initialValue': 1,
    //         'value': 1,
    //         'type': 'number',
    //     },
    //     'speedX': {
    //         'name': 'X speed',
    //         'initialValue': 0,
    //         'value': 0,
    //         'type': 'number',
    //         'extraAttributes': {
    //             'step': 'any'
    //         },
    //     },
    //     'speedY': {
    //         'name': 'Y speed',
    //         'initialValue': 0,
    //         'value': 0,
    //         'type': 'number',
    //         'extraAttributes': {
    //             'step': 'any'
    //         },
    //     },
    //     'collides': {
    //         'name': 'Collides',
    //         'initialValue': true,
    //         'value': true,
    //         'type': 'checkbox',
    //     },
    //     'weight': {
    //         'name': 'Weight',
    //         'initialValue': 1,
    //         'value': 1,
    //         'type': 'number',
    //         'extraAttributes': {
    //             'step': 'any'
    //         },
    //     },
    //     'fillStyle': {
    //         'name': 'Fill color',
    //         'initialValue': '#0000ff',
    //         'value': '#0000ff',
    //         'type': 'color',
    //     },
    // };

    collisionHandlers = [];

    positionDiff = {
        'x': 0,
        'y': 0,
    }

    initialize() {
        //collisionHandlers = [];
    }

    play() {}

    pause() {}

    reset() {
        this.positionDiff.x = 0;
        this.positionDiff.y = 0;
    }

    move(x, y) {
        this.positionDiff.x += x;
        this.positionDiff.y += y;
    }

    getLocation() {
        return {
            'x': this.getAttribute('x').value + this.positionDiff.x,
            'y': this.getAttribute('y').value + this.positionDiff.y,
            'width': this.getAttribute('width').value,
            'height': this.getAttribute('height').value
        }
    }

    draw(info) {
        info.canvasContext.fillStyle = this.getAttribute('fillStyle').value;
        info.canvasContext.fillRect(
            this.getAttribute('x').value + this.positionDiff.x,
            this.getAttribute('y').value + this.positionDiff.y,
            this.getAttribute('width').value,
            this.getAttribute('height').value
        );
    }

    addCollisionHandler(callback) {
        this.collisionHandlers.push(callback);
    }

    onCollision(info) {
        for (const ch of this.collisionHandlers) {
            ch(this, info);
        }
    }
}
