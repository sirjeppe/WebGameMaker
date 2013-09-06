var WebGameMaker = {};

WebGameMaker.init = function() {
    WebGameMaker.Settings = {}
    WebGameMaker.Settings.canvas = document.getElementById('canvas');
    WebGameMaker.Settings.context = WebGameMaker.Settings.canvas.getContext('2d');
    WebGameMaker.Settings.width = WebGameMaker.Settings.canvas.width;
    WebGameMaker.Settings.height = WebGameMaker.Settings.canvas.height;

    WebGameMaker.initPlugins();

    WebGameMaker.Game = new Game();
    WebGameMaker.update();
}

WebGameMaker.initPlugins = function() {
    var plugins = WebGameMaker.PluginManager.getPlugins();
    var pluginButtonClicked = function(evt) {
        var plugin = WebGameMaker.PluginManager.getPluginByName(
                evt.srcElement.name);
        var instance = new plugin();
        WebGameMaker.setActivePluginInstance(instance);
    }
    for (p in plugins) {
        WebGameMaker.UI.addPluginButton(plugins[p], pluginButtonClicked);
    }
}

WebGameMaker.setActivePluginInstance = function(instance) {
    var propertyUpdated = bind(this, function(evt) {
        WebGameMaker.updateActivePluginInstanceProperty(
                instance,
                evt.srcElement.id,
                evt.srcElement.type,
                evt.srcElement.value);
    });

    var pluginInstanceAdded = bind(this, function() {
        WebGameMaker.Game.addPluginInstance(instance);
        var activePlugins = WebGameMaker.Game.getPluginInstances();

        var pluginClicked = function(evt) {
            WebGameMaker.setActivePluginInstance(
                    WebGameMaker.Game.getPluginById(evt.srcElement.id))
        }

        WebGameMaker.UI.clearActivePlugins();
        for (p in activePlugins) {
            WebGameMaker.UI.addActivePlugin(
                    activePlugins[p].settings.id.value, pluginClicked);
        }
    });

    WebGameMaker.UI.showSettingsBox(instance, propertyUpdated,
            pluginInstanceAdded);
}

WebGameMaker.updateActivePluginInstanceProperty = function(instance, property, type,
        value) {
    // TODO(robertn): If the property that is being changed is the id, we should
    // first check if there are any other instance with the same id.
    if (type == 'number') {
        instance.settings[property].value = Number(value);
    } else {
        instance.settings[property].value = value;
    }

    var activePlugins = WebGameMaker.Game.getPluginInstances();
    WebGameMaker.UI.clearActivePlugins();
    for (p in activePlugins) {
        WebGameMaker.UI.addActivePlugin(
                activePlugins[p].settings.id.value, function(evt) {
                    WebGameMaker.setActivePluginInstance(
                        WebGameMaker.Game.getPluginById(evt.srcElement.id)
                        )
                });
    }
}

WebGameMaker.update = function() {
    draw_info = {
        'canvas_context': WebGameMaker.Settings.context,
    }

    draw_info['canvas_context'].clearRect(0, 0, WebGameMaker.Settings.width,
            WebGameMaker.Settings.height);

    WebGameMaker.Game.redraw(draw_info);
    window.requestAnimationFrame(WebGameMaker.update);
}

window.addEventListener('load', function() {
    WebGameMaker.init();
}, false);
