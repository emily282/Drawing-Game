class User {
  constructor(name, socketId) {
    this.name = name;
    this.id = socketId;
    this.score = 0;
  }
}

module.exports = User;
