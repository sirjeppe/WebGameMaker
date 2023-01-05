'use strict';

class CollisionDetector {

    objects = [];

    collide(object1, object2) {
        var pos1 = object1.getLocation();
        var pos2 = object2.getLocation();

        var width = pos1.width / 2;
        var height = pos1.height / 2;

        var topLeft1 = {
            'x': pos1.x,
            'y': pos1.y,
            'width': width,
            'height': height,
        };

        var topRight1 = {
            'x': pos1.x + width,
            'y': pos1.y,
            'width': width,
            'height': height,
        };

        var bottomLeft1 = {
            'x': pos1.x,
            'y': pos1.y + height,
            'width': width,
            'height': height,
        };

        var bottomRight1 = {
            'x': pos1.x + width,
            'y': pos1.y + height,
            'width': width,
            'height': height,
        };

        var topLeft2 = {
            'x': pos2.x,
            'y': pos2.y,
            'width': width,
            'height': height,
        };

        var topRight2 = {
            'x': pos2.x + width,
            'y': pos2.y,
            'width': width,
            'height': height,
        };

        var bottomLeft2 = {
            'x': pos2.x,
            'y': pos2.y + height,
            'width': width,
            'height': height,
        };

        var bottomRight2 = {
            'x': pos2.x + width,
            'y': pos2.y + height,
            'width': width,
            'height': height,
        };

        var topLeftCollision = false;
        var topRightCollision = false;
        var bottomRightCollision = false;
        var bottomLeftCollision = false;

        if (this.intersectHelper(topLeft1, topRight2) ||
            this.intersectHelper(topLeft1, bottomLeft2) ||
            this.intersectHelper(topLeft1, bottomRight2)) {
            topLeftCollision = true;
        }

        if (this.intersectHelper(topRight1, topLeft2) ||
            this.intersectHelper(topRight1, bottomLeft2) ||
            this.intersectHelper(topRight1, bottomRight2)) {
            topRightCollision = true;
        }

        if (this.intersectHelper(bottomLeft1, topLeft2) ||
            this.intersectHelper(bottomLeft1, topRight2) ||
            this.intersectHelper(bottomLeft1, bottomRight2)) {
            bottomLeftCollision = true;
        }

        if (this.intersectHelper(bottomRight1, topRight2) ||
            this.intersectHelper(bottomRight1, topLeft2) ||
            this.intersectHelper(bottomRight1, bottomLeft2)) {
            bottomRightCollision = true;
        }

        var collisionData = {
            'topLeftCollision': topLeftCollision,
            'topRightCollision': topRightCollision,
            'bottomRightCollision': bottomRightCollision,
            'bottomLeftCollision': bottomLeftCollision,
        };

        if (topLeftCollision || topRightCollision || bottomRightCollision || bottomLeftCollision) {
            return collisionData;
        }

        return null;
    };

    intersectHelper(pos1, pos2) {
        return (
            (
                (pos1.x >= pos2.x && pos1.x <= pos2.x + pos2.width) &&
                (pos1.y >= pos2.y && pos1.y <= pos2.y + pos2.height)
            ) || (
                (pos2.x >= pos1.x && pos2.x <= pos1.x + pos1.width) &&
                (pos2.y >= pos1.y && pos2.y <= pos1.y + pos1.height)
            )
        );
    };

    addObject(object) {
        this.objects.push(object);
    };

    findCollisions(object) {
        var collidedWith = [];
        for (var i = 0; i < this.objects.length; i++) {

            if (object.settings.id.value != this.objects[i].settings.id.value) {
                var collisionData = this.collide(object, this.objects[i]);
                if (collisionData) {
                    collidedWith.push({
                        'objectID': objects[i].settings.id.value,
                        'collisionData': collisionData
                    });
                }
            }
        }

        if (collidedWith.length > 0) {
            console.log('Found collision');
            WebGameMaker.Game.getPluginById(object.settings.id.value).onCollision({
                'collidedWith': collidedWith
            });
        }
    };
}
