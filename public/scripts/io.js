angular.module('simple-shooter')

.service('io', io);

function io(){
  return io.connect('http://localhost:1337');
}