import styles from '../assets/style.scss'
import { socket, canvas, ctx, game_width, game_height } from './constants';

class Game {
  constructor(){    
    this.lastTime = Date.now();

    canvas.width = game_width;
    canvas.height = game_height;
  }

  init(){
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, game_width, game_height);

    this.ball = new Ball();

    this.update();
  }
  update(){

    let now = Date.now();

    var dt = now - this.lastTime;
    this.lastTime = now;

    this.ball.update(dt);

    this.draw();
    
    requestAnimationFrame(this.update.bind(this));

  }

  draw(){
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.ball.draw();
  }


}

class Ball {
  constructor(){
    this.size = 25;
    this.x = game_width/2 - this.size/2;
    this.y = game_height/2 - this.size/2;
    this.vx = .2;
    this.vy = .2;

    this.xDir = 1;
    this.yDir = 1;
  }  

  update(dt){

    var dx = dt * this.vx;
    var dy = dt * this.vy;

    if (this.x + dx + this.size > game_width || this.x + dx < 0){
      this.xDir *= -1;
    }
    
    if (this.y + dy + this.size > game_height || this.y + dy < 0){
      this.yDir *= -1;
    }
    
    this.x += dx * this.xDir;
    this.y += dy * this.yDir;

    this.draw();
  }

  draw(){

    ctx.fillStyle = '#fff';
    ctx.fillRect(this.x, this.y, this.size, this.size);

  }
}

var game = new Game();
game.init()