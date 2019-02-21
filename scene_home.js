import Phaser from "./libs/phaser.js" 

export default class HomeScene extends Phaser.Scene {

    constructor() {
        super();
        this.cursors;
        this.player;
        this.showDebug = false;
    }

    preload() {
        this.load.image("tiles", "assets/spritesheet_map.png");
        this.load.tilemapTiledJSON("map", "assets/map.json");
        this.load.atlas("atlas", "assets/atlas.png", "assets/atlas.json");
    }

    create() {

        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("spritesheet_map", "tiles");

        const belowLayer = map.createStaticLayer("lower", tileset, 0, 0);
        const worldLayer = map.createStaticLayer("main", tileset, 0, 0);
        const aboveLayer = map.createStaticLayer("top", tileset, 0, 0);

        worldLayer.setCollisionByProperty({ collides: true });
        aboveLayer.setDepth(10);

        const spawnPoint = map.findObject("Objects", obj => obj.name === "spawn");

        player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
            .setSize(8, 8)
            .setOffset(0, 48);

        this.physics.add.collider(player, worldLayer);

        const anims = this.anims;

        anims.create({
            key: "misa-left-walk",
            frames: anims.generateFrameNames("atlas", {
                prefix: "misa-left-walk.", start: 0, end: 3, zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "misa-right-walk",
            frames: anims.generateFrameNames("atlas", {
                prefix: "misa-right-walk.", start: 0, end: 3, zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "misa-front-walk",
            frames: anims.generateFrameNames("atlas", {
                prefix: "misa-front-walk.", start: 0, end: 3, zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "misa-back-walk",
            frames: anims.generateFrameNames("atlas", {
                prefix: "misa-back-walk.", start: 0, end: 3, zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        const camera = this.cameras.main;

        cursors = this.input.keyboard.createCursorKeys();

        camera.startFollow(player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.add.text(16, 16, "Arrows keys to move\nPress \"D\" to show hitboxes", {
            font: "18px monospace",
            fill: "#000000",
            padding: { x: 20, y: 10 },
            backgroundColor: "#ffffff"
        }).setScrollFactor(0).setDepth(30);

        this.input.keyboard.once("keydown_D", event => {
            
            this.physics.world.createDebugGraphic();
    
            var debugGraphics = null;
            if (showDebug) {
                debugGraphics = this.add.graphics().setAlpha(0.75).setDepth(20);

                
            } else {
                debugGraphics = this.add.graphics().setAlpha(0).setDepth(20);
            }

            worldLayer.renderDebug(debugGraphics, {
                tileColor: null,
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
                faceColor: new Phaser.Display.Color(40, 39, 37, 255)
            });
        });

    }

    update(time, delta) {
        const speed = 175;
        const prevVelocity = player.body.velocity.clone();

        // player.anims.play("misa-front-walk", true);
        player.body.setVelocity(0);

        if (cursors.left.isDown) {
            player.body.setVelocityX(-speed);
            player.anims.play("misa-left-walk", true);
        } else if (cursors.right.isDown) {
            player.body.setVelocityX(speed);
            player.anims.play("misa-right-walk", true);
        } else if (cursors.up.isDown) {
            player.body.setVelocityY(-speed);
            player.anims.play("misa-back-walk", true);
        } else if (cursors.down.isDown) {
            player.body.setVelocityY(speed);
            player.anims.play("misa-front-walk", true);
        } else {
            player.anims.stop();

            if (prevVelocity.x < 0) {
                player.setTexture("atlas", "misa-left");
            } else if (prevVelocity.x > 0) {
                player.setTexture("atlas", "misa-right");
            } else if (prevVelocity.y < 0) {
                player.setTexture("atlas", "misa-back");
            } else if (prevVelocity.y > 0) {
                player.setTexture("atlas", "misa-front");
            }
        }

        player.body.velocity.normalize().scale(speed);


    }
}