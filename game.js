function Game() {

    var plugins = [];
    var temporary_instance = undefined;

    this.addPluginInstance = function(instance) {
        plugins.push(instance);
    }

    this.redraw = function(draw_info) {
        for (p in plugins) {
            plugins[p].redraw(draw_info);
        }

        if (temporary_instance)
            temporary_instance.redraw(draw_info);
    }

    this.setTemporaryPluginInstance = function(instance) {
        temporary_instance = instance;
    }
}
