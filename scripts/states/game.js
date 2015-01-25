define(['extensions/PausePanel'], function (PausePanel) {
    'use strict';
    var game;

    function Game(_game) {
        game = _game;
    }

    Game.prototype = {
        create: function () {
            this.background = game.add.tileSprite(0, 0, game.width, game.cache.getImage('background').height, 'background');
        },

        update: function () {
            // to be filled in
        }
    };

    return Game;
});
