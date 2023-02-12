'use strict';

import { Controller } from "../core/controller.js";

export class MouseController extends Controller {

    state = 'paused';
    listenersAdded = false;

    settings = {
        'id': {
            'name': 'ID',
            'initialValue': 'mouseController',
            'value': 'mouseController',
            'type': 'text',
        },
        'onmousedown': {
            'name': 'onmousedown',
            'initialValue': '',
            'value': '',
            'type': 'actionList',
        },
        'onmousemove': {
            'name': 'onmousemove',
            'initialValue': '',
            'value': '',
            'type': 'actionList',
        },
        'onmouseup': {
            'name': 'onmouseup',
            'initialValue': '',
            'value': '',
            'type': 'actionList',
        },
    };

    static getDescription() {
        return 'Controller that uses mouse to interact with objects.';
    }

    initialize() {}

    play() {
        this.state = 'playing';
        if (!this.listenersAdded) {
            this.setEventListeners();
        }
    }

    pause() {
        this.state = 'paused';
    }

    reset() {
        this.pause();
    }

    setEventListeners() {
        WebGameMaker.Settings.canvas.element.addEventListener(
            'mousedown',
            bind(this, function(ev) {

                if (this.state != 'playing') return;

                var object = WebGameMaker.Game.getPluginByPosition(
                    ev.offsetX,
                    ev.offsetY
                );

                if (!object) return;

                WebGameMaker.Game.bringToFront(object);
            })
        );
    }
}
