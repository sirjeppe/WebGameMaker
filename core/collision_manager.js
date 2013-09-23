"use strict";

function CollisionManager() {

    var objects = [];

    this.intersect = function(object1, object2) {
        var pos1 = object1.getLocation();
        var pos2 = object2.getLocation();
        return (((pos1.x >= pos2.x && pos1.x <= pos2.x + pos2.width) &&
                  (pos1.y >= pos2.y && pos1.y <= pos2.y + pos2.height)) ||
                ((pos2.x >= pos1.x && pos2.x <= pos1.x + pos1.width) &&
                  (pos2.y >= pos1.y && pos2.y <= pos1.y + pos1.height)));
    }

    this.addObject = function(object) {
        objects.push(object);
    }

    this.findCollisions = function(object) {
        var collidedWith = [];
        for (var i = 0; i < objects.length; i++) {
            if (object.settings.id.value != objects[i].settings.id.value &&
                    this.intersect(object, objects[i]))
                collidedWith.push(objects[i].settings.id.value);
        }

        if (collidedWith.length > 0) {
            console.log('Found collision');
            object.onCollision({
                'collidedWith': collidedWith
            });
        }
    }
}
