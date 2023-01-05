'use strict';

class Game {

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
        this.plugins.sort(this.sortPluginsByID);
        return this.plugins;
    }

    getPluginInstancesByType(objectType) {
        return this.plugins.filter(plugin => plugin.type == objectType);
    }

    addPluginInstance(instance) {
        if (instance.type == 'object')
            this.collisionDetector.addObject(instance);

        this.plugins.push(instance);
    }

    removePluginInstance(pluginID) {
        this.plugins.splice(this.plugins.findIndex(plugin => plugin.settings.id.value === pluginID), 1);
    }

    draw(drawInfo) {
        let objectsToDraw = this.getPluginInstancesByType('object');
        objectsToDraw.sort(this.sortPluginsByZIndex);
        for (let plugin of objectsToDraw) {
            if (plugin.type == 'object') {
                if (plugin.settings.collides.value) {
                    this.collisionDetector.findCollisions(plugin);
                }
                plugin.draw(drawInfo);
            }
        }
    }

    getPluginById(id) {
        return this.plugins.find(plugin => plugin.settings.id.value === id);
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

    sortPluginsByID(a, b) {
        if (a.settings.id && b.settings.id) {
            return (a.settings.id.value < b.settings.id.value) ? -1 : 1;
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
