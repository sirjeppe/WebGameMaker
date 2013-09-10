function KeyboardControllerPlugin () {

    this.type = 'controller';
    this.state = 'paused';

    this.settings = {
        'id': {
            'value': 'keyboard_controller',
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
    };

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
        document.addEventListener("keydown", bind(this, function(ev) {
            if (this.state != 'playing')
                return;

            var object = WebGameMaker.Game.getPluginById(
                this.settings.object_id.value);
            if (!object) {
                return;
            }

            if (ev.which == 38) {
                object.move(0, -this.settings.speed_y.value);
            } else if (ev.which == 40) {
                object.move(0, this.settings.speed_y.value);    
            } else if (ev.which == 37) {
                object.move(-this.settings.speed_x.value, 0);
            } else if (ev.which == 39) {
                object.move(this.settings.speed_x.value, 0);
            }
        }));
    }
}

KeyboardControllerPlugin.prototype.name = 'KeyboardController';
KeyboardControllerPlugin.prototype.description = 'Controller that uses keyboard '
                                               'input for moving objects.';

WebGameMaker.PluginManager.registerPlugin(KeyboardControllerPlugin);
