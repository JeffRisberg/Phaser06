define(['Phaser'], function (Phaser) {
    'use strict';

    var Tower = function (game, x, y, damage, range, fireRate, health, bulletSpeed, frame) { // Extends Phaser.Sprite
        Phaser.Sprite.call(this, game, x, y, 'tower', frame);

        // Salva tile em que estÃ¡
        this.xTile = x / this.game.tileSize;
        this.yTile = y / this.game.tileSize;

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

        this.body.allowGravity = false;
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
        //var sfxFire = game.add.audio('towerFire');
        //sfxFire.play();
        new Bullet(tower.x, tower.y, monster.x, monster.y, tower.bulletSpeed, tower.damage, tower, tower.bulletSprite);
    };

    Tower.prototype.damageTaken = function (tower, monster) {
        tower.health -= monster.damage;
        if (tower.health <= 0 && tower.imortal === false) {
            Tower.prototype.death(this);
        }
    };

    Tower.prototype.death = function (tower) {
        console.log('tower destroyed' + tower);
    };

    return Tower;
});
