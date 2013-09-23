"use strict";

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
    WebGameMaker.setup.coreFolder + '/plugin_manager.js',
    WebGameMaker.setup.coreFolder + '/ui.js',
    WebGameMaker.setup.coreFolder + '/collision_manager.js',
];

WebGameMaker.init = function() {
    WebGameMaker.Settings = {}
    try {
        var canvas = document.getElementById('canvas');
    } catch (err) {
        alert(err);
        return false;
    }
    WebGameMaker.Settings.canvas = {
        'element': canvas,
        'context': canvas.getContext('2d'),
        'width': canvas.width,
        'height': canvas.height,
        'top': 0,
        'left': 0,
    };
    WebGameMaker.UI.positionCanvas();
    WebGameMaker.PluginManager.findAndInjectPlugins(
        WebGameMaker.setup.pluginsFolder,
        function() {
            WebGameMaker.initPlugins();

            WebGameMaker.Game = new Game();
            WebGameMaker.update();
        }
    );
}

/**
 * The initPlugins method is responsible for retrieving information about the
 * currently installed plugins and letting the UI know about them.
 */
WebGameMaker.initPlugins = function() {
    var plugins = WebGameMaker.PluginManager.getPlugins();
    var pluginButtonClicked = function(evt) {
        var plugin = WebGameMaker.PluginManager.getPluginByName(
                evt.srcElement.name);
        var instance = new plugin();
        WebGameMaker.setActivePluginInstance(instance);
    }
    for (var p in plugins) {
        WebGameMaker.UI.addPluginButton(plugins[p], pluginButtonClicked);
    }
}

/**
 * The setActivePluginInstance method sets the given instance as the currently
 * active object, which means that it will be possible to edit this instance
 * in the settings box. It's also responsible for registering callbacks for
 * storing the active instance in the game and updating properties after the
 * object has already been added.
 *
 * @param instance Plugin instance that should be edited.
 */
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

        WebGameMaker.UI.clearActivePlugins();
        for (var p in activePlugins) {
            WebGameMaker.UI.addActivePlugin(activePlugins[p].settings.id.value);
        }
    });

    WebGameMaker.UI.showSettingsBox(instance, propertyUpdated,
            submitSettings);
}



WebGameMaker.updateActivePluginInstanceProperty = function(instance, property, type,
        value) {
    // In case the property that is being changed is the id, we first need
    // to verify that there isn't already an object with the new id.
    if (property == 'id') {
        var existingInstance = WebGameMaker.Game.getPluginById(value);
        if (existingInstance) {
            alert("Object with that id already exists");
            return false;
        }

        // TODO(robert): Is this really needed? I don't see the point of it
        // anymore...
        var activePlugins = WebGameMaker.Game.getPluginInstances();
        WebGameMaker.UI.clearActivePlugins();
        for (var p in activePlugins) {
            WebGameMaker.UI.addActivePlugin(
                    activePlugins[p].settings.id.value, function(evt) {
                        WebGameMaker.setActivePluginInstance(
                            WebGameMaker.Game.getPluginById(evt.srcElement.id));
                    }
            );
        }
    }

    // Store the new property in the object.
    if (type == 'number') {
        instance.settings[property].value = Number(value);
        instance.settings[property].initial_value = Number(value);
    } else {
        instance.settings[property].value = value;
        instance.settings[property].initial_value = value;
    }

    return true;
}

WebGameMaker.update = function() {
    var draw_info = {
        'canvas_context': WebGameMaker.Settings.canvas.context,
    }

    draw_info['canvas_context'].clearRect(0, 0, WebGameMaker.Settings.canvas.width,
            WebGameMaker.Settings.canvas.height);

    WebGameMaker.Game.draw(draw_info);
    window.requestAnimationFrame(WebGameMaker.update);
}

WebGameMaker.injectScripts = function(fileList, callback) {
    WebGameMaker.injectScriptsProgress = {
        'injected': 0,
        'target': fileList.length,
        'callback': callback,
    };
    for (var i in fileList) {
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
