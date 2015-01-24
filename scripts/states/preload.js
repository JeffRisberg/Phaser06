define(function () {
    'use strict';
    var game;

    function Preload(_game) {
        game = _game;
    }

    Preload.prototype = {

        preload: function () {
            this.ready = false;
            this.game.load.start();

            this.loading = this.add.sprite(this.game.world.width / 2 - 50, this.game.world.height / 2 - 50, 'preloader');
            this.loading.anchor.setTo(0.5, 0.5);
            this.loading.scale.set(0.3);

            this.game.load.setPreloadSprite(this.loading);

            this.game.stage.backgroundColor = '#222222';

            this.game.load.image('bullet', 'assets/sprites/bullet.png');
            this.game.load.image('arrow', 'assets/sprites/bulletArrow.png');
            this.game.load.image('arrow_fire', 'assets/sprites/bulletArrow_Fire.png');
            this.game.load.image('arrow_power', 'assets/sprites/bulletArrow_Power.png');
            this.game.load.image('tower1', 'assets/sprites/tower1.png');
            this.game.load.image('tower2', 'assets/sprites/tower2.png');
            this.game.load.image('tower3', 'assets/sprites/tower3.png');

            this.game.load.image('menu', 'assets/backgrounds/menu.png');

            this.load.spritesheet('btn-game-start', 'assets/buttons/btn-game-start.png', 401, 143);
        },

        create: function () {
            this.game.load.onLoadComplete.addOnce(this.loadComplete, this);
        },

        update: function () {
            if (this.ready) {
                this.game.state.start('menu');
            }
        },

        loadComplete: function () {
            this.ready = true;
        }
    }

    return Preload;
});

