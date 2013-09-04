var WebGameMaker = {};

WebGameMaker.init = function() {

    var plugins = WebGameMaker.PluginManager.getPlugins();
    for (p in plugins) {
        WebGameMaker.UI.addPluginButton(plugins[p]);
    }

}

window.addEventListener('load', function() {
    WebGameMaker.init();
}, false);