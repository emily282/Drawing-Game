const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

function setupSocketListeners(io) {
  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
      console.log('message: ' + msg);
    });
  
    socket.on('drawing', function(data){
      socket.broadcast.emit('drawing', data);
    });
  
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });
}

module.exports = {app: app, setupSocketListeners: setupSocketListeners}