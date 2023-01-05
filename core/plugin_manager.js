'use strict';

/**
 * PluginManager's purpose is to keep track of all the available plugins and
 * should offer a suitable interface for querying for plugins, such as searching
 * by name or other properties.
 */
class PluginManager {

    /**
     * List of all the plugins that is available. The objects in this list are
     * used for creating new plugin instances (they are not instances
     * themselves).
     */
    installedPlugins = [];

    registerPlugin(plugin) {
        this.installedPlugins.push(plugin);
    }

    getPlugins() {
        return this.installedPlugins;
    }

    getPluginByName(name) {
        for (var p in this.installedPlugins) {
            if (this.installedPlugins[p].prototype.name == name) {
                return this.installedPlugins[p];
            }
        }
        return undefined;
    }

    addPluginsFolderPath(pluginsFolder, fileList) {
        // Make sure folder name is present
        var fixedFileList = (typeof fileList != 'object') ? JSON.parse(fileList) : fileList;
        for (var i in fixedFileList) {
            fixedFileList[i] = pluginsFolder + '/' + fixedFileList[i];
        }
        return fixedFileList;
    }

    findAndInjectPlugins(pluginsFolder, callback) {
        if (document.location.protocol == 'http:' || document.location.protocol == 'https:') {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = bind(this, function() {
                if (xhr.status == 200 && xhr.readyState == 4) {
                    var fileList = this.addPluginsFolderPath(pluginsFolder, xhr.responseText);
                    WebGameMaker.injectScripts(fileList, callback);
                }
            });
            xhr.open('GET', pluginsFolder + '/plugins.php?cmd=list', true);
            xhr.send();
        } else {
            // We're offline - use offline list instead
            var s = document.createElement('script');
            s.src = pluginsFolder + '/installed_plugins.js';
            s.onload = bind(this, function() {
                var fileList = this.addPluginsFolderPath(pluginsFolder, WebGameMaker.setup.installedPlugins);
                WebGameMaker.injectScripts(fileList, callback);
            });
            document.querySelector('head').appendChild(s);
        }
    }

}

WebGameMaker.PluginManager = new PluginManager();
