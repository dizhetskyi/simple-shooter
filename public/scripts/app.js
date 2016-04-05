var app = angular.module('simple-shooter', []);

app.service('socket', socket);
function socket(){
  return io.connect('http://localhost:1337');
}

app.controller('main', ['socket', main]);
function main(socket){

  var vm = this;
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');

  socket.on('init', function(){
    console.log('socket init')
  })

  var size = 10;
  var x = canvas.width - size/2;
  var y = canvas.height - size/2;
  var vx = .25;
  var vy = .25;
  var lastTime = Date.now();
  var delta = 0;
  var xDir = yDir = 1;

  canvas.width = 600;
  canvas.height = 480;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var frame;

  function update(){

    var now = Date.now();
    dt = now - lastTime;
    lastTime = now;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, size, size);

    var dx = dt * vx;
    var dy = dt * vy;

    if (x + dx + size > 600 || x + dx < 0){
      xDir *= -1;
    }
    
    if (y + dy + size > 480 || y + dy < 0){
      yDir *= -1;
    }
    
    x += dx * xDir;
    y += dy * yDir;
    
    frame = requestAnimationFrame(update);
  }

  update();

}