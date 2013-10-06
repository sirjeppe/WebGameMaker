"use strict";

function Game() {

    var plugins = [];
    var collisionDetector = new CollisionDetector;

    this.play = function() {
        for (var p in plugins) {
            plugins[p].initialize();
            plugins[p].play();
        }
    }

    this.pause = function() {
        for (var p in plugins) {
            plugins[p].pause();
        }
    }

    this.reset = function() {
        for (var p in plugins) {
            plugins[p].reset();
        }
    }

    this.getPluginInstances = function() {
        plugins.sort(this.sortPluginsByID);
        return plugins;
    }

    this.getPluginInstancesByType = function(objectType) {
        var pluginsByType = [];
        for (var p in plugins) {
            if (plugins[p].type == objectType) {
                pluginsByType.push(plugins[p]);
            }
        }
        return pluginsByType;
    }

    this.addPluginInstance = function(instance) {
        if (instance.type == 'object')
            collisionDetector.addObject(instance);

        plugins.push(instance);
    }

    this.removePluginInstance = function(pluginID) {
        for (var p in plugins) {
            if (plugins[p].settings.id.value == pluginID) {
                plugins.splice(p, 1);
                break;
            }
        }
    }

    this.draw = function(drawInfo) {
        var objectsToDraw = this.getPluginInstancesByType('object');
        objectsToDraw.sort(this.sortPluginsByZIndex);
        for (var p in objectsToDraw) {
            if (objectsToDraw[p].type == 'object') {
                if (objectsToDraw[p].settings.collides.value) {
                    collisionDetector.findCollisions(objectsToDraw[p]);
                }
                objectsToDraw[p].draw(drawInfo);
            }
        }
    }

    this.getPluginById = function(id) {
        for (var p in plugins) {
            if (plugins[p].settings.id.value == id) {
                return plugins[p];
            }
        }
        return null;
    }

    this.sortPluginsByZIndex = function(a, b) {
        if (a.settings.zIndex && b.settings.zIndex) {
            return (a.settings.zIndex.value < b.settings.zIndex.value) ? -1 : 1;
        }
    }

    this.sortPluginsByID = function(a, b) {
        if (a.settings.id && b.settings.id) {
            return (a.settings.id.value < b.settings.id.value) ? -1 : 1;
        }
    }

}
