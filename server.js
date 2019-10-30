const express = require('express');
const helmet = require('helmet');
const bodyParser = express.json();

const server = express();
const router = require('./users/userRouter');

server.use(bodyParser);
server.use(helmet());
server.use(logger);

server.use('/api/users', router);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  next();
};

module.exports = server;
