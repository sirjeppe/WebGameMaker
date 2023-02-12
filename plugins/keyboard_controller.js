'use strict';

import { Controller } from "../core/controller.js";

export class KeyboardController extends Controller {

    static getDescription() {
        return 'Controller that uses keyboard input for moving objects.';
    }

    state = 'paused';
    listenersAdded = false;

    settings = {
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

    initialize() {}

    play() {
        this.state = 'playing';
        if (!this.listenersAdded) {
            this.setEventListeners();
            this.listenersAdded = true;
        }
    }

    pause() {
        this.state = 'paused';
    }

    reset() {
        this.pause();
    }

    setEventListeners() {
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

            ev.default = true;
        }));
    }
}
