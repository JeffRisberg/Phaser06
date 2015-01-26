define(['Phaser'], function (Phaser) {
    'use strict';

    var House = function (game, x, y, frame) { // Extends Phaser.Sprite
        Phaser.Sprite.call(this, game, x, y, 'house', frame);

        this.scale.setTo(2, 2);
        this.anchor.setTo(0.5, 0.5);
        this.alive = true;
        this.animations.add('default', [4], 10, true);
        this.animations.play('default');
        this.game.physics.arcade.enableBody(this);

        this.body.allowGravity = false;
    };

    House.prototype = Object.create(Phaser.Sprite.prototype);
    House.prototype.constructor = House;

    House.prototype.update = function () {
    };

    return House;
});
