function SpritePlugin() {

    this.type = 'object';

    this.settings = {
        'id': {
            'value': 'sprite',
            'type': 'text',
        },
        'x': {
            'value': 0,
            'type': 'number',
        },
        'y': {
            'value': 0,
            'type': 'number',
        },
        'width': {
            'value': 100,
            'type': 'number',
        },
        'height': {
            'value': 100,
            'type': 'number',
        },
        'fill_style': {
            'value': 'blue',
            'type': 'color',
        },
    };

    var positionDiff = {
        'x': 0,
        'y': 0,
    }

    this.play = function() {
    }

    this.pause = function() {
    }

    this.reset = function() {
        positionDiff.x = 0;
        positionDiff.y = 0;
    }

    this.move = function(x, y) {
        positionDiff.x += x;
        positionDiff.y += y;
    }

    this.redraw = function(info) {
        info.canvas_context.fillStyle = this.settings.fill_style.value;
        info.canvas_context.fillRect(
                this.settings.x.value + positionDiff.x,
                this.settings.y.value + positionDiff.y,
                this.settings.width.value,
                this.settings.height.value);
    }
}

SpritePlugin.prototype.name = 'Sprite';
SpritePlugin.prototype.description = 'Adds a sprite to the game';

WebGameMaker.PluginManager.registerPlugin(SpritePlugin);
