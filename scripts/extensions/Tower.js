define(['Phaser'], function (Phaser) {
    'use strict';

    var Tower = function (game, x, y, frame) { // Extends Phaser.Sprite
        Phaser.Sprite.call(this, game, x, y, 'tower', frame);

        this.scale.setTo(2, 2);
        this.anchor.setTo(0.5, 0.5);
        this.alive = true;
        this.animations.add('default', [4], 10, true);
        this.animations.play('default');
        this.game.physics.arcade.enableBody(this);

        this.body.allowGravity = false;
    };

    Tower.prototype = Object.create(Phaser.Sprite.prototype);
    Tower.prototype.constructor = Tower;

    Tower.prototype.update = function () {
    };

    return Tower;
});
