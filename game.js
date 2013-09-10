function Game() {

    var plugins = [];

    this.play = function() {
        for (p in plugins) {
            plugins[p].play();
        }
    }

    this.pause = function() {
        for (p in plugins) {
            plugins[p].pause();
        }
    }

    this.reset = function() {
        for (p in plugins) {
            plugins[p].reset();
        }
    }

    this.getPluginInstances = function() {
        return plugins;
    }

    this.addPluginInstance = function(instance) {
        plugins.push(instance);
    }

    this.redraw = function(draw_info) {
        for (p in plugins) {
            if (plugins[p].type == 'object')
                plugins[p].redraw(draw_info);
        }
    }

    this.getPluginById = function(id) {
        for (p in plugins) {
            if (plugins[p].settings.id.value == id) {
                return plugins[p];
            }
        }
    }
}
