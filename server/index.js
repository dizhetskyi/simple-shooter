const express = require('express');
const path = require('path');

const app = express();
const port = 1337;
const server = app.listen(port, () => {
  console.log('listening at http://localhost:%s', port);
})
const io = require('socket.io')(server);

io.on('connection', function(socket){

  socket.emit('init')

})

app.use('/libs', express.static(path.resolve(__dirname + '/../node_modules/')));

app.use(express.static(path.resolve(__dirname + '/../public/')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../public/index.hmtl'))
})