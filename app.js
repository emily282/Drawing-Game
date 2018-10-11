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
    // Run some startup logic to get game state

    socket.on('add user', function(data){
      gameSession.addUser(data.username, socket.id);
    });

    socket.on('chat message', function(data){
      io.emit('chat message', data);
      console.log('message: ' + data.message);
    });
  
    socket.on('drawing', function(data) {
      socket.broadcast.emit('drawing', data);
    });

    socket.on('start game', function(data) {
      gameSession.startGame();
      // TODO: Make this more futureproof
      io.emit('start game', gameSession.activeUser);
    });

    //TODO: Should add messages for start rounds/turns so CAU updates
  
    socket.on('disconnect', function() {
      //TODO: Check user exists
      console.log('user disconnected');
      gameSession.removeUser(socket.id);
    });
  });
}

module.exports = {app: app, setupSocketListeners: setupSocketListeners}