'use strict';

class SimpleCounter {

    type = 'controller';
    state = 'paused';

    settings = {
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

    initialize() {
        var object = WebGameMaker.Game.getPluginById(this.settings.objectID.value);
        object.addCollisionHandler(bind(this, function(obj, info) {
            if (this.state != 'playing') {
                return;
            }
            this.settings.value.value += this.settings.step.value;
        }));
    };

    play() {
        this.state = 'playing';
    };

    pause() {
        this.state = 'paused';
        this.value.value = this.value.initialValue;
        this.step.value = this.step.initialValue;
    };

    reset() {
        this.pause();
    };

}

SimpleCounter.prototype.name = 'SimpleCounter';
SimpleCounter.prototype.description = 'A very simple plugin that lets you increment ' +
    'or decrement an integer with a fixed value.';

WebGameMaker.PluginManager.registerPlugin(SimpleCounter);
