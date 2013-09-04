function SpritePlugin() {

    this.settings = {
        'x': {
            'value': 0,
            'type': 'number',
        },
        'y': {
            'value': 25,
            'type': 'number',
        }
    };

}

SpritePlugin.prototype.name = 'Sprite';
SpritePlugin.prototype.description = 'Adds a sprite to the game';

WebGameMaker.PluginManager.registerPlugin(SpritePlugin);