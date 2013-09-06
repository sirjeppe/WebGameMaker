/**
 * PluginManager's purpose is to keep track of all the available plugins and
 * should offer a suitable interface for querying for plugins, such as searching
 * by name or other properties.
 */
function PluginManager() {

    /**
     * List of all the plugins that is available. The objects in this list are
     * used for creating new plugin instances (they are not instances
     * themselves).
     */
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
