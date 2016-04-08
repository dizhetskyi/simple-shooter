import styles from '../assets/style.scss'
import { socket, canvas, ctx, game_width, game_height } from './constants';

class Game {
  constructor({ball, player, enemy = false}){

    this.ball = ball;
    this.player = player;

    if (enemy !== false && !(enemy instanceof Player)){
      console.log('Error. Enemy must be a player');
      this.enemy = false;
    } else {
      this.enemy = enemy;
    }    

    canvas.width = game_width;
    canvas.height = game_height;

    this.reset();
  }

  init(){
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, game_width, game_height);

    this.resume();
  }
  reset(){
    this.lastTime = Date.now();

    this.ball.reset();
    this.player.reset();
    if (this.enemy !== false) this.enemy.reset();
  }
  update(){

    let now = Date.now();

    var dt = now - this.lastTime;
    this.lastTime = now;

    this.ball.update(dt);
    this.player.update(dt);
    if (this.enemy !== false) this.enemy.update(dt);

    this.draw();
    
    if (this.active) requestAnimationFrame(this.update.bind(this));

  }

  draw(){
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.ball.draw();
    this.player.draw();
    if (this.enemy !== false) this.enemy.draw();
  }

  stop(){
    this.active = false;    
  }

  resume(){
    this.active = true;
    this.update();
  }

}

class Ball {
  constructor(){
    this.size = 10;

    this.baseSpeed = .3;

    var { x, y } = this.calculateVelocity(45);

    this.vx = this.baseSpeed * x;
    this.vy = this.baseSpeed * y;

    this.reset();
  }  

  reset(){
    this.x = game_width/2 - this.size/2;
    this.y = game_height/2 - this.size/2;

    this.xDir = 1;
    this.yDir = 1;
  }

  update(dt){

    var dx = dt * this.vx;
    var dy = dt * this.vy;

    this.x += dx * this.xDir;
    this.y += dy * this.yDir;

    if (this.x + this.size > game_width){
      this.x = game_width - this.size
      this.xDir *= -1;
    }

    if (this.x < 0){
      this.x = 0
      this.xDir *= -1;
    }

    if (this.y + this.size >= game.player.y){
      if (!this.playerLoosing && this.hitsPlayer(game.player)){
        this.changeAngleOnBounce(game.player);
      } else {
        this.playerLoosing = true;
      }
    } else {
      this.playerLoosing = false;
    }
    
    


    if (this.y + this.size > game_height){

      this.y = game_height - this.size;

      game.stop();

      setTimeout(function(){
        game.reset();
        game.resume();
      }, 2000)

    }

    // if enemy exists

    if (game.enemy !== false){

      if (this.y < 0){

        this.y = 0;

        game.stop();

        setTimeout(function(){
          game.reset();
          game.resume();
        }, 2000)

      }

      if (this.y <= game.enemy.y + game.enemy.height){
        if (!this.enemyLoosing && this.hitsEnemy(game.enemy)){
          this.changeAngleOnBounce(game.enemy);
        } else {
          this.enemyLoosing = true;
        }
      } else {
        this.enemyLoosing = false;
      }

    } else {

      if (this.y < 0){
        this.y = 0;
        this.yDir *= -1;
      }

    }

  }

  draw(){

    ctx.fillStyle = '#fff';
    ctx.fillRect(this.x, this.y, this.size, this.size);

  }

  hitsPlayer(p){
    return (this.x + this.size > p.x &&
            this.x < p.x + p.width) &&
            this.y + this.size >= p.y;
  }

  hitsEnemy(p){
    return (this.x + this.size > p.x &&
            this.x < p.x + p.width) &&
            this.y  <= p.y + p.height;
  }

  calculateVelocity(angle){
    var x = Math.cos(angle / 180 * Math.PI)
    var y = Math.sqrt(1 - x);

    return { x, y }
  }

  changeAngleOnBounce(player){
    var playerCenter = player.x + player.width / 2;
    var ballCenter = this.x + this.size /2;

    var deg = 45 * (ballCenter - playerCenter) / (player.width / 2);
    var { x, y } = this.calculateVelocity(90 - Math.abs(deg));
    
    this.vx = this.baseSpeed * x;
    this.vy = this.baseSpeed * y;

    this.xDir = deg > 0 ? 1 : -1;
    this.yDir *= -1;
  }
}

class Player {
  constructor({startY, controlKeys}){
    this.width = 100;
    this.height = 10

    this.controlKeys = controlKeys;

    this.startY = startY;

    this.vx = 0.5;

    this.reset();
  }

  reset(){
    this.x = game_width / 2 - this.width / 2;
    this.y = this.startY;
  }

  update(dt){

    if (keyboard.isPressed(this.controlKeys.right)) {
      this.x += dt * this.vx;
    }
    if (keyboard.isPressed(this.controlKeys.left)) {
      this.x -= dt * this.vx;
    }

    if (this.x < 0) this.x = 0;

    if (this.x > game_width - this.width) this.x = game_width - this.width;
    
  }

  draw(){
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Keyboard {

  constructor(){

    this.pressed = {};

    addEventListener('keydown', e => {
      this.pressed[e.keyCode] = true;
    })

    addEventListener('keyup', e => {
      this.pressed[e.keyCode] = false;
    })
  }

  isPressed(code){
    return this.pressed[code] === true;
  }
}

Keyboard.keys = {
  left: 37,
  right: 39
}

const keyboard = new Keyboard();

const player = new Player({
  startY: game_height - 20,
  controlKeys: {
    left: 37,
    right: 39
  }
});

const enemy = new Player({
  startY: 10,
  controlKeys: {
    left: 65,
    right: 68
  }
});

const game = new Game({
  ball: new Ball(),
  player: player,
  enemy: enemy
});

game.init()