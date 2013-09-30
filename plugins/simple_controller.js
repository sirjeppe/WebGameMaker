"use strict";

function SimpleControllerPlugin () {

    this.type = 'controller';
    this.state = 'paused';

    this.settings = {
        'id': {
            'initialValue': 'simple_controller',
            'value': 'simple_controller',
            'type': 'text',
        },
        'object_id': {
            'initialValue': '',
            'value': '',
            'type': 'text'
        },
        'speed_x': {
            'initialValue': 1,
            'value': 1,
            'type': 'number',
        },
        'speed_y': {
            'initialValue': 1,
            'value': 1,
            'type': 'number',
        },
        'time_interval': {
            'initialValue': 1000,
            'value': 1000,
            'type': 'number',
        }
    };

    this.initialize = function() {
        var object = WebGameMaker.Game.getPluginById(
                this.settings.object_id.value);
        object.addCollisionHandler(bind(this, function(obj, info) {
            var topCollision = info.collidedWith[0].collisionData.topLeftCollision && info.collidedWith[0].collisionData.topRightCollision;
            var rightCollision = info.collidedWith[0].collisionData.topRightCollision && info.collidedWith[0].collisionData.bottomRightCollision;
            var bottomCollision = info.collidedWith[0].collisionData.bottomRightCollision && info.collidedWith[0].collisionData.bottomLeftCollision;
            var leftCollision = info.collidedWith[0].collisionData.bottomLeftCollision && info.collidedWith[0].collisionData.topLeftCollision;
            if (topCollision || bottomCollision) {
                this.settings.speed_y.value = -this.settings.speed_y.value;
            } else {
                this.settings.speed_x.value = -this.settings.speed_x.value;
            }

            obj.move(this.settings.speed_x.value, this.settings.speed_y.value);
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
                this.settings.object_id.value);

        if (object)
            object.move(this.settings.speed_x.value, this.settings.speed_y.value);
        else
            console.log('Invalid object id given: ' +
                this.settings.object_id.value);

        setTimeout(bind(this, this.update), this.settings.time_interval.value);
    }
}

SimpleControllerPlugin.prototype.name = 'SimpleController';
SimpleControllerPlugin.prototype.description = 'Simple controller for moving '
                                               'objects around';

WebGameMaker.PluginManager.registerPlugin(SimpleControllerPlugin);
