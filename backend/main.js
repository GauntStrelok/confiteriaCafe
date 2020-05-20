const express = require('express')
const app = express()
const port = 3001
const cors = require('cors')
const Router = require('./router')
const bodyParser = require('body-parser')

let router = new Router();

//db
//const low = require('lowdb')
//const FileSync = require('lowdb/adapters/FileSync')
//const adapter = new FileSync('db/db.json')
//const db = low(adapter)

//app.get('/something', (req, res) => res.send('Hello World!'))
app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

//router
app.use(function (req, res, next) {
  router.navigate(req, res, next);
  //res.status(404).send("Sorry can't find that!")
});

//calls on next with an error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something broke:   ' + err.message);
  next(err);
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
