//const TextController = require("./controllers/textController")
let textController = require("./controllers/textController");

const routes = {
  '/something2' : {
    'GET': textController.showHelloWorld2.bind(textController)
  },
  '/something' : {
    'GET': textController.showHelloWorld.bind(textController)
  }
}


class Router {
  navigate (req, res, next) {
    let url = req.url.split('?')[0];
    let functionToCall = routes && routes[url] && routes[url][req.method];
    //console.log(req.url, req.method, routes[req.url], functionToCall);
    if(functionToCall) {
      functionToCall(req, res, next);
    } else {
      console.log("route not found:", url, req.method)
      next(new Error("Route not found"));
    }
  }
}

module.exports = Router
