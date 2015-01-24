define(function () {
    'use strict';
    var game;

    function Boot(_game) {
        game = _game;
    }

    Boot.prototype = {
        preload: function () {

            this.load.image('preloader', 'assets/sprites/loading.gif');

        },

        create: function () {
            this.game.state.start('preload');
        }
    }

    return Boot;
});
