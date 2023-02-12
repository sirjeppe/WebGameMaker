'use strict';

import { GameObject } from "./game_object.js";
import { UIElement } from "./ui/ui_element.js";

export class UI {
  wgm;

  constructor(wgm) {
    this.wgm = wgm;

    // Add window resize listener
    window.addEventListener('resize', this.positionCanvas.bind(this), false);

    // Add onchange listener to active plugins select
    const activePluginsList = document.querySelector('#active_plugins');
    activePluginsList.onchange = this.showSettingsBox.bind(this);
  }

  showSettingsBox(pluginInstance) {
    this.clearSettingsBox();

    // If no specific plugin was given - show the one selected by the #active_plugins select
    const activePluginsList = document.querySelector('#active_plugins');
    if (!(pluginInstance instanceof GameObject)) {
      pluginInstance = this.wgm.Game.getPluginByName(activePluginsList.options[activePluginsList.selectedIndex].value);

      if (!pluginInstance) {
        return false;
      }
    }
    const attributes = pluginInstance.getAttributes();
    if (this.wgm.Game.getPluginById(pluginInstance.id) === pluginInstance) {
      // Select the plugin in the active plugins dropdown
      const options = activePluginsList.options;
      for (const o in options) {
        if (options[o].value == pluginInstance.getAttribute('name').value) {
          activePluginsList.selectedIndex = o;
          break;
        }
      }
    } else {
      // Reset active plugin selection
      document.querySelector('#active_plugins').selectedIndex = 0;
    }
    const attributesBox = document.querySelector('#plugin_properties');
    const attributesBoxTable = document.createElement('table');
    attributesBoxTable.id = 'plugin_properties_table';
    for (let attributeName in attributes) {
      const tr = document.createElement('tr');

      const tdProp = document.createElement('td');
      const labelElem = document.createElement('label');
      labelElem.textContent = attributeName;
      labelElem.setAttribute('for', attributeName);
      tdProp.appendChild(labelElem);

      const tdVal = document.createElement('td');
      const inputElem = attributes[attributeName].getHTMLElement();
      // const mappedType = AttributeTypeInputMap[attributes[attribute].type.description];
      // if (mappedType === 'enum') {
      //     inputElem = document.createElement('select');
      //     for (const i = 0; i < attributes[attribute].values.length; i++) {
      //         const o = document.createElement('option');
      //         o.value = attributes[attribute].values[i].value;
      //         o.textContent = attributes[attribute].values[i].name;
      //         if (o.value == attributes[attribute].value) {
      //             o.selected = 'selected';
      //         }
      //         inputElem.options.add(o);
      //     }
      // } else if (mappedType === 'objectList') {
      //     inputElem = document.createElement('select');
      //     // Add leading option
      //     const o = document.createElement('option');
      //     o.value = '';
      //     o.textContent = 'None';
      //     inputElem.add(o);
      //     const activeObjectPlugins = this.wgm.Game.getPluginInstancesByType('object');
      //     for (const i = 0; i < activeObjectPlugins.length; i++) {
      //         const o = document.createElement('option');
      //         o.value = activeObjectPlugins[i].settings.id.value;
      //         o.textContent = activeObjectPlugins[i].settings.id.value;
      //         if (o.value == attributes[attribute].value) {
      //             o.selected = 'selected';
      //         }
      //         inputElem.options.add(o);
      //     }
      // } else if (mappedType === 'actionList') {
      //     inputElem = document.createElement('select');
      //     // Add leading option
      //     const o = document.createElement('option');
      //     o.value = '';
      //     o.textContent = 'None';
      //     inputElem.add(o);
      //     const activeObjectPlugins = this.wgm.Game.getPluginInstancesByType('action');
      //     for (const i = 0; i < activeObjectPlugins.length; i++) {
      //         const o = document.createElement('option');
      //         o.value = activeObjectPlugins[i].settings.id.value;
      //         o.textContent = activeObjectPlugins[i].settings.id.value;
      //         if (o.value == attributes[attribute].value) {
      //             o.selected = 'selected';
      //         }
      //         inputElem.options.add(o);
      //     }
      // } else {
      //     inputElem = document.createElement('input');
      //     inputElem.type = mappedType;
      //     // Checkboxes takes 'checked', not 'value'
      //     if (mappedType === 'checkbox') {
      //         inputElem.checked = attributes[attribute].value;
      //     } else {
      //         inputElem.value = attributes[attribute].value;
      //     }
      //     if (mappedType === 'button') {
      //         inputElem.onclick = attributes[attribute].onclick;
      //     }
      // }
      // if (attributes[attribute].extraAttributes) {
      //     for (const a in attributes[attribute].extraAttributes) {
      //         inputElem[a] = attributes[attribute].extraAttributes[a];
      //     }
      // }
      inputElem.name = attributeName;
      inputElem.id = attributeName;
      if (inputElem.type === 'checkbox') {
        inputElem.onchange = function() { this.wgm.Game.updatePluginInstance(pluginInstance, attributeName, inputElem.checked) }.bind(this);
      } else {
        inputElem.onchange = function() { this.wgm.Game.updatePluginInstance(pluginInstance, attributeName, inputElem.value) }.bind(this);
      }
      tdVal.appendChild(inputElem);

      tr.appendChild(tdProp);
      tr.appendChild(tdVal);

      attributesBoxTable.appendChild(tr);
    }
    attributesBox.appendChild(attributesBoxTable);
    const submitButton = document.createElement('input');
    submitButton.classList.add('addToGame')
    submitButton.type = 'button';
    if (this.wgm.Game.getPluginById(pluginInstance.id.toString()) == pluginInstance) {
      submitButton.value = 'Remove from game';
      submitButton.onclick = function() {
        this.wgm.Game.removePluginInstance(pluginInstance);
        this.wgm.UI.reloadActivePluginsList();
        this.wgm.UI.clearSettingsBox();
      }.bind(this);
    } else {
      submitButton.value = 'Add to game';
      submitButton.onclick = function() {
        if (this.wgm.Game.getPluginByName(pluginInstance.getAttribute('name').value)) {
          alert('Object with that name already exists');
          return false;
        }

        this.wgm.Game.addPluginInstance(pluginInstance);
        this.wgm.UI.reloadActivePluginsList();
        this.showSettingsBox(pluginInstance);
      }.bind(this);
    }
    attributesBox.appendChild(submitButton);
  }

