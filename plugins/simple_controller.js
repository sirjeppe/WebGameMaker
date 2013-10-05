"use strict";

function SimpleControllerPlugin () {

    this.type = 'controller';
    this.state = 'paused';

    this.settings = {
        'id': {
            'initialValue': 'simpleController',
            'value': 'simpleController',
            'type': 'text',
        },
        'objectID': {
            'initialValue': '',
            'value': '',
            'type': 'objectList'
        },
        'speedX': {
            'initialValue': 1,
            'value': 1,
            'type': 'number',
        },
        'speedY': {
            'initialValue': 1,
            'value': 1,
            'type': 'number',
        },
        'timeInterval': {
            'initialValue': 1000,
            'value': 1000,
            'type': 'number',
        }
    };

    this.initialize = function() {
        var object = WebGameMaker.Game.getPluginById(
                this.settings.objectID.value);
        object.addCollisionHandler(bind(this, function(obj, info) {
            var topCollision = info.collidedWith[0].collisionData.topLeftCollision && info.collidedWith[0].collisionData.topRightCollision;
            var rightCollision = info.collidedWith[0].collisionData.topRightCollision && info.collidedWith[0].collisionData.bottomRightCollision;
            var bottomCollision = info.collidedWith[0].collisionData.bottomRightCollision && info.collidedWith[0].collisionData.bottomLeftCollision;
            var leftCollision = info.collidedWith[0].collisionData.bottomLeftCollision && info.collidedWith[0].collisionData.topLeftCollision;
            if (topCollision || bottomCollision) {
                this.settings.speedY.value = -this.settings.speedY.value;
            } else {
                this.settings.speedX.value = -this.settings.speedX.value;
            }

            obj.move(this.settings.speedX.value, this.settings.speedY.value);
        }));
    }

    this.play = function() {
        this.state = 'playing';
        bind(this, this.update)();
    }

    this.pause = function() {
        this.state = 'paused';
    }

    this.reset = function() {
        this.pause();
    }

    this.update = function() {
        if (this.state != 'playing')
            return;

        var object = WebGameMaker.Game.getPluginById(
                this.settings.objectID.value);

        if (object)
            object.move(this.settings.speedX.value, this.settings.speedY.value);
        else
            console.log('Invalid object id given: ' +
                this.settings.objectID.value);

        setTimeout(bind(this, this.update), this.settings.timeInterval.value);
    }
}

SimpleControllerPlugin.prototype.name = 'SimpleController';
SimpleControllerPlugin.prototype.description = 'Simple controller for moving '
                                               'objects around';

WebGameMaker.PluginManager.registerPlugin(SimpleControllerPlugin);
