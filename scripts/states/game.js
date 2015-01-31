define(['extensions/Monster', 'extensions/House', 'extensions/Bullet', 'extensions/Tower', 'extensions/PausePanel'],
    function (Monster, House, Bullet, Tower, PausePanel) {
        'use strict';
        var game;

        var score = 0;
        var money = 1000;

        // Primary map display
        var mapSprite;

        // Groups
        var houses;
        var monsters;
        var towers;
        var bullets;

        var moneyText;
        var scoreText;
        var house;
        var tower;
        var map;
        var layer;
        var timers = {};

        function Game(_game) {
            game = _game;
        }

        Game.prototype = {
            create: function () {
                this.game.physics.startSystem(Phaser.Physics.ARCADE);

                map = this.game.add.tilemap('tileData');

                map.addTilesetImage('tileSet', 'tileSet');

                layer = map.createLayer('control');

                this.game.tilePath = this.calcPath(map, layer);
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
                house.input.enableSnap(32, 32, true, true);
                //house.events.onDragStop.add(this.onDragStop, this);
                text = "House";
                this.game.add.text(this.game.width - 120, this.game.height - 150, text, style1);
                text = "$50";
                this.game.add.text(this.game.width - 120, this.game.height - 120, text, style2);

                // Create tool for making Towers
                this.game.add.sprite(this.game.width - 200, this.game.height - 250, 'tower');
                tower = this.game.add.sprite(this.game.width - 200, this.game.height - 250, 'tower');
                tower.inputEnabled = true;
                tower.input.enableDrag();
                tower.input.enableSnap(32, 32, true, true);
                tower.events.onDragStop.add(this.addOneTower, this);
                text = "Tower";
                this.game.add.text(this.game.width - 120, this.game.height - 250, text, style1);
                text = "$100";
                this.game.add.text(this.game.width - 120, this.game.height - 230, text, style2);

                score = 0;
                money = 1000;

                var text = "Cash available $ " + money;
                moneyText = this.game.add.text(this.game.width - 220, 50, text, { font: "14px Arial", fill: "#FFFFFF", align: "left" });

                text = "Score " + score;
                scoreText = this.game.add.text(this.game.width - 220, 100, text, { font: "14px Arial", fill: "#FFFFFF", align: "left" });

                // Create one House
                this.addOneHouse();

                var freq = 4500;
                timers['monster'] = this.game.time.events.loop(freq, this.addOneMonster, this);
            },

            update: function () {
                // Move the Monsters
                monsters.forEach(function (monster) {
                    Monster.prototype.move(monster);
                });
            },

            // add a house at the end of the path
            addOneHouse: function () {
                var house = houses.getFirstDead();

                if (true || house === null) {
                    var pathLength = this.game.tilePath.length;
                    var tileX = this.game.tilePath[pathLength - 1].x;
                    var tileY = this.game.tilePath[pathLength - 1].y;

                    house = new House(this.game, tileX, tileY, 1);
                    houses.add(house);
                }
            },

            // add a monster at the start of the path
            addOneMonster: function () {
                var monster = monsters.getFirstDead();

                if (true || monster === null) {
                    var tileX = this.game.tilePath[0].x;
                    var tileY = this.game.tilePath[0].y;

                    monster = new Monster(this.game, tileX, tileY, 30, 'monster', 1);
                    monsters.add(monster);
                }
            },

            // add a tower at the mouse position
            addOneTower: function (sprite, pointer) {
                var x = pointer.x;
                var y = pointer.y;

                var sprite = 'tower';
                var offsetX = 30;
                var offsetY = 20;
                var damage = 300;
                var range = 4;
                var fireRate = 2500;
                var health = 1000;
                var bulletSpeed = 75;
                var price = 300;
                var bulletSprite = 'bullet';

                new Tower(x.worldX, y, offsetX, offsetY, sprite, damage, range, fireRate, health, bulletSpeed, price, bulletSprite);
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
    });
