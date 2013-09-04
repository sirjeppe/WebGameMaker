function PluginManager() {

    var installedPlugins = [];

    this.registerPlugin = function(plugin) {
        installedPlugins.push(plugin);
    }

    this.getPlugins = function() {
        return installedPlugins;
    }

    this.getPluginByName = function(name) {
        for (p in installedPlugins) {
            if (installedPlugins[p].prototype.name == name) {
                return installedPlugins[p];
            }
        }
        return undefined;
    }

}

WebGameMaker.PluginManager = new PluginManager;