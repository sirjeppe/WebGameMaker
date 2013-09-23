"use strict";

function AudioSynthesizerPlugin() {

    this.type = 'controller';

    this.play = function() {
        var pattern = /(1|2|4|8|16|32|64|128)(-|((c|c#|d|d#|e|f|f#|g|g#|a|a#|b)[0-9]))/g;
        var re = new RegExp(pattern);
        var toneArray = []
        var match;
        while ((match = re.exec(this.settings.melody.value)) !== null) {
            toneArray.push(match[0]);
        }
        var originalMelodyArray = this.settings.melody.value.split(' ');
        if (originalMelodyArray.length != toneArray.length) {
            alert('Please check the spelling of your tones!');
            return false;
        }
        var gainNode = this.audioContext.createGain();
        gainNode.connect(this.audioContext.destination);
        gainNode.gain.value = this.settings.gain.value / 100;
        var oscillators = [];
        var startTime = 0;
        for (var i = 0; i < toneArray.length; i++) {

            re.lastIndex = 0;
            var tone = re.exec(toneArray[i]);
            var length = parseFloat(60 / this.settings.bpm.value / tone[1]) * 4;
            var key = tone[2].match(/[a-g\-]\#?/);
            var octave = tone[2].match(/[0-9]+/);

            var oscillator = this.audioContext.createOscillator();
            oscillator.type = this.settings.wave_form.value;
            oscillator.connect(gainNode);
            if (key == '-') {
                oscillator.frequency.value = 0;
            } else {
                oscillator.frequency.value = this.frequencyBase[key] * Math.pow(2, octave - 1);
            }
            oscillator.startTime = startTime;
            oscillator.stopTime = startTime + length;
            oscillators.push(oscillator);

            startTime = startTime + length;

        }
        for (var i = 0; i < oscillators.length; i++) {
            oscillators[i].start(this.audioContext.currentTime + oscillators[i].startTime);
            oscillators[i].stop(this.audioContext.currentTime + oscillators[i].stopTime);
        }
    }

    this.settings = {
        'id': {
            'name': 'ID',
            'value': 'synthesizer1',
            'type': 'text',
        },
        'object_id': {
            'name': 'Object ID',
            'value': '',
            'type': 'text'
        },
        'wave_form': {
            'name': 'Wave form',
            'value': 'square',
            'type': 'enum',
            'values': [
                'sine',
                'square',
                'sawtooth',
                'triangle',
            ]
        },
        'bpm': {
            'name': 'BPM',
            'value': 120,
            'type': 'number'
        },
        'gain': {
            'name': 'Gain',
            'value': 10,
            'type': 'range',
            'extraAttributes': {
                'min': 0,
                'max': 100
            }
        },
        'melody': {
            'name': 'Melody',
            'value': '16c4 16e4 16g4 16c5 16- 16g4 4c5',
            'type': 'text'
        },
        'play': {
            'name': 'Play',
            'value': 'Play/Stop',
            'type': 'button',
            'onclick': bind(this, this.play)
        }
    }

    this.frequencyBase = {
        'b': 61.7354, 'a#': 58.2705, 'a': 55.0000, 'g#': 51.9131,
        'g': 48.9994, 'f#': 46.2493, 'f': 43.6535, 'e': 41.2034,
        'd#': 38.8909, 'd': 36.7081, 'c#': 34.6478, 'c': 32.7032
    };

    this.renderedMelody = [];

}

try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    AudioSynthesizerPlugin.prototype.name = 'AudioSynthesizer';
    AudioSynthesizerPlugin.prototype.description = 'A simple synthesizer using the Web Audio API';
    AudioSynthesizerPlugin.prototype.audioContext = new AudioContext();
    WebGameMaker.PluginManager.registerPlugin(AudioSynthesizerPlugin);
} catch (e) {
    console.log('No web audio oscillator support in this browser: ' + e);
}
