"use strict";

function Game() {

    var plugins = [];
    var collisionManager = new CollisionManager;

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
            collisionManager.addObject(instance);

        plugins.push(instance);
    }

    this.redraw = function(draw_info) {
        for (var p in plugins) {
            if (plugins[p].type == 'object') {
                collisionManager.findCollisions(plugins[p]);
                plugins[p].redraw(draw_info);
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
}
