function SimpleControllerPlugin () {

    this.type = 'controller';
    this.state = 'paused';

    this.settings = {
        'id': {
            'value': 'simple_controller',
            'type': 'text',
        },
        'object_id': {
            'value': '',
            'type': 'text'
        },
        'speed_x': {
            'value': 1,
            'type': 'number',
        },
        'speed_y': {
            'value': 1,
            'type': 'number',
        },
        'time_interval': {
            'value': 1000,
            'type': 'number',
        }
    };

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
        if (object) {
            object.move(this.settings.speed_x.value, this.settings.speed_y.value);
        }
        setTimeout(bind(this, this.update), this.settings.time_interval.value);
    }
}

SimpleControllerPlugin.prototype.name = 'SimpleController';
SimpleControllerPlugin.prototype.description = 'Simple controller for moving '
                                               'objects around';

WebGameMaker.PluginManager.registerPlugin(SimpleControllerPlugin);
