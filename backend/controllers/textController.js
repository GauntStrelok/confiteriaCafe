class TextController {
  constructor(){
    this.counter = 0;
  }
  showHelloWorld (req, res) {
    return res.send('Now this is something' + this.counter++);
  }

  showHelloWorld2 (req, res) {
    return res.send('Hello World!2' + this.counter++);
  }
}

module.exports = new TextController();
