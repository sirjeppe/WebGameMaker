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
        return plugins;
    }

    this.addPluginInstance = function(instance) {
        if (instance.type == 'object')
            collisionDetector.addObject(instance);

        plugins.push(instance);
    }

    this.draw = function(drawInfo) {
        plugins.sort(this.sortPluginsByZIndex);
        for (var p in plugins) {
            if (plugins[p].type == 'object') {
                if (plugins[p].settings.collides.value) {
                    collisionDetector.findCollisions(plugins[p]);
                }
                plugins[p].draw(drawInfo);
            }
        }
    }

    this.getPluginById = function(id) {
        for (var p in plugins) {
            if (plugins[p].settings.id.value == id) {
                return plugins[p];
            }
        }
    }

    this.sortPluginsByZIndex = function(a, b) {
        return (a.settings.zIndex.value < b.settings.zIndex.value) ? -1 : 1;
    }

}
