'use strict';

function KeyboardControllerPlugin() {

    this.type = 'controller';
    this.state = 'paused';

    this.settings = {
        'id': {
            'name': 'ID',
            'initialValue': 'keyboardController',
            'value': 'keyboardController',
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
    };

    this.initialize = function() {}

    this.play = function() {
        this.state = 'playing';
        this.setEventListeners();
    }

    this.pause = function() {
        this.state = 'paused';
    }

    this.reset = function() {
        this.pause();
    }

    this.setEventListeners = function() {
        document.addEventListener('keydown', bind(this, function(ev) {
            if (this.state != 'playing')
                return;

            var object = WebGameMaker.Game.getPluginById(
                this.settings.objectID.value);
            if (!object) {
                return;
            }

            if (ev.which == 38) {
                object.move(0, -this.settings.speedY.value);
            } else if (ev.which == 40) {
                object.move(0, this.settings.speedY.value);
            } else if (ev.which == 37) {
                object.move(-this.settings.speedX.value, 0);
            } else if (ev.which == 39) {
                object.move(this.settings.speedX.value, 0);
            }
        }));
    }
}

KeyboardControllerPlugin.prototype.name = 'KeyboardController';
KeyboardControllerPlugin.prototype.description = 'Controller that uses keyboard ' +
    'input for moving objects.';

WebGameMaker.PluginManager.registerPlugin(KeyboardControllerPlugin);
