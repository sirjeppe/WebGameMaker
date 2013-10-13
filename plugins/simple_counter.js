"use strict";

function SimpleCounter() {

    this.type = 'controller';
    this.state = 'paused';

    this.settings = {
        'id': {
            'name': 'ID',
            'type': 'text',
            'initialValue': 'simple_counter_1',
            'value': 'simple_counter_1',
        },
        'objectID': {
            'name': 'Object ID',
            'type': 'objectList',
            'initialValue': '',
            'value': '',
        },
        'value': {
            'name': 'Value',
            'type': 'number',
            'initialValue': 0,
            'value': 0,
        },
        'step': {
            'name': 'Step size',
            'type': 'number',
            'initialValue': 0,
            'value': 0,
        },
    };

    this.initialize = function() {
        var object = WebGameMaker.Game.getPluginById(
                this.settings.objectID.value);
        object.addCollisionHandler(bind(this, function(obj, info) {
            if (this.state != 'playing') {
                return;
            }
            this.settings.value.value += this.settings.step.value;
        }));
    };

    this.play = function() {
        this.state = 'playing';
    };

    this.pause = function() {
        this.state = 'paused';
        this.value.value = this.value.initialValue;
        this.step.value = this.step.initialValue;
    };

    this.reset = function() {
        this.pause();
    };

}

SimpleCounter.prototype.name = 'Simple counter';
SimpleCounter.prototype.description = 'A very simple plugin that lets you increment ' +
                                      'or decrement an integer with a fixed value.';

WebGameMaker.PluginManager.registerPlugin(SimpleCounter);