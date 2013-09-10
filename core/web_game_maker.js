var WebGameMaker = {};

// Global settings (setup)
WebGameMaker.setup = {
    'coreFolder': 'core',
    'pluginsFolder': 'plugins',
}

// List of required resources that needs to get inserted into the document for
// WebGameMaker to work.
WebGameMaker.requiredResources = [
    WebGameMaker.setup.coreFolder + '/utils.js',
    WebGameMaker.setup.coreFolder + '/game.js',
    WebGameMaker.setup.coreFolder + '/plugins_import.js',
    WebGameMaker.setup.coreFolder + '/ui.js',
];

WebGameMaker.init = function() {
    WebGameMaker.Settings = {}
    WebGameMaker.Settings.canvas = document.getElementById('canvas');
    WebGameMaker.Settings.context = WebGameMaker.Settings.canvas.getContext('2d');
    WebGameMaker.Settings.width = WebGameMaker.Settings.canvas.width;
    WebGameMaker.Settings.height = WebGameMaker.Settings.canvas.height;

    WebGameMaker.PluginManager.findAndInjectPlugins(
        WebGameMaker.setup.pluginsFolder,
        function() {
            WebGameMaker.initPlugins();

            WebGameMaker.Game = new Game();
            WebGameMaker.update();
        }
    );
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

    var submitSettings = bind(this, function() {
        if (WebGameMaker.Game.getPluginById(instance.settings.id.value)) {
            alert("Object with that id already exists");
            return false;
        }

        WebGameMaker.UI.clearSettingsBox();

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
            submitSettings);
}

WebGameMaker.updateActivePluginInstanceProperty = function(instance, property, type,
        value) {
    if (property == 'id') {
        var existingInstance = WebGameMaker.Game.getPluginById(value);
        if (existingInstance) {
            alert("Object with that id already exists");
            return false;
        }
    }

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

    return true;
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

WebGameMaker.injectScripts = function(fileList, callback) {
    // Insert all items in WebGameMaker.requiredResources into the documents.
    // When all resources are loaded - call the callback function if given
    WebGameMaker.injectScriptsProgress = {
        'injected': 0,
        'target': fileList.length,
        'callback': callback,
    };
    for (i in fileList) {
        var s = document.createElement('script');
        s.src = fileList[i];
        s.onload = function() {
            var progress = WebGameMaker.injectScriptsProgress;
            progress.injected++;
            if (progress.injected == progress.target && progress.callback) {
                WebGameMaker.injectScriptsProgress = {};
                setTimeout(progress.callback, 1);
            }
        }
        document.querySelector('head').appendChild(s);
    }
}

window.addEventListener('load', function() {
    WebGameMaker.injectScripts(WebGameMaker.requiredResources, WebGameMaker.init);
}, false);
