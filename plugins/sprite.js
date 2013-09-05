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

}

SpritePlugin.prototype.name = 'Sprite';
SpritePlugin.prototype.description = 'Adds a sprite to the game';

WebGameMaker.PluginManager.registerPlugin(SpritePlugin);