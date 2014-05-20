'use strict';

function Text() {

    this.type = 'object';

    this.settings = {
        'id': {
            'name': 'ID',
            'initialValue': 'text1',
            'value': 'text1',
            'type': 'text',
        },
        'font': {
            'name': 'Font',
            'initialValue': 'sans-serif',
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
            'initialValue': 30,
            'value': 30,
            'type': 'number',
        },
        'text': {
            'name': 'Text',
            'initialValue': 'Hello World!',
            'value': 'Hello World!',
            'type': 'text',
        },
        'x': {
            'name': 'X',
            'initialValue': 45,
            'value': 45,
            'type': 'number',
        },
        'y': {
            'name': 'Y',
            'initialValue': 60,
            'value': 60,
            'type': 'number',
        },
        'zIndex': {
            'name': 'Z index',
            'initialValue': 1,
            'value': 1,
            'type': 'number',
        },
        'collides': {
            'name': 'Collides',
            'initialValue': false,
            'value': false,
            'type': 'checkbox',
        },
        'fillStyle': {
            'name': 'Color',
            'initialValue': '#456789',
            'value': '#456789',
            'type': 'color',
        },
    };

    this.draw = function(info) {
        info.canvasContext.fillStyle = this.settings.fillStyle.value;
        info.canvasContext.font = this.settings.fontSize.value + 'px ' +
            this.settings.font.value;
        info.canvasContext.fillText(
            this.settings.text.value,
            this.settings.x.value,
            this.settings.y.value
        );
    };

}

Text.prototype.name = 'Text';
Text.prototype.description = 'Lets you add text to the game';

WebGameMaker.PluginManager.registerPlugin(Text);
