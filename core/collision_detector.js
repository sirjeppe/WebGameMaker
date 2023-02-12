'use strict';

export class CollisionDetector {

    objects = [];

    collide(object1, object2) {
        let pos1 = object1.getLocation();
        let pos2 = object2.getLocation();

        let width = pos1.width / 2;
        let height = pos1.height / 2;

        let topLeft1 = {
            'x': pos1.x,
            'y': pos1.y,
            'width': width,
            'height': height,
        };

        let topRight1 = {
            'x': pos1.x + width,
            'y': pos1.y,
            'width': width,
            'height': height,
        };

        let bottomLeft1 = {
            'x': pos1.x,
            'y': pos1.y + height,
            'width': width,
            'height': height,
        };

        let bottomRight1 = {
            'x': pos1.x + width,
            'y': pos1.y + height,
            'width': width,
            'height': height,
        };

        let topLeft2 = {
            'x': pos2.x,
            'y': pos2.y,
            'width': width,
            'height': height,
        };

        let topRight2 = {
            'x': pos2.x + width,
            'y': pos2.y,
            'width': width,
            'height': height,
        };

        let bottomLeft2 = {
            'x': pos2.x,
            'y': pos2.y + height,
            'width': width,
            'height': height,
        };

        let bottomRight2 = {
            'x': pos2.x + width,
            'y': pos2.y + height,
            'width': width,
            'height': height,
        };

        let topLeftCollision = false;
        let topRightCollision = false;
        let bottomRightCollision = false;
        let bottomLeftCollision = false;

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

        let collisionData = {
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
        let collidedWith = [];
        for (let i = 0; i < this.objects.length; i++) {
            if (object.settings.id.value !== this.objects[i].settings.id.value) {
                let collisionData = this.collide(object, this.objects[i]);
                if (collisionData) {
                    collidedWith.push({
                        'objectID': this.objects[i].settings.id.value,
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
