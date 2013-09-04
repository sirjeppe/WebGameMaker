function UI() {

    this.showSettingsBox = function(name) {
        var plugin = WebGameMaker.PluginManager.getPluginByName(name);
        if (plugin == undefined) {
            return;
        }

        var pluginInstance = new plugin();
        var settings = pluginInstance.settings;
        var settingsBox = document.querySelector('#plugin_properties');
        settingsBox.innerHTML = "";
        for (s in settings) {
            var labelElem = document.createElement('label');
            labelElem.textContent = s + ': ';
            var inputElem = document.createElement('input');
            inputElem.name = s;
            inputElem.type = settings[s].type;
            inputElem.value = settings[s].value;
            settingsBox.appendChild(labelElem);
            settingsBox.appendChild(inputElem);
            settingsBox.appendChild(document.createElement('br'));
        }
    }

    this.addPluginButton = function(plugin) {
        var pluginsList = document.querySelector('#plugin_list');
        var button = document.createElement('input');
        button.type = 'button';
        button.title = plugin.prototype.description;
        button.value = plugin.prototype.name;
        button.name = plugin.prototype.name;
        button.onclick = function(evt) {
            WebGameMaker.UI.showSettingsBox(evt.currentTarget.name);
        }
        pluginsList.appendChild(button);
    }

}

WebGameMaker.UI = new UI;