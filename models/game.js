User = require('./users');

class GameSession {
  constructor() {
    this.users = {};
  }

  addUser(name, socketId) {
    this.users[socketId] = new User(name, socketId);
  }

  removeUser(socketId) {
    delete this.users[socketId];
  }
}

module.exports = GameSession;
