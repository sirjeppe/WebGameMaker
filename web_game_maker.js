var WebGameMaker = {};

WebGameMaker.init = function() {
    WebGameMaker.Settings = {}
    WebGameMaker.Settings.canvas = document.getElementById('canvas');
    WebGameMaker.Settings.context = WebGameMaker.Settings.canvas.getContext('2d');
    WebGameMaker.Settings.width = WebGameMaker.Settings.canvas.width;
    WebGameMaker.Settings.height = WebGameMaker.Settings.canvas.height;

    var plugins = WebGameMaker.PluginManager.getPlugins();
    for (p in plugins) {
        WebGameMaker.UI.addPluginButton(plugins[p], function(evt) {
            var instance = new plugins[p]();
            WebGameMaker.UI.showSettingsBox(instance, function(evt) {
                WebGameMaker.updateActivePluginInstanceProperty(
                    evt.srcElement.id,
                    evt.srcElement.value);
            });
            WebGameMaker.setActivePluginInstance(instance);
        });
    }

    WebGameMaker.Game = new Game();
    WebGameMaker.update();
}

WebGameMaker.setActivePluginInstance = function(instance) {
    WebGameMaker.Game.setActivePluginInstance(instance);
}

WebGameMaker.updateActivePluginInstanceProperty = function(property, value) {
    console.log('Updating property: ' + property + ': ' + value);
    var instance = WebGameMaker.Game.getActivePluginInstance();
    instance.settings[property].value = value;
    WebGameMaker.Game.setActivePluginInstance(instance);
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
