function UI() {

    this.showSettingsBox = function(pluginInstance, updateDelegate,
            submitDelegate) {
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
        var submitButton = document.createElement('input');
        submitButton.type = 'button';
        submitButton.value = "Add to game";
        submitButton.onclick = submitDelegate;
        settingsBox.appendChild(submitButton);
    }

    this.clearSettingsBox = function() {
        var settingsBox = document.querySelector('#plugin_properties');
        settingsBox.innerHTML = "";
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

    this.clearActivePlugins = function() {
        var activePluginsList = document.querySelector('#active_plugins');
        activePluginsList.innerHTML = '';
    }

    this.addActivePlugin = function(id, callback) {
        var activePluginsList = document.querySelector('#active_plugins');
        var listElem = document.createElement('li');
        listElem.innerHTML = id;
        listElem.id = id;
        listElem.onclick = callback;
        activePluginsList.appendChild(listElem);
    }
}

WebGameMaker.UI = new UI;
