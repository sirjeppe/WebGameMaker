'use strict';

function MouseControllerPlugin() {

    this.type = 'controller';
    this.state = 'paused';
    this.listenersAdded = false;

    this.settings = {
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

    this.initialize = function() {}

    this.play = function() {
        this.state = 'playing';
        if (!this.listenersAdded) {
            this.setEventListeners();
        }
    }

    this.pause = function() {
        this.state = 'paused';
    }

    this.reset = function() {
        this.pause();
    }

    this.setEventListeners = function() {
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
