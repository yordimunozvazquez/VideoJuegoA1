/*Author: Yordi Muñoz Vazquez*/
/*Subject: Internet Programming - CUCEI / UdeG*/
/*Work 02: Videogame in JavaScript (Videojuego en JavaScript)*/
/*WARNING: This code contains Personal Information, unauthorized use is prohibited.*/

/*Code of Videogame: BreakOut*/

var config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 1200,
  heigth: 600,
  scale: {
    autoCenter: Phaser.Scale.CENTRER_BOTH
  },
  scene: {
    preload,
    create,
    update,
  },
  physics: {
    default: 'arcade',
    arcade: {
    },
  }
};

const game = new Phaser.Game(config);
let gameStarted = false;
let bar;
let ball;
let bricks;
let grayBlocks
let gray2Blocks;
let cyanBlocks;
let bluenavyBlocks;
let lives = 3;
let livesText;
let backgroundMusic;


function preload ()
{
    this.load.image('wallpaper', 'assets/wallpaper.png');
    this.load.image('bar', 'assets/bar.png');
    this.load.image('block01', 'assets/block01.png');
    this.load.image('block02', 'assets/block02.png');
    this.load.image('block03', 'assets/block03.png');
    this.load.image('ball', 'assets/ball.png');

    this.load.audio('background_music', 'assets/music/backsound_music.mp3');

}

function create ()
{
    this.physics.world.setBoundsCollision(true, true, true, false);

    this.add.image(600, 400, 'wallpaper');
    backgroundMusic = this.sound.add('background_music', {
        volume: 0.15,
        loop: true
    });

    backgroundMusic.play();

    livesText = this.add.text(10, 10, '', {
        fontSize: '40px',
        fill: '#FFFF'
    }).setDepth(0.1);
    livesInScreen();

    grayBlocks = this.physics.add.group({
        key: 'block01',
        repeat: 15,
        immovable: true,
        setScale: { x: 1.3, y: 1.3},
        setXY: {
        x: 80,
        y: 400,
        stepX: 70
        }
    });

    cyanBlocks = this.physics.add.group({
        key: 'block02',
        repeat: 15,
        immovable: true,
        setScale: { x: 1.3, y: 1.3},
        setXY: {
        x: 80,
        y: 350,
        stepX: 70
        }
    });

    bluenavyBlocks = this.physics.add.group({
        key: 'block03',
        repeat: 15,
        immovable: true,
        setScale: { x: 1.3, y: 1.3},
        setXY: {
        x: 80,
        y: 300,
        stepX: 70
        }
    });

    gray2Blocks = this.physics.add.group({
        key: 'block01',
        repeat: 15,
        immovable: true,
        setScale: { x: 1.3, y: 1.3},
        setXY: {
        x: 80,
        y: 250,
        stepX: 70
        }
    });

    ball = this.physics.add.image(800, 1360, 'ball').setCollideWorldBounds(true).setBounce(1);
    ball.setData('onPaddle', true);

    bar = this.physics.add.image(400, 700, 'bar').setImmovable();
    bar.setScale(1.9);

    this.physics.add.collider(ball, grayBlocks, hitBrick, null, this);
    this.physics.add.collider(ball, cyanBlocks, hitBrick, null, this);
    this.physics.add.collider(ball, bluenavyBlocks, hitBrick, null, this);
    this.physics.add.collider(ball, gray2Blocks, hitBrick, null, this);

    this.physics.add.collider(ball, bar, hitBar, null, this);


    this.input.on('pointermove', function (pointer) {
        bar.x = Phaser.Math.Clamp(pointer.x, 52, 1148);

        if (ball.getData('onPaddle'))
        {
            ball.x = bar.x;
        }

    }, this);

    this.input.on('pointerup', function (pointer) {
        if (ball.getData('onPaddle'))
        {
            ball.setVelocity(-75, -300);
            ball.setData('onPaddle', false);
        }

    }, this);
}

function update ()
{
    if(lives === 0){
        backgroundMusic.stop();
        this.input.on('pointerdown', function (pointer) {
        }, this);
        resetLevel();
    }
    this.input.on('pointermove', function (pointer) {
        bar.x = Phaser.Math.Clamp(pointer.x, 52, 1148);

        if (ball.getData('onPaddle'))
        {
            ball.x = bar.x;
        }

    }, this);

    this.input.on('pointerup', function (pointer) {
        if (ball.getData('onPaddle'))
        {
            ball.setVelocity(-75, -300);
            ball.setData('onPaddle', false);
        }

    }, this);
}

function update ()
{
    if(lives === 0){
        this.input.on('pointerdown', function (pointer) {
        }, this);
        resetLevel();
    }
    if (isGameOver(this.physics.world))
        {
            ball.setVelocity(0);
            ball.setPosition(bar.x, 675);
            ball.setData('onPaddle', true);
            lives--;
            livesInScreen();
        }
    else if (isWon()){
        this.input.on('pointerdown', function (pointer) {
        }, this);
        resetLevel();
    }
}

function livesInScreen()
{
    livesText.setText('Lives: ' + lives);
}


function hitBrick(ball, brick) {
    brick.disableBody(true, true);

    if (ball.body.velocity.x == 0) {
        randNum = Math.random();
        if (randNum >= 0.5) {
            ball.body.setVelocityX(150);
        } else {
            ball.body.setVelocityX(-150);
        }
    }
}


function resetLevel()
{
    lives = 3;
    livesInScreen();
    ball.setVelocity(0);
    ball.setPosition(bar.x, 675);
    ball.setData('onPaddle', true);

    grayBlocks.children.each(function (brick) {
        brick.enableBody(false, 0, 0, true, true);
    });

    cyanBlocks.children.each(function (brick) {
        brick.enableBody(false, 0, 0, true, true);
    });

    bluenavyBlocks.children.each(function (brick) {
        brick.enableBody(false, 0, 0, true, true);
    });

    gray2Blocks.children.each(function (brick) {
        brick.enableBody(false, 0, 0, true, true);
    });

}

function hitBar(ball, bar)
{
    var diff = 0;
    if (ball.x < bar.x)
    {   
        diff = bar.x - ball.x;
        ball.setVelocityX(-10 * diff);
    }
    else if (ball.x > bar.x)
    {
        diff = ball.x -bar.x;
        ball.setVelocityX(10 * diff);
    }
    else
    {
        ball.setVelocityX(2 + Math.random() * 8);
    }
}

function isGameOver(world) {
  return ball.body.y > 1200;
}

function isWon() {
  return grayBlocks.countActive() + gray2Blocks.countActive() + cyanBlocks.countActive() + bluenavyBlocks.countActive() === 0;
}