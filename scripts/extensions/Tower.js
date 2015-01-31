define(['Phaser'], function (Phaser) {
    'use strict';

    var Tower = function (game, x, y, sprite, damage, range, fireRate, health, bulletSpeed, price, bulletSprite, frame) { // Extends Phaser.Sprite
        console.log("creating tower");
        Phaser.Sprite.call(this, game, x, y, sprite, frame);

        this.xTile = x / this.game.tileSize;
        this.yTile = y / this.game.tileSize;
        console.log(this.xTile);
        console.log(this.yTile);
        this.scale.setTo(2, 2);
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
        console.log("end creating a tower");
    };

    Tower.prototype = Object.create(Phaser.Sprite.prototype);
    Tower.prototype.constructor = Tower;

    Tower.prototype.update = function (tower) {
    };

    Tower.prototype.attack = function (tower) {
        if (tower.game.time.now > tower.lastShot) {

            var targets = [];
            monsters.forEach(function (monster) {
                if (Math.abs(tower.game.tilePath[monster.tile].y - tower.yTile) < tower.range &&
                    Math.abs(tower.game.tilePath[monster.tile].x - tower.xTile) < tower.range) {
                    targets.push(monster);
                }
            });
            if (targets.length > 0) {
                Tower.prototype.fire(tower, targets[0]);
            }
            tower.lastShot = game.time.now + tower.fireRate;
        }
    };

    Tower.prototype.fire = function (tower, monster) {
        new Bullet(tower.x, tower.y, monster.x, monster.y, tower.bulletSpeed, tower.damage, tower, tower.bulletSprite);
    };

    Tower.prototype.damageTaken = function (tower, monster) {
        tower.health -= monster.damage;
        if (tower.health <= 0) {
            Tower.prototype.death(this);
        }
    };

    Tower.prototype.death = function (tower) {
        console.log('tower destroyed' + tower);
    };

    return Tower;
});
