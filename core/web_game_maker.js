'use strict';

var WebGameMaker = {};

// Global settings (setup)
WebGameMaker.setup = {
    'coreFolder': 'core',
    'pluginsFolder': 'plugins',
    'gamesFolder': 'games',
    'defaultPlugins': [],
}

// List of required resources that needs to get inserted into the document for
// WebGameMaker to work.
WebGameMaker.requiredResources = [
    WebGameMaker.setup.coreFolder + '/utils.js',
    WebGameMaker.setup.coreFolder + '/game.js',
    WebGameMaker.setup.coreFolder + '/games.js',
    WebGameMaker.setup.coreFolder + '/plugin_manager.js',
    WebGameMaker.setup.coreFolder + '/ui.js',
    WebGameMaker.setup.coreFolder + '/collision_detector.js',
];

WebGameMaker.setup.defaultPlugins.push(WebGameMaker.setup.gamesFolder + '/single_sprite.js');

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

    var initPluginsCallback = function() {
        WebGameMaker.initPlugins();
        WebGameMaker.Game = new Game();
        WebGameMaker.update();

        WebGameMaker.initGames();
    }

    WebGameMaker.PluginManager.findAndInjectPlugins(WebGameMaker.setup.pluginsFolder, initPluginsCallback);
    WebGameMaker.injectScripts(WebGameMaker.setup.defaultPlugins, initPluginsCallback);
}

/**
 * The initPlugins method is responsible for retrieving information about the
 * currently installed plugins and letting the UI know about them.
 */
WebGameMaker.initPlugins = function() {
    var plugins = WebGameMaker.PluginManager.getPlugins();
    var pluginButtonClicked = function(evt) {
        var plugin = WebGameMaker.PluginManager.getPluginByName(
            evt.srcElement.name
        );
        var instance = new plugin();
        WebGameMaker.setActivePluginInstance(instance);
    }
    for (var p in plugins) {
        WebGameMaker.UI.addPluginButton(plugins[p], pluginButtonClicked);
    }
}

WebGameMaker.initGames = function() {
    var storedGames = WebGameMaker.Games.getGames();
    for (var g in storedGames) {
        WebGameMaker.UI.addStoredGame(storedGames[g].prototype.name);
    }
}

WebGameMaker.loadGame = function(game) {
    console.log('Loading game: ' + game.prototype.name);
    WebGameMaker.Game = game();
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
        /**
         * Special case for checkboxes needed
         */
        if (evt.srcElement.type == 'checkbox') {
            WebGameMaker.updateActivePluginInstanceProperty(
                instance,
                evt.srcElement.id,
                evt.srcElement.type,
                evt.srcElement.checked
            );
        } else {
            WebGameMaker.updateActivePluginInstanceProperty(
                instance,
                evt.srcElement.id,
                evt.srcElement.type,
                evt.srcElement.value
            );
        }
    });

    var submitSettings = bind(this, function() {
        if (WebGameMaker.Game.getPluginById(instance.settings.id.value)) {
            alert('Object with that id already exists');
            return false;
        }

        WebGameMaker.Game.addPluginInstance(instance);
        WebGameMaker.UI.reloadActivePluginsList();
        WebGameMaker.setActivePluginInstance(
            WebGameMaker.Game.getPluginById(instance.settings.id.value)
        );
    });

    var removePlugin = bind(this, function() {
        WebGameMaker.Game.removePluginInstance(instance.settings.id.value);
        WebGameMaker.UI.reloadActivePluginsList();
        WebGameMaker.UI.clearSettingsBox();
    });

    WebGameMaker.UI.showSettingsBox(
        instance,
        propertyUpdated,
        submitSettings,
        removePlugin
    );
}

WebGameMaker.updateActivePluginInstanceProperty = function(instance, property, type, value) {
    // In case the property that is being changed is the id, we first need
    // to verify that there isn't already an object with the new id.
    if (property == 'id') {
        var existingInstance = WebGameMaker.Game.getPluginById(value);
        if (existingInstance) {
            alert('Object with that id already exists');
            return false;
        }
    }

    // Store the new property in the object.
    if (type == 'number') {
        instance.settings[property].value = Number(value);
        instance.settings[property].initialValue = Number(value);
    } else {
        instance.settings[property].value = value;
        instance.settings[property].initialValue = value;
    }

    // If the ID was updated - we need to reload the list and load the settings
    // again, but with the new ID as reference.
    if (property == 'id') {
        WebGameMaker.UI.reloadActivePluginsList();
        WebGameMaker.setActivePluginInstance(instance);
    }

    return true;
}

WebGameMaker.update = function() {
    var drawInfo = {
        'canvasContext': WebGameMaker.Settings.canvas.context,
    }

    drawInfo['canvasContext'].clearRect(
        0,
        0,
        WebGameMaker.Settings.canvas.width,
        WebGameMaker.Settings.canvas.height
    );

    WebGameMaker.Game.draw(drawInfo);
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
                // We need to exit the current script block for the last loaded
                // script to be executed, and we do this with a simple setTimeout()
                setTimeout(progress.callback, 1);
            }
        }
        document.querySelector('head').appendChild(s);
    }
}

window.addEventListener('load', function() {
    WebGameMaker.injectScripts(WebGameMaker.requiredResources, WebGameMaker.init);
}, false);
