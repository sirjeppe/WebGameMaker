function SpritePlugin() {

    this.settings = {
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
            'type': 'text',
        },
    };

    this.redraw = function(info) {
        info.canvas_context.fillStyle = this.settings.fill_style.value;
        info.canvas_context.fillRect(
                this.settings.x.value,
                this.settings.y.value,
                this.settings.width.value,
                this.settings.height.value);
    }
}

SpritePlugin.prototype.name = 'Sprite';
SpritePlugin.prototype.description = 'Adds a sprite to the game';

WebGameMaker.PluginManager.registerPlugin(SpritePlugin);
