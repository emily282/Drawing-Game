//This is a template

class Words {
  constructor(typeOfWords) {
    if (typeOfWords === 'socks') {
      this.words = ['kneehigh', 'trainer', 'sockettes'];
    } else if (typeOfWords == 'animals') {
      this.words = ["cat", "dog", "zebra"];
    } else {
      this.words = null;
    }
  }
  
  getWordOffers() {
    return this.words;
  }
}

  
module.exports = Words;
  