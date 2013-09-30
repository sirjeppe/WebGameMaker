"use strict";

function SpritePlugin() {

    this.type = 'object';

    this.settings = {
        'id': {
            'name': 'ID',
            'initialValue': 'sprite',
            'value': 'sprite',
            'type': 'text',
        },
        'x': {
            'name': 'X',
            'initialValue': 0,
            'value': 0,
            'type': 'number',
        },
        'y': {
            'name': 'Y',
            'initialValue': 0,
            'value': 0,
            'type': 'number',
        },
        'width': {
            'name': 'Width',
            'initialValue': 100,
            'value': 100,
            'type': 'number',
        },
        'height': {
            'name': 'Height',
            'initialValue': 100,
            'value': 100,
            'type': 'number',
        },
        'zIndex': {
            'name': 'Z index',
            'initialValue': 1,
            'value': 1,
            'type': 'number',
        },
        'speedX': {
            'name': 'X speed',
            'initialValue': 0,
            'value': 0,
            'type': 'number',
            'extraAttributes': {
                'step': 'any'
            },
        },
        'speedY': {
            'name': 'Y speed',
            'initialValue': 0,
            'value': 0,
            'type': 'number',
            'extraAttributes': {
                'step': 'any'
            },
        },
        'collides': {
            'name': 'Collides',
            'initialValue': true,
            'value': true,
            'type': 'checkbox',
        },
        'weight': {
            'name': 'Weight',
            'initialValue': 1,
            'value': 1,
            'type': 'number',
            'extraAttributes': {
                'step': 'any'
            },
        },
        'fill_style': {
            'name': 'Fill color',
            'initialValue': '#0000ff',
            'value': '#0000ff',
            'type': 'color',
        },
    };

    var collisionHandlers = [];

    var positionDiff = {
        'x': 0,
        'y': 0,
    }

    this.initialize = function() {
        //collisionHandlers = [];
    }

    this.play = function() {
    }

    this.pause = function() {
    }

    this.reset = function() {
        positionDiff.x = 0;
        positionDiff.y = 0;
    }

    this.move = function(x, y) {
        positionDiff.x += x;
        positionDiff.y += y;
    }

    this.getLocation = function() {
        return {
            'x': this.settings.x.value + positionDiff.x,
            'y': this.settings.y.value + positionDiff.y,
            'width': this.settings.width.value,
            'height': this.settings.height.value
        }
    }

    this.draw = function(info) {
        info.canvas_context.fillStyle = this.settings.fill_style.value;
        info.canvas_context.fillRect(
                this.settings.x.value + positionDiff.x,
                this.settings.y.value + positionDiff.y,
                this.settings.width.value,
                this.settings.height.value);
    }

    this.addCollisionHandler = function(callback) {
        collisionHandlers.push(callback);
    }

    this.onCollision = function(info) {
        for (var ch in collisionHandlers) {
            collisionHandlers[ch](this, info);
        }
    }
}

SpritePlugin.prototype.name = 'Sprite';
SpritePlugin.prototype.description = 'Adds a sprite to the game';

WebGameMaker.PluginManager.registerPlugin(SpritePlugin);
