class MainController {
  constructor(){
    this.counter = 0;
    //maybe implement a db here to control users instead of just having them into memory
    this.users = [
      {
        id: "007",
        balance: 100000
      },
      {
        id: "100",
        balance: 0
      }
    ]
  }

  getUserById(id) {
    return this.users.find(user => user.id === id);
  }

  addMoney(id, money) {
    let user = this.getUserById(id);
    if(!user) {
      user = this.createUser(id);
    }
    user.balance += parseInt(money);
  }

  createUser(id) {
    let user = {
      id: id,
      balance: Math.floor(Math.random() * 700)
    };
    this.users.push(user);
    return user;
  }

  removeMoney(id, money) {
    let user = this.getUserById(id);
    if(!user) {
      user = this.createUser(id);
    }
    if(user.balance < parseInt(money)) {
      return false;
    }
    console.log(user.balance, money);
    user.balance -= parseInt(money);
    console.log(user.balance, money);
    return true;
  }

  getBalanceById(id) {
    let user = this.getUserById(id);
    if(!user) {
      user = this.createUser(id);
    }
    return user.balance;
  }

  getBalanceRequest(req, res) {
    let query = req.query;
    return res.send(this.getBalanceById(query.id).toString());
  }

  payRequest(req, res) {
    let body = req.body;
    console.log("the body is", body, body.id, body.money);
    if(this.removeMoney(body.id, body.money)) {
      return res.send("Payment completed");
      //hacer el cafe
    } else {
      return res.status(400).send("not enough money");
    }
  }

  showHelloWorld (req, res) {
    return res.send('Now this is something' + this.counter++);
  }

  showHelloWorld2 (req, res) {
    return res.send('Hello World!2' + this.counter++);
  }


}

module.exports = new MainController();
