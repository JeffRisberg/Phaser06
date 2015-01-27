define(['Phaser'], function (Phaser) {
    'use strict';

    var Monster = function (game, xTile, yTile, frame) { // Extends Phaser.Sprite
        Phaser.Sprite.call(this, game, xTile * game.tileSize - 1, yTile * game.tileSize, 'monster', frame);

        this.scale.setTo(1.5, 1.5);
        this.anchor.setTo(0.5, 0.5);
        this.alive = true;
        this.game.physics.arcade.enableBody(this);

        this.body.allowGravity = false;
        this.tile = -1;
        this.speed = 2.5;
        this.health = 100;
        this.maxHealth = 100;

        this.healthBar = this.game.add.graphics(0, 0);
        this.healthBar.lineStyle(2, 0x000000, 1);
        this.healthBar.beginFill(0xFFFF00, 0.8);
        this.healthBar.drawRect(0, 0, this.width, 5);

        this.healthBarStatus = this.game.add.graphics(0, 0);
        this.healthBarStatus.lineStyle(2, 0x000000, 0);
        this.healthBarStatus.beginFill(0x00FF00, 0.9);
        this.healthBarStatus.drawRect(0, 0, this.width, 5);

        Monster.prototype.nextMove(this);
        Monster.prototype.move(this);
    };

    Monster.prototype = Object.create(Phaser.Sprite.prototype);
    Monster.prototype.constructor = Monster;

    Monster.prototype.move = function (monster) {
        monster.x += monster.speedX;
        monster.y += monster.speedY;

        if (monster.speedX > 0 && monster.x >= monster.nextPosX) {
            monster.x = monster.nextPosX;
            Monster.prototype.nextMove(monster);
        } else if (monster.speedX < 0 && monster.x <= monster.nextPosX) {
            monster.x = monster.nextPosX;
            Monster.prototype.nextMove(monster);
        } else if (monster.speedY > 0 && monster.y >= monster.nextPosY) {
            monster.y = monster.nextPosY;
            Monster.prototype.nextMove(monster);
        } else if (monster.speedY < 0 && monster.y <= monster.nextPosY) {
            monster.y = monster.nextPosY;
            Monster.prototype.nextMove(monster);
        }

        monster.healthBar.x = monster.x - monster.width / 2;
        monster.healthBar.y = monster.y - monster.height / 2 - 10;

        monster.healthBarStatus.x = monster.x - monster.width / 2;
        monster.healthBarStatus.y = monster.y - monster.height / 2 - 10;

        var healthRatio = monster.health / monster.maxHealth;
        monster.healthBarStatus.scale.x = healthRatio;
    };

    Monster.prototype.nextMove = function (monster) {
        if (monster.tile < monster.game.tilePath.length - 1) {
            monster.tile++;
        }
        monster.nextPosX = monster.game.tilePath[monster.tile].x * monster.game.tileSize;
        monster.nextPosY = monster.game.tilePath[monster.tile].y * monster.game.tileSize;

        if (monster.nextPosX > monster.x) {
            monster.speedX = monster.speed;
        } else if (monster.nextPosX < monster.x) {
            monster.speedX = -monster.speed;
        } else {
            monster.speedX = 0;
        }

        if (monster.nextPosY > monster.y) {
            monster.speedY = monster.speed;
        } else if (monster.nextPosY < monster.y) {
            monster.speedY = -monster.speed;
        } else {
            monster.speedY = 0;
        }

        monster.health = monster.health - 1;
        if (monster.health < 0) monster.health = 0;
    };

    return Monster;
});
