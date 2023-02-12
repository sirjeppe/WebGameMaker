'use strict';

import { CollisionDetector } from "./collision_detector.js";
import { Drawable } from "./drawable.js";

export class Game {

  name = 'Game name';
  plugins = [];
  collisionDetector = new CollisionDetector();

  play() {
    for (let plugin of this.plugins) {
      plugin.initialize();
      plugin.play();
    }
  }

  pause() {
    for (let plugin of this.plugins) {
      plugin.pause();
    }
  }

  reset() {
    for (let plugin of this.plugins) {
      plugin.reset();
    }
  }

  getPluginInstances() {
    this.plugins.sort(this.sortPluginsByName);
    return this.plugins;
  }

  getPluginInstancesByType(pluginClass) {
    return this.plugins.filter(plugin => plugin instanceof pluginClass);
  }

  addPluginInstance(instance) {
    if (instance.type == 'object')
      this.collisionDetector.addObject(instance);

    this.plugins.push(instance);
  }

  updatePluginInstance(instance, attributeName, newAttributeValue) {
    if (instance == null) {
      return;
    }

    // In case the property that is being changed is the name, we first need
    // to verify that there isn't already an object with the new name.
    if (attributeName === 'name') {
      if (this.Game.getPluginByName(newAttributeValue)) {
        alert('Object with that name already exists');
        return false;
      }
    }

    // Store the new property in the object.
    instance.setAttribute(instance.getAttribute(attributeName).type, attributeName, newAttributeValue);
  }

  removePluginInstance(instance) {
    this.plugins.splice(this.plugins.findIndex(plugin => plugin === instance), 1);
  }

  draw(drawInfo) {
    let objectsToDraw = this.getPluginInstancesByType(Drawable);
    objectsToDraw.sort(this.sortPluginsByZIndex);
    for (const drawable of objectsToDraw) {
      if (drawable.getAttribute('collides').value) {
        this.collisionDetector.findCollisions(drawable);
      }
      drawable.draw(drawInfo);
    }
  }

  getPluginById(id) {
    return this.plugins.find(plugin => plugin.id.toString() === id.toString());
  }

  getPluginByName(name) {
    return this.plugins.find(plugin => plugin.getAttribute('name').value === name);
  }

  getPluginByPosition(x, y) {
    let subjects = [];
    for (let plugin of this.plugins) {
      if (plugin.type == 'object') {
        if (x > plugin.settings.x.value &&
          x < plugin.settings.x.value + plugin.settings.width.value &
          y > plugin.settings.y.value &&
          y < plugin.settings.y.value + plugin.settings.height.value) {
          subjects.push(plugin);
        }
      }
    }
    subjects.sort(this.sortPluginsByZIndex);
    return subjects.pop();
  }

  sortPluginsByZIndex(a, b) {
    if (a.settings.zIndex && b.settings.zIndex) {
      return (a.settings.zIndex.value < b.settings.zIndex.value) ? -1 : 1;
    }
  }

  sortPluginsByName(a, b) {
    if ('id' in a && 'id' in b) {
      return (a.id.toString() < b.id.toString()) ? -1 : 1;
    }
  }

  bringToFront(obj) {
    if (!'zIndex' in obj.settings) return;

    let highestZIndex = 0;
    for (let plugin of this.plugins) {
      if (plugin.type == 'object') {
        highestZIndex = max(highestZIndex, plugin.settings.zIndex.value);
      }
    }

    obj.settings.zIndex.value = highestZIndex + 1;
  }

  sendToBack(obj) {
    if (!'zIndex' in obj.settings) return;

    let lowestZIndex = 0;
    for (let plugin of this.plugins) {
      if (plugin.type == 'object') {
        lowestZIndex = min(lowestZIndex, plugin.settings.zIndex.value);
      }
    }

    obj.settings.zIndex.value = lowestZIndex - 1;
  }

}
