"use strict";

function Text() {

    this.type = 'object';

    this.settings = {
        'id': {
            'name': 'Object ID',
            'initial_value': 'text1',
            'value': 'text1',
            'type': 'text',
        },
        'font': {
            'name': 'Font',
            'initial_value': 'sans-serif',
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
            'initial_value': 30,
            'value': 30,
            'type': 'number',
        },
        'text': {
            'name': 'Text',
            'initial_value': 'Hello World!',
            'value': 'Hello World!',
            'type': 'text',
        },
        'x': {
            'name': 'X',
            'initial_value': 45,
            'value': 45,
            'type': 'number',
        },
        'y': {
            'name': 'Y',
            'initial_value': 60,
            'value': 60,
            'type': 'number',
        },
        'fillStyle': {
            'name': 'Color',
            'initial_value': '#456789',
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
