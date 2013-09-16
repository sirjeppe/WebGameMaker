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
            if (settings[s].type == 'enum') {
                var inputElem = document.createElement('select');
                for (var i = 0; i < settings[s].values.length; i++) {
                    var o = document.createElement('option');
                    o.value = settings[s].values[i];
                    o.textContent = settings[s].values[i];
                    if (o.value == settings[s].value) {
                        o.selected = 'selected';
                    }
                    inputElem.options.add(o);
                }
            } else {
                var inputElem = document.createElement('input');
                inputElem.type = settings[s].type;
                inputElem.value = settings[s].value;
                if (settings[s].type == 'button') {
                    inputElem.onclick = settings[s].onclick;
                }
            }
            inputElem.name = s;
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

    this.positionCanvas = function() {
        var canvas = WebGameMaker.Settings.canvas;
        canvas.left = parseInt(window.innerWidth / 2) - parseInt(canvas.width / 2);
        canvas.top = parseInt(window.innerHeight / 2) - parseInt(canvas.height / 2);
        WebGameMaker.Settings.canvas.element.style.top = canvas.top + 'px';
        WebGameMaker.Settings.canvas.element.style.left = canvas.left + 'px';
    }

}

WebGameMaker.UI = new UI;

window.addEventListener('resize', WebGameMaker.UI.positionCanvas, false);
