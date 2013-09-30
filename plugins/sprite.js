"use strict";

function SpritePlugin() {

    this.type = 'object';

    this.settings = {
        'id': {
            'initial_value': 'sprite',
            'value': 'sprite',
            'type': 'text',
        },
        'x': {
            'initial_value': 0,
            'value': 0,
            'type': 'number',
        },
        'y': {
            'initial_value': 0,
            'value': 0,
            'type': 'number',
        },
        'width': {
            'initial_value': 100,
            'value': 100,
            'type': 'number',
        },
        'height': {
            'initial_value': 100,
            'value': 100,
            'type': 'number',
        },
        'zIndex': {
            'initial_value': 1,
            'value': 1,
            'type': 'number',
        },
        'speedX': {
            'initial_value': 0,
            'value': 0,
            'type': 'number',
            'extraAttributes': {
                'step': 'any'
            },
        },
        'speedY': {
            'initial_value': 0,
            'value': 0,
            'type': 'number',
            'extraAttributes': {
                'step': 'any'
            },
        },
        'weight': {
            'initial_value': 1,
            'value': 1,
            'type': 'number',
            'extraAttributes': {
                'step': 'any'
            },
        },
        'fill_style': {
            'initial_value': '#0000ff',
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
