function AudioSynthesizerPlugin() {

    this.type = 'controller';

    this.play = function() {
        var pattern = /(1|2|4|8|16|32|64|128)((-)|([a-g]#?[0-8]))/g;
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
        var oscillators = [];
        var startTime = 0;
        for (var i = 0; i < toneArray.length; i++) {

            re.lastIndex = 0;
            var tone = re.exec(toneArray[i]);
            var length = parseFloat(60 / this.settings.bpm.value / tone[1]) * 4;
            var key = tone[2];

            var oscillator = this.audioContext.createOscillator();
            oscillator.type = this.settings.wave_form.value;
            oscillator.connect(this.audioContext.destination);
            if (key == '-') {
                oscillator.frequency.value = 0;
            } else {
                oscillator.frequency.value = this.frequencyTable[key];
            }
            oscillator.startTime = startTime;
            oscillator.stopTime = startTime + length;
            oscillators.push(oscillator);

            startTime = startTime + length;

        }
        for (var i = 0; i < oscillators.length; i++) {
            oscillators[i].noteOn(this.audioContext.currentTime + oscillators[i].startTime);
            oscillators[i].noteOff(this.audioContext.currentTime + oscillators[i].stopTime);
        }
    }

    this.settings = {
        'id': {
            'value': 'synthesizer1',
            'type': 'text',
        },
        'object_id': {
            'value': '',
            'type': 'text'
        },
        'wave_form': {
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
            'value': 120,
            'type': 'number'
        },
        'melody': {
            'value': '16c4 16e4 16g4 16c5 16- 16g4 4c5',
            'type': 'text'
        },
        'play': {
            'value': 'Play/Stop',
            'type': 'button',
            'onclick': bind(this, this.play)
        }
    }

    this.frequencyTable = {
        'c8': 4186.01, 'b7': 3951.07, 'a#7': 3729.31, 'a7': 3520.00,
        'g#7': 3322.44, 'g7': 3135.96, 'f#7': 2959.96, 'f7': 2793.83,
        'e7': 2637.02, 'd#7': 2489.02, 'd7': 2349.32, 'c#7': 2217.46,
        'c7': 2093.00, 'b6': 1975.53, 'a#6': 1864.66, 'a6': 1760.00,
        'g#6': 1661.22, 'g6': 1567.98, 'f#6': 1479.98, 'f6': 1396.91,
        'e6': 1318.51, 'd#6': 1244.51, 'd6': 1174.66, 'c#6': 1108.73,
        'c6': 1046.50, 'b5': 987.767, 'a#5': 932.328, 'a5': 880.000,
        'g#5': 830.609, 'g5': 783.991, 'f#5': 739.989, 'f5': 698.456,
        'e5': 659.255, 'd#5': 622.254, 'd5': 587.330, 'c#5': 554.365,
        'c5': 523.251, 'b4': 493.883, 'a#4': 466.164, 'a4': 440.000,
        'g#4': 415.305, 'g4': 391.995, 'f#4': 369.994, 'f4': 349.228,
        'e4': 329.628, 'd#4': 311.127, 'd4': 293.665, 'c#4': 277.183,
        'c4': 261.626, 'b3': 246.942, 'a#3': 233.082, 'a3': 220.000,
        'g#3': 207.652, 'g3': 195.998, 'f#3': 184.997, 'f3': 174.614,
        'e3': 164.814, 'd#3': 155.563, 'd3': 146.832, 'c#3': 138.591,
        'c3': 130.813, 'b2': 123.471, 'a#2': 116.541, 'a2': 110.000,
        'g#2': 103.826, 'g2': 97.9989, 'f#2': 92.4986, 'f2': 87.3071,
        'e2': 82.4069, 'd#2': 77.7817, 'd2': 73.4162, 'c#2': 69.2957,
        'c2': 65.4064, 'b1': 61.7354, 'a#1': 58.2705, 'a1': 55.0000,
        'g#1': 51.9131, 'g1': 48.9994, 'f#1': 46.2493, 'f1': 43.6535,
        'e1': 41.2034, 'd#1': 38.8909, 'd1': 36.7081, 'c#1': 34.6478,
        'c1': 32.7032, 'b0': 30.8677, 'a#0': 29.1352, 'a0': 27.5000
    };

}

try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    AudioSynthesizerPlugin.prototype.name = 'AudioSynthesizer';
    AudioSynthesizerPlugin.prototype.description = 'A simple synthesizer using the Web Audio API';
    AudioSynthesizerPlugin.prototype.audioContext = new AudioContext();
    WebGameMaker.PluginManager.registerPlugin(AudioSynthesizerPlugin);
} catch (e) {
    alert('No web audio oscillator support in this browser: ' + e);
}
