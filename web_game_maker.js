var WebGameMaker = {};

WebGameMaker.init = function() {

    var plugins = WebGameMaker.PluginManager.getPlugins();
    for (p in plugins) {
        WebGameMaker.UI.addPluginButton(plugins[p]);
    }

    WebGameMaker.Game = new Game();
    WebGameMaker.update();
}

WebGameMaker.update = function() {
    draw_info = {
        'canvas_context': document.getElementById('canvas').getContext('2d'),
    }

    WebGameMaker.Game.redraw(draw_info);
    window.requestAnimationFrame(WebGameMaker.update);
}

window.addEventListener('load', function() {
    WebGameMaker.init();
}, false);
