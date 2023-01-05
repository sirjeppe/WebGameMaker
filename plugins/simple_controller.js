'use strict';

class SimpleControllerPlugin {

    type = 'controller';
    state = 'paused';

    settings = {
        'id': {
            'name': 'ID',
            'initialValue': 'simpleController',
            'value': 'simpleController',
            'type': 'text',
        },
        'objectID': {
            'name': 'Object ID',
            'initialValue': '',
            'value': '',
            'type': 'objectList'
        },
        'speedX': {
            'name': 'X speed',
            'initialValue': 1,
            'value': 1,
            'type': 'number',
        },
        'speedY': {
            'name': 'Y speed',
            'initialValue': 1,
            'value': 1,
            'type': 'number',
        },
        'timeInterval': {
            'name': 'Time interval',
            'initialValue': 1000,
            'value': 1000,
            'type': 'number',
        }
    };

    initialize() {
        var object = WebGameMaker.Game.getPluginById(this.settings.objectID.value);
        object.addCollisionHandler(bind(this, function(obj, info) {
            var topCollision = info.collidedWith[0].collisionData.topLeftCollision &&
                info.collidedWith[0].collisionData.topRightCollision;
            var rightCollision = info.collidedWith[0].collisionData.topRightCollision &&
                info.collidedWith[0].collisionData.bottomRightCollision;
            var bottomCollision = info.collidedWith[0].collisionData.bottomRightCollision &&
                info.collidedWith[0].collisionData.bottomLeftCollision;
            var leftCollision = info.collidedWith[0].collisionData.bottomLeftCollision &&
                info.collidedWith[0].collisionData.topLeftCollision;
            if (topCollision || bottomCollision) {
                this.settings.speedY.value = -this.settings.speedY.value;
            } else {
                this.settings.speedX.value = -this.settings.speedX.value;
            }

            obj.move(this.settings.speedX.value, this.settings.speedY.value);
        }));
    }

    play() {
        this.state = 'playing';
        bind(this, this.update)();
    }

    pause() {
        this.state = 'paused';
    }

    reset() {
        this.pause();
    }

    update() {
        if (this.state != 'playing')
            return;

        var object = WebGameMaker.Game.getPluginById(this.settings.objectID.value);

        if (object)
            object.move(this.settings.speedX.value, this.settings.speedY.value);
        else
            console.log('Invalid object id given: ' + this.settings.objectID.value);

        setTimeout(bind(this, this.update), this.settings.timeInterval.value);
    }
}

SimpleControllerPlugin.prototype.name = 'SimpleController';
SimpleControllerPlugin.prototype.description = 'Simple controller for moving ' +
    'objects around';

WebGameMaker.PluginManager.registerPlugin(SimpleControllerPlugin);
