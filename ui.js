function UI() {

    this.showSettingsBox = function(pluginInstance, updateDelegate) {
        var settings = pluginInstance.settings;
        var settingsBox = document.querySelector('#plugin_properties');
        settingsBox.innerHTML = "";
        // TODO(robert): We should probably create these elements in a table
        // so that they'll be nicely aligned in the UI.
        for (s in settings) {
            var labelElem = document.createElement('label');
            labelElem.textContent = s + ': ';
            var inputElem = document.createElement('input');
            inputElem.name = s;
            inputElem.type = settings[s].type;
            inputElem.value = settings[s].value;
            inputElem.id = s;
            inputElem.onchange = updateDelegate;
            settingsBox.appendChild(labelElem);
            settingsBox.appendChild(inputElem);
            settingsBox.appendChild(document.createElement('br'));
        }
    }

    this.addPluginButton = function(plugin, delegate) {
        var pluginsList = document.querySelector('#plugin_list');
        var button = document.createElement('input');
        button.type = 'button';
        button.title = plugin.prototype.description;
        button.value = plugin.prototype.name;
        button.name = plugin.prototype.name;
        button.onclick = delegate;
        pluginsList.appendChild(button);
    }

}

WebGameMaker.UI = new UI;
