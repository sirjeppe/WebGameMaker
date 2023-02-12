'use strict';

/**
 * PluginManager's purpose is to keep track of all the available plugins and
 * should offer a suitable interface for querying for plugins, such as searching
 * by name or other properties.
 */
export class PluginManager {
  wgm;

  /**
   * List of all the plugins that is available. The objects in this list are
   * used for creating new plugin instances (they are not instances
   * themselves).
   */
  #registeredPlugins = [];

  constructor(wgm) {
    this.wgm = wgm;
  }

  #registerPlugin(plugin) {
    this.#registeredPlugins.push(plugin);
  }

  getPlugins() {
    return this.#registeredPlugins;
  }

  getPluginByName(name) {
    for (const plugin of this.#registeredPlugins) {
      if (plugin.name === name) {
        return plugin;
      }
    }
    return undefined;
  }

  #parseHTMLFileList(pluginsFolder, fileListHTML) {
    // Match all href="<something>.js"
    const matches = [...fileListHTML.matchAll(/href=\"([^\"]+\.js)\"/g)];
    const fileList = [];
    for (const match of matches) {
      fileList.push(match[1].split('/').pop());
    }
    // Make sure folder name is present
    for (var i in fileList) {
      fileList[i] = `../${pluginsFolder}/${fileList[i]}`;
    }
    return fileList;
  }

  findAndRegisterPlugins(pluginsFolder, callback) {
    const cls = this;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = async (xhr) => {
      if (xhr.target.status == 200 && xhr.target.readyState == 4) {
        const fileList = this.#parseHTMLFileList(pluginsFolder, xhr.target.responseText);
        for (const pluginFile of fileList) {
          let module = await import(pluginFile);
          cls.#registerPlugin(module[Object.keys(module)[0]]);
        }
        if (callback) {
          callback();
        }
      }
    };
    xhr.open('GET', pluginsFolder, true);
    xhr.send();
  }

}
