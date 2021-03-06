define(['extensions/Monster', 'extensions/House', 'extensions/Bullet', 'extensions/Tower', 'extensions/PausePanel'],
    function (Monster, House, Bullet, Tower, PausePanel) {
        'use strict';
        var game;

        // Primary map display
        var mapSprite;

        // Groups
        var houses;
        var monsters;
        var towers;
        var bullets;

        var house;
        var tower;
        var timers = {};
        var gameover;

        function Game(_game) {
            game = _game;

            game.score = 0;
            game.money = 1000;
        }

        Game.prototype = {
            create: function () {
                this.game.physics.startSystem(Phaser.Physics.ARCADE);

                this.game.map = this.game.add.tilemap('tileData');

                this.game.map.addTilesetImage('tileSet', 'tileSet');

                this.game.layer = this.game.map.createLayer('control');

                this.game.tilePath = this.calcPath(this.game.map, this.game.layer);
                this.game.tileSize = 32;

                mapSprite = this.game.add.sprite(0, 0, 'mapImage');

                // Create group for houses
                houses = this.game.add.group();
                houses.enableBody = true;
                this.game.physics.enable(houses, Phaser.Physics.ARCADE);

                // Create group for monsters
                monsters = this.game.add.group();
                monsters.enableBody = true;
                this.game.physics.enable(monsters, Phaser.Physics.ARCADE);

                // Create group for towers
                towers = this.game.add.group();
                towers.enableBody = true;
                this.game.physics.enable(towers, Phaser.Physics.ARCADE);

                // Create group for bullets
                bullets = this.game.add.group();
                bullets.enableBody = true;
                this.game.physics.enable(bullets, Phaser.Physics.ARCADE);
                bullets.setAll('outOfBoundsKill', true);
                bullets.setAll('checkWorldBounds', true);
                bullets.setAll('anchor.x', 0.5);
                bullets.setAll('anchor.y', 0.5);

                var style1 = { font: "11px Arial", fill: "#FFFFFF", align: "center" };
                var style2 = { font: "16px Arial", fill: "#FFFFFF", align: "center" };

                // Create tool for making Houses
                this.game.add.sprite(this.game.width - 200, this.game.height - 150, 'house');
                house = this.game.add.sprite(this.game.width - 200, this.game.height - 150, 'house');
                house.inputEnabled = true;
                house.input.enableDrag();
                house.events.onDragStop.add(this.addOneHouse, this);
                text = "House";
                this.game.add.text(this.game.width - 120, this.game.height - 150, text, style1);
                text = "$50";
                this.game.add.text(this.game.width - 120, this.game.height - 120, text, style2);

                // Create tool for making Towers
                this.game.add.sprite(this.game.width - 200, this.game.height - 250, 'tower');
                tower = this.game.add.sprite(this.game.width - 200, this.game.height - 250, 'tower');
                tower.inputEnabled = true;
                tower.input.enableDrag();
                tower.events.onDragStop.add(this.addOneTower, this);
                text = "Tower";
                this.game.add.text(this.game.width - 120, this.game.height - 250, text, style1);
                text = "$100";
                this.game.add.text(this.game.width - 120, this.game.height - 230, text, style2);

                var text = "Cash available: $" + game.money;
                this.game.moneyText = this.game.add.text(this.game.width - 220, 50, text, { font: "14px Arial", fill: "#FFFFFF", align: "left" });

                text = "Score: " + game.score;
                this.game.scoreText = this.game.add.text(this.game.width - 220, 100, text, { font: "14px Arial", fill: "#FFFFFF", align: "left" });

                // Create one House
                this.addOneHouse();

                var freq = 4500;
                timers['monster'] = this.game.time.events.loop(freq, this.addOneMonster, this);

                this.game.fx = game.add.audio('sfx');
                this.game.fx.addMarker('ping', 10, 1.0);
                this.game.fx.addMarker('death', 12, 4.2);
                this.game.fx.addMarker('shot', 17, 1.0);

                gameover = false;
            },

            update: function () {
                var me = this;

                if (gameover == false) {
                    // Move the Monsters
                    monsters.forEach(function (monster) {
                        Monster.prototype.move(monster);
                    });

                    towers.forEach(function (tower) {
                        Tower.prototype.attack(tower, monsters);
                    });

                    // See if any monster has reach house
                    monsters.forEach(function (monster) {
                            var monsterX = monster.x;
                            var monsterY = monster.y;

                            if (monster.alive) {
                                houses.forEach(function (house) {
                                    var houseX = house.x;
                                    var houseY = house.y;

                                    if (Math.abs(monsterX - houseX) < 32 && Math.abs(monsterY - houseY) < 32) {
                                        var gameOverText = me.game.add.text(me.game.world.width / 2, me.game.world.height / 2, "Sorry, Game Over", { font: "50px Arial"});
                                        gameOverText.anchor.set(0.5);
                                        gameover = true;
                                    }
                                });
                            }
                        }
                    );
                }
            },

            // add a house at the mouse position or end of path
            addOneHouse: function (sprite, pointer) {
                var xTile, yTile;

                if (sprite != null) {
                    var x = sprite.x + this.game.tileSize / 2;
                    var y = sprite.y + this.game.tileSize / 2;

                    xTile = Math.round(x / this.game.tileSize);
                    yTile = Math.round(y / this.game.tileSize);
                }
                else {
                    var pathLength = this.game.tilePath.length;
                    xTile = this.game.tilePath[pathLength - 1].x;
                    yTile = this.game.tilePath[pathLength - 1].y;
                }
                var house = houses.getFirstDead();

                var cell1 = this.game.map.getTile(xTile, yTile, this.game.layer, true);
                var cell2 = this.game.map.getTile(xTile + 1, yTile, this.game.layer, true);
                var cell3 = this.game.map.getTile(xTile, yTile + 1, this.game.layer, true);
                var cell4 = this.game.map.getTile(xTile + 1, yTile + 1, this.game.layer, true);

                if (house === null &&
                    cell1 != null && cell1.index != 4 &&
                    cell2 != null && cell2.index != 4 &&
                    cell3 != null && cell3.index != 4 &&
                    cell4 != null && cell4.index != 4) {

                    house = new House(this.game, xTile, yTile, 1);
                    houses.add(house);

                    cell1.index = 4;
                    cell2.index = 4;
                    cell3.index = 4;
                    cell4.index = 4;
                }

                if (sprite != null) {
                    sprite.x = this.game.width - 200;
                    sprite.y = this.game.height - 150;
                }
            },

            // add a monster at the start of the path
            addOneMonster: function () {
                var monster = monsters.getFirstDead();

                if (monster === null) {
                    var tileX = this.game.tilePath[0].x;
                    var tileY = this.game.tilePath[0].y;

                    monster = new Monster(this.game, tileX, tileY, 30, 'monster', 1);
                    monsters.add(monster);
                }
            },

            // add a tower at the mouse position
            addOneTower: function (sprite, pointer) {
                var x = sprite.x + this.game.tileSize / 2;
                var y = sprite.y + this.game.tileSize / 2;

                var xTile = Math.round(x / this.game.tileSize);
                var yTile = Math.round(y / this.game.tileSize);

                var towerSprite = 'tower';
                var offsetX = 30;
                var offsetY = 20;
                var damage = 30;
                var range = 4;
                var fireRate = 2500;
                var health = 1000;
                var bulletSpeed = 75;
                var price = 300;
                var bulletSprite = 'bullet';

                var cell1 = this.game.map.getTile(xTile, yTile, this.game.layer, true);
                var cell2 = this.game.map.getTile(xTile + 1, yTile, this.game.layer, true);
                var cell3 = this.game.map.getTile(xTile, yTile + 1, this.game.layer, true);
                var cell4 = this.game.map.getTile(xTile + 1, yTile + 1, this.game.layer, true);

                if (this.game.money > 0 &&
                    cell1 != null && cell1.index != 4 &&
                    cell2 != null && cell2.index != 4 &&
                    cell3 != null && cell3.index != 4 &&
                    cell4 != null && cell4.index != 4) {

                    var newTower = new Tower(this.game, xTile, yTile, towerSprite, damage, range, fireRate, health, bulletSpeed, price, bulletSprite);
                    towers.add(newTower);

                    this.game.money -= 100;
                    this.game.moneyText.text = 'Cash available: $' + this.game.money;
                    cell1.index = 4;
                    cell2.index = 4;
                    cell3.index = 4;
                    cell4.index = 4;
                }

                sprite.x = this.game.width - 200;
                sprite.y = this.game.height - 250;
            },

            /**
             * Find the path from the tile with index 1 back to the starting point
             */
            calcPath: function (tilemap, layer) {
                var pathArray = [], yDetect, xDetect, oldTile;

                for (yDetect = 0; yDetect < tilemap.height; yDetect++) {
                    for (xDetect = 0; xDetect < tilemap.width; xDetect++) {
                        var tile = tilemap.getTile(xDetect, yDetect, layer, true);
                        if (tile.index === 1) { // starting point
                            pathArray.unshift({x: xDetect, y: yDetect});
                            break;
                        }
                    }

                    if (pathArray.length > 0) {
                        break;
                    }
                }

                // Step back one
                var tileToAdd = this.checkIndexAroundTile(tilemap, layer, 4, xDetect, yDetect, -50, -50);

                if (tileToAdd !== null) {
                    pathArray.unshift({x: tileToAdd.x, y: tileToAdd.y});
                    oldTile = pathArray[1];
                } else {
                    this.console.error("error1");
                    return null;
                }

                // Continue stepping back
                while (tileToAdd !== null) {
                    tileToAdd = this.checkIndexAroundTile(tilemap, layer, 4, tileToAdd.x, tileToAdd.y, oldTile.x, oldTile.y);
                    if (tileToAdd !== null) {
                        pathArray.unshift({x: tileToAdd.x, y: tileToAdd.y});
                        oldTile = pathArray[1];
                    } else {
                        return pathArray;
                    }
                }
            },

            /**
             * Locate a tile of the specified index that is adjacent to (tileX, tileY),
             * and is not at (previousX, previousY)
             */
            checkIndexAroundTile: function (tilemap, layer, desiredIndex, tileX, tileY, previousX, previousY) {
                var tile;

                tile = tilemap.getTile(tileX + 1, tileY, layer, true);
                if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX + 1) || (previousY !== tileY))) {
                    return tile;
                }

                tile = tilemap.getTile(tileX, tileY + 1, layer, true);
                if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX) || (previousY !== tileY + 1))) {
                    return tile;
                }

                tile = tilemap.getTile(tileX - 1, tileY, layer, true);
                if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX - 1) || (previousY !== tileY))) {
                    return tile;
                }

                tile = tilemap.getTile(tileX, tileY - 1, layer, true);
                if ((tile) && (tile.index === desiredIndex) && ((previousX !== tileX) || (previousY !== tileY - 1))) {
                    return tile;
                }

                return null;
            }
        };

        return Game;
    })
;
