define(['Phaser'], function (Phaser) {
    'use strict';

    var Bullet = function (game, startX, startY, destX, destY, speed, damage, shooter, sprite, frame) {
        Phaser.Sprite.call(this, game, startX, startY, sprite, frame);

        this.startX = startX;
        this.startY = startY;
        this.destX = destX;
        this.destY = destY;
        this.speed = speed;
        this.damage = damage;
        this.shooter = shooter;

        game.bullets.add(this);
        Bullet.prototype.setVelocityVector(this);
    };

    Bullet.prototype = Object.create(Phaser.Sprite.prototype);
    Bullet.prototype.constructor = Bullet;

    Bullet.prototype.setVelocityVector = function (bullet) {
        var distX = bullet.destX - bullet.startX, distY = bullet.destY - bullet.startY;

        bullet.anchor.setTo(0.5, 0.5);
        bullet.rotation = game.physics.arcade.angleToXY(bullet, bullet.destX, bullet.destY);

        if (Math.abs(distX) > Math.abs(distY)) {
            bullet.body.velocity.set(distX / Math.abs(distX) * bullet.speed, distY / Math.abs(distX) * bullet.speed);
        } else {
            bullet.body.velocity.set(distX / Math.abs(distY) * bullet.speed, distY / Math.abs(distY) * bullet.speed);
        }
    };

    return Bullet;
});
