'use strict';

requirejs.config({
    //baseUrl: './scripts',
    paths: {
        //libs
        almond: '../bower_components/almond/almond',
        phaser: '../bower_components/phaser/build/phaser.min',

        //states
        bootState: 'game/states/boot',
        preloadState: 'game/states/preload',
        menuState: 'game/states/menu',
        gameState: 'game/states/game'
    }
});

require([
    'phaser',
    'bootState',
    'preloadState',
    'menuState',
    'gameState'
], function (phaser, boot, preload, menu, game) {
    var phaserGame = new Phaser.Game("100", "100", Phaser.AUTO, 'Phaser06');

    phaserGame.state.add('boot', boot);
    phaserGame.state.add('preload', preload);
    phaserGame.state.add('menu', menu);
    phaserGame.state.add('game', game);

    phaserGame.state.start('boot');

    return phaserGame;
});

