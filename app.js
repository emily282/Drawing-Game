const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

const GameSession = require('./models/game');
const gameSession = new GameSession();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

function setupSocketListeners(io) {
  //TODO: Name these functions
  io.on('connection', function(socket) {
    //TODO: Update name to not be null

    socket.on('add user', function(data){
      gameSession.addUser(data.username, socket.id);
    });


    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
      console.log('message: ' + msg);
    });
  
    socket.on('drawing', function(data) {
      socket.broadcast.emit('drawing', data);
    });
  
    socket.on('disconnect', function() {
      //TODO: Check user exists
      console.log('user disconnected');
      gameSession.removeUser(socket.id);
    });
  });
}

module.exports = {app: app, setupSocketListeners: setupSocketListeners}