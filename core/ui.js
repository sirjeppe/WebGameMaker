"use strict";

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
        for (var s in settings) {
            var tr = document.createElement('tr');

            var tdProp = document.createElement('td');
            var labelElem = document.createElement('label');
            labelElem.textContent = ((settings[s].name) ? settings[s].name : s) + ': ';
            labelElem.for = s;
            tdProp.appendChild(labelElem);

            var tdVal = document.createElement('td');
            if (settings[s].type == 'enum') {
                var inputElem = document.createElement('select');
                for (var i = 0; i < settings[s].values.length; i++) {
                    var o = document.createElement('option');
                    o.value = settings[s].values[i];
                    o.textContent = settings[s].values[i];
                    if (o.value == settings[s].initial_value) {
                        o.selected = 'selected';
                    }
                    inputElem.options.add(o);
                }
            } else {
                var inputElem = document.createElement('input');
                inputElem.type = settings[s].type;
                inputElem.value = settings[s].initial_value;
                if (settings[s].type == 'button') {
                    inputElem.onclick = settings[s].onclick;
                }
            }
            if (settings[s].extraAttributes) {
                for (var a in settings[s].extraAttributes) {
                    inputElem[a] = settings[s].extraAttributes[a];
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
        this.sortPluginButtons();
    }

    this.sortPluginButtons = function() {
        var pluginsList = document.querySelector('#plugin_list');
        var buttonsNodeList = document.querySelectorAll('#plugin_list input');
        var buttonsArray = [];
        for (var b in buttonsNodeList) {
            if (buttonsNodeList[b].nodeType == 1 && buttonsNodeList[b].name) {
                buttonsArray.push(buttonsNodeList[b]);
            }
        }
        buttonsArray.sort(this.sortByPluginName);
        document.querySelector('#plugin_list').innerHTML = '';
        for (var b in buttonsArray) {
            pluginsList.appendChild(buttonsArray[b]);
            pluginsList.appendChild(document.createElement('br'));
        }
    };

    this.sortByPluginName = function(a, b) {
        return (a.name < b.name) ? -1 : 1;
    };

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
