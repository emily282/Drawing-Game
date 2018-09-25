User = require('./users');
Words = require('./words');

class GameSession {
  constructor() {
    this.users = {};

    this.timePerTurn = 10000;
    this.numberOfRounds = 3;
    this.currentRound = 0;

    this.activeUser = null;
    this.usersPlayed = [];
    this.word = null;
    this.words = null;
  }

  addUser(name, socketId) {
    this.users[socketId] = new User(name, socketId);
  }

  removeUser(socketId) {
    delete this.users[socketId];
  }

  getNextActiveUser() {
    for (var user in this.users){
      if (this.users.hasOwnProperty(user) && !this.usersPlayed.includes(user)) {
        return user;
      }
    }
    return null;
  }

  startGame() {
    this.words = new Words('socks');
    this.startRound();
  }

  startRound() {
    // Reset the list of users who have played
    this.usersPlayed = [];
    this.activeUser = this.getNextActiveUser();
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
    // Get the words from the word dictionary
    // Send the possible words to the active user
    let words = this.words.getWordOffers();
  }

  endTurn() {
    //CAU can no longer draw
    //Points allocated to CAU
    //Scoreboard to show
    //Perm scoreboard should update

    //New CAU assigned
    this.usersPlayed.push(this.activeUser);
    this.activeUser = this.getNextActiveUser();
    if (this.activeUser !== null) {
      startTurn(this.activeUser);
    } else if (this.currentRound < this.numberOfRounds) {
      startRound();
    } else {
      endGame();
    }
  }

  endGame() {
    // Reset things
    this.currentRound = 0;
  }
}

module.exports = GameSession;
