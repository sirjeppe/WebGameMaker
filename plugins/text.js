function Text() {

    this.type = 'object';

    this.settings = {
        'id': {
            'name': 'Object ID',
            'value': 'text1',
            'type': 'text',
        },
        'font': {
            'name': 'Font',
            'value': 'sans-serif',
            'type': 'text',
            'values': [
                'fantasy',
                'sans-serif',
                'serif',
            ]
        },
        'fontSize': {
            'name': 'Font size (px)',
            'value': 30,
            'type': 'number',
        },
        'text': {
            'name': 'Text',
            'value': 'Hello World!',
            'type': 'text',
        },
        'x': {
            'name': 'X',
            'value': 45,
            'type': 'number',
        },
        'y': {
            'name': 'Y',
            'value': 60,
            'type': 'number',
        },
        'fillStyle': {
            'name': 'Color',
            'value': '#456789',
            'type': 'color',
        },
    };

    this.redraw = function(info) {
        info.canvas_context.fillStyle = this.settings.fillStyle.value;
        info.canvas_context.font = this.settings.fontSize.value + 'px ' +
                                   this.settings.font.value;
        info.canvas_context.fillText(this.settings.text.value,
                                     this.settings.x.value,
                                     this.settings.y.value);
    };

}

Text.prototype.name = 'Text';
Text.prototype.description = 'Lets you add text to the game';

WebGameMaker.PluginManager.registerPlugin(Text);