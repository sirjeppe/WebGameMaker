function UI() {

    this.showSettingsBox = function(pluginInstance, updateDelegate,
            submitDelegate) {
        this.clearSettingsBox();
        if (!pluginInstance) {
            return false;
        }
        var settings = pluginInstance.settings;
        var settingsBox = document.querySelector('#plugin_properties');
        var settingsBoxTable = document.createElement('table');
        settingsBoxTable.id = 'plugin_properties_table';
        for (s in settings) {
            var tr = document.createElement('tr');

            var tdProp = document.createElement('td');
            var labelElem = document.createElement('label');
            labelElem.textContent = s + ': ';
            labelElem.for = s;
            tdProp.appendChild(labelElem);

            var tdVal = document.createElement('td');
            var inputElem = document.createElement('input');
            inputElem.name = s;
            inputElem.type = settings[s].type;
            inputElem.value = settings[s].value;
            inputElem.id = s;
            inputElem.onchange = updateDelegate;
            tdVal.appendChild(inputElem);

            tr.appendChild(tdProp);
            tr.appendChild(tdVal);

            settingsBoxTable.appendChild(tr);
        }
        settingsBox.appendChild(settingsBoxTable);
        var submitButton = document.createElement('input');
        submitButton.type = 'button';
        submitButton.value = "Add to game";
        submitButton.onclick = submitDelegate;
        settingsBox.appendChild(submitButton);
    }

    this.clearSettingsBox = function() {
        var settingsBox = document.querySelector('#plugin_properties');
        settingsBox.innerHTML = '';
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
        pluginsList.appendChild(document.createElement('br'));
    }

    this.clearActivePlugins = function() {
        var activePluginsList = document.querySelector('#active_plugins');
        activePluginsList.innerHTML = '';
        var option = document.createElement('option');
        option.value = '';
        option.textContent = 'Active plugins';
        activePluginsList.options.add(option);
    }

    this.addActivePlugin = function(id) {
        var activePluginsList = document.querySelector('#active_plugins');
        var option = document.createElement('option');
        option.value = id;
        option.textContent = id;
        activePluginsList.options.add(option);
    }

}

WebGameMaker.UI = new UI;
