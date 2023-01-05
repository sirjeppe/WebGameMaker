'use strict';

class SpritePlugin {

    type = 'object';

    settings = {
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
        'fillStyle': {
            'name': 'Fill color',
            'initialValue': '#0000ff',
            'value': '#0000ff',
            'type': 'color',
        },
    };

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
            'x': this.settings.x.value + this.positionDiff.x,
            'y': this.settings.y.value + this.positionDiff.y,
            'width': this.settings.width.value,
            'height': this.settings.height.value
        }
    }

    draw(info) {
        info.canvasContext.fillStyle = this.settings.fillStyle.value;
        info.canvasContext.fillRect(
            this.settings.x.value + this.positionDiff.x,
            this.settings.y.value + this.positionDiff.y,
            this.settings.width.value,
            this.settings.height.value
        );
    }

    addCollisionHandler(callback) {
        collisionHandlers.push(callback);
    }

    onCollision(info) {
        for (var ch in collisionHandlers) {
            collisionHandlers[ch](this, info);
        }
    }
}

SpritePlugin.prototype.name = 'Sprite';
SpritePlugin.prototype.description = 'Adds a sprite to the game';

WebGameMaker.PluginManager.registerPlugin(SpritePlugin);
