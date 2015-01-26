define(['Phaser'], function (Phaser) {
    'use strict';

    var House = function (game, xTile, yTile, frame) { // Extends Phaser.Sprite
        Phaser.Sprite.call(this, game, xTile * game.tileSize - 1, yTile * game.tileSize, 'house', frame);

        this.scale.setTo(1.0, 1.0);
        this.anchor.setTo(0.5, 0.5);
        this.alive = true;
        this.game.physics.arcade.enableBody(this);

        this.body.allowGravity = false;
    };

    House.prototype = Object.create(Phaser.Sprite.prototype);
    House.prototype.constructor = House;

    House.prototype.update = function () {
    };

    return House;
});
