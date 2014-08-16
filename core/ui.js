'use strict';

function UI() {

    this.showSettingsBox = function(pluginInstance, updateDelegate, submitDelegate, removeDelegate) {
        this.clearSettingsBox();
        if (!pluginInstance) {
            return false;
        }
        var settings = pluginInstance.settings;
        if (WebGameMaker.Game.getPluginById(settings.id.value) == pluginInstance) {
            // Select the plugin in the active plugins dropdown
            var activePluginsList = document.querySelector('#active_plugins');
            var options = activePluginsList.options;
            for (var o in options) {
                if (options[o].value == settings.id.value) {
                    activePluginsList.selectedIndex = o;
                    break;
                }
            }
        } else {
            // Reset active plugin selection
            document.querySelector('#active_plugins').selectedIndex = 0;
        }
        var settingsBox = document.querySelector('#plugin_properties');
        var settingsBoxTable = document.createElement('table');
        settingsBoxTable.id = 'plugin_properties_table';
        for (var s in settings) {
            var tr = document.createElement('tr');

            var tdProp = document.createElement('td');
            var labelElem = document.createElement('label');
            labelElem.textContent = ((settings[s].name) ? settings[s].name : s) + ': ';
            labelElem.setAttribute('for', s);
            tdProp.appendChild(labelElem);

            var tdVal = document.createElement('td');
            if (settings[s].type == 'enum') {
                var inputElem = document.createElement('select');
                for (var i = 0; i < settings[s].values.length; i++) {
                    var o = document.createElement('option');
                    o.value = settings[s].values[i].value;
                    o.textContent = settings[s].values[i].name;
                    if (o.value == settings[s].initialValue) {
                        o.selected = 'selected';
                    }
                    inputElem.options.add(o);
                }
            } else if (settings[s].type == 'objectList') {
                var inputElem = document.createElement('select');
                // Add leading option
                var o = document.createElement('option');
                o.value = '';
                o.textContent = 'None';
                inputElem.add(o);
                var activeObjectPlugins = WebGameMaker.Game.getPluginInstancesByType('object');
                for (var i = 0; i < activeObjectPlugins.length; i++) {
                    var o = document.createElement('option');
                    o.value = activeObjectPlugins[i].settings.id.value;
                    o.textContent = activeObjectPlugins[i].settings.id.value;
                    if (o.value == settings[s].initialValue) {
                        o.selected = 'selected';
                    }
                    inputElem.options.add(o);
                }
            } else if (settings[s].type == 'actionList') {
                var inputElem = document.createElement('select');
                // Add leading option
                var o = document.createElement('option');
                o.value = '';
                o.textContent = 'None';
                inputElem.add(o);
                var activeObjectPlugins = WebGameMaker.Game.getPluginInstancesByType('action');
                for (var i = 0; i < activeObjectPlugins.length; i++) {
                    var o = document.createElement('option');
                    o.value = activeObjectPlugins[i].settings.id.value;
                    o.textContent = activeObjectPlugins[i].settings.id.value;
                    if (o.value == settings[s].initialValue) {
                        o.selected = 'selected';
                    }
                    inputElem.options.add(o);
                }
            } else {
                var inputElem = document.createElement('input');
                inputElem.type = settings[s].type;
                // Checkboxes takes 'checked', not 'value'
                if (settings[s].type == 'checkbox') {
                    inputElem.checked = settings[s].initialValue;
                } else {
                    inputElem.value = settings[s].initialValue;
                }
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
        if (WebGameMaker.Game.getPluginById(settings.id.value) == pluginInstance) {
            submitButton.value = 'Remove from game';
            submitButton.onclick = removeDelegate;
        } else {
            submitButton.value = 'Add to game';
            submitButton.onclick = submitDelegate;
        }
        settingsBox.appendChild(submitButton);
    }

    this.reloadActivePluginsList = function() {
        this.clearActivePlugins();
        var activePlugins = WebGameMaker.Game.getPluginInstances();
        for (var p in activePlugins) {
            WebGameMaker.UI.addActivePlugin(activePlugins[p].settings.id.value);
        }
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

    this.addStoredGame = function(name) {
        var storedGamesSelect = document.getElementById('stored_games');
        var newOption = document.createElement('option');
        newOption.text = name;
        storedGamesSelect.appendChild(newOption);
    }
}

WebGameMaker.UI = new UI;

window.addEventListener('resize', WebGameMaker.UI.positionCanvas, false);
