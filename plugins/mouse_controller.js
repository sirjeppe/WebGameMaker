'use strict';

class MouseControllerPlugin {

    type = 'controller';
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

MouseControllerPlugin.prototype.name = 'MouseController';
MouseControllerPlugin.prototype.description = 'Controller that uses mouse ' +
    'to interact with objects.';

WebGameMaker.PluginManager.registerPlugin(MouseControllerPlugin);
