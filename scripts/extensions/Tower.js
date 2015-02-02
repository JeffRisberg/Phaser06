define(['Phaser', 'extensions/Monster'], function (Phaser, Monster) {
    'use strict';

    var Tower = function (game, x, y, towerSprite, damage, range, fireRate, health, bulletSpeed, price, bulletSprite, frame) { // Extends Phaser.Sprite
        this.xTile = Math.round(x / game.tileSize);
        this.yTile = Math.round(y / game.tileSize);

        Phaser.Sprite.call(this, game, this.xTile * game.tileSize, this.yTile * game.tileSize, towerSprite, frame);

        this.anchor.setTo(0.5, 0.5);
        this.alive = true;
        this.animations.add('default', [4], 10, true);
        this.animations.play('default');
        this.game.physics.arcade.enableBody(this);

        this.damage = damage;
        this.range = range;
        this.health = health;
        this.fireRate = fireRate;
        this.lastShot = game.time.now;
        this.bulletSpeed = bulletSpeed;
        this.price = price;
        this.bulletSprite = bulletSprite;

        this.body.allowGravity = false;
    };

    Tower.prototype = Object.create(Phaser.Sprite.prototype);
    Tower.prototype.constructor = Tower;

    Tower.prototype.attack = function (tower, monsters) {
        if (tower.game.time.now > tower.lastShot) {

            console.log("checking targets");
            var targets = [];
            monsters.forEach(function (monster) {
                if (Math.abs(tower.game.tilePath[monster.tile].y - tower.yTile) <= tower.range &&
                    Math.abs(tower.game.tilePath[monster.tile].x - tower.xTile) <= tower.range) {
                    targets.push(monster);
                }
            });
            if (targets.length > 0) {
                console.log("firing on " + targets[0]);
                Monster.prototype.damageTaken(targets[0], tower.damage);
                //Tower.prototype.fire(tower, targets[0]);
            }
            tower.lastShot = tower.game.time.now + tower.fireRate;
        }
    };

    Tower.prototype.fire = function (tower, monster) {
        new Bullet(tower.x, tower.y, monster.x, monster.y, tower.bulletSpeed, tower.damage, tower, tower.bulletSprite);
    };

    Tower.prototype.damageTaken = function (tower, damage) {
        tower.health -= damage;

        if (tower.health <= 0) {
            tower.health = 0;
            Tower.prototype.death(this);
        }
    };

    Tower.prototype.death = function (tower) {
        console.log('tower destroyed' + tower);
    };

    return Tower;
});
