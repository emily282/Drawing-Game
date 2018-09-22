User = require('./users');

class GameSession {
  constructor() {
    this.users = {};

    this.timePerTurn = 10000;
    this.numberOfRounds = 3;
    this.currentRound = 0;

    this.activeUser = null;
    this.usersPlayed = [];
    this.word = null;
  }

  addUser(name, socketId) {
    this.users[socketId] = new User(name, socketId);
  }

  removeUser(socketId) {
    delete this.users[socketId];
  }

  getNextActiveUser() {
    return null;
  }

  startGame() {
    this.activeUser = this.getNextActiveUser();
    this.startRound();
  }

  endGame() {
    // Reset things
    this.currentRound = 0;
  }

  startRound() {
    // Reset the list of users who have played
    this.usersPlayed = [];
    this.currentRound += 1;
    startTurn(this.activeUser);
  }

  startTurn(userId) {
    this.offerWords(userId);
    // Detect when user selects a word
    // randomly select if they don't choose
    // Display word length to everyone else
    // Enable drawing pad for CAU
    setTimeout(endTurn, this.timePerTurn);
  }

  offerWords(userId) {
    return null;
  }

  endTurn() {
    //CAU can no longer draw
    //Points allocated to CAU
    //Scoreboard to show
    //Perm scoreboard should update

    //New CAU assigned
    this.activeUser = this.getNextActiveUser();
    if (this.activeUser !== null) {
      startTurn(this.activeUser);
    } else if (this.currentRound < this.numberOfRounds) {
      startRound();
    } else {
      endGame();
    }
  }
}

module.exports = GameSession;