  reloadActivePluginsList() {
    this.clearActivePlugins();
    for (const activePlugin of this.wgm.Game.getPluginInstances()) {
      this.wgm.UI.addActivePlugin(activePlugin);
    }
  }

  clearSettingsBox() {
    const settingsBox = document.querySelector('#plugin_properties');
    settingsBox.innerHTML = '';
  }

  addPluginButton(plugin, delegate) {
    const pluginsList = document.querySelector('#plugin_list');
    const button = document.createElement('input');
    button.type = 'button';
    button.title = plugin.getDescription();
    button.value = plugin.name;
    button.name = plugin.name;
    button.onclick = delegate;
    pluginsList.appendChild(button);
    pluginsList.appendChild(document.createElement('br'));
    this.sortPluginButtons();
  }

  sortPluginButtons() {
    const pluginsList = document.querySelector('#plugin_list');
    const buttonsNodeList = document.querySelectorAll('#plugin_list input');
    const buttonsArray = [];
    for (const b in buttonsNodeList) {
      if (buttonsNodeList[b].nodeType == 1 && buttonsNodeList[b].name) {
        buttonsArray.push(buttonsNodeList[b]);
      }
    }
    buttonsArray.sort(this.sortByPluginName);
    document.querySelector('#plugin_list').innerHTML = '';
    for (const b in buttonsArray) {
      pluginsList.appendChild(buttonsArray[b]);
    }
  };

  sortByPluginName(a, b) {
    return (a.name < b.name) ? -1 : 1;
  };

  clearActivePlugins() {
    const activePluginsList = document.querySelector('#active_plugins');
    activePluginsList.innerHTML = '';
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Active plugins';
    activePluginsList.options.add(option);
  }

  addActivePlugin(plugin) {
    const activePluginsList = document.querySelector('#active_plugins');
    const option = document.createElement('option');
    option.value = plugin.getAttribute('name').value;
    option.textContent = option.value;
    activePluginsList.options.add(option);
  }

  positionCanvas() {
    const canvas = this.wgm.Settings.canvas;
    canvas.left = parseInt(window.innerWidth / 2) - parseInt(canvas.width / 2);
    canvas.top = parseInt(window.innerHeight / 2) - parseInt(canvas.height / 2);
    this.wgm.Settings.canvas.element.style.top = canvas.top + 'px';
    this.wgm.Settings.canvas.element.style.left = canvas.left + 'px';
  }

  addStoredGame(name) {
    const storedGamesSelect = document.getElementById('stored_games');
    const newOption = document.createElement('option');
    newOption.text = name;
    storedGamesSelect.appendChild(newOption);
  }

  initTopMenu() {
    let menus = {
      'File': [
        {
          'Load': this.showLoadGameDialog
        }
      ]
    };
    let topMenu = document.querySelector('#top_bar');
    for (let menuItem in menus) {
      let div = document.createElement('div');
      div.id = menuItem;
      div.textContent = menuItem;
      topMenu.appendChild(div);
    }

    // Play/pause/reset
    const controllerMenu = new UIElement();
    controllerMenu.setTemplate(`
      <div>
        <input type="button" value="{{playValue}}" onclick="WebGameMaker.Game.play()">
        <input type="button" value="{{pauseValue}}" onclick="WebGameMaker.Game.pause()">
        <input type="button" value="{{resetValue}}" onclick="WebGameMaker.Game.reset()">
      </div>
    `);
    controllerMenu.bindContext({playValue: 'Play', pauseValue: 'Pause', resetValue: 'Reset'});
    document.querySelector('#top_bar').appendChild(controllerMenu.getElement());
  }
}
