function Game() {

    var plugins = [];
    var active_instance = undefined;

    this.addPluginInstance = function(instance) {
        plugins.push(instance);
    }

    this.redraw = function(draw_info) {
        for (p in plugins) {
            plugins[p].redraw(draw_info);
        }

        if (active_instance)
            active_instance.redraw(draw_info);
    }

    this.setActivePluginInstance = function(instance) {
        active_instance = instance;
    }

    this.getActivePluginInstance = function() {
        return active_instance;
    }

    this.storeActivePluginInstance = function() {
        if (active_instance)
            this.addPluginInstance(active_instance);
    }

}
