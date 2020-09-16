
// Express App Setup
const port = 3010
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get('/ctl', (req, res) => {
  console.log("hier bin ich")
  res.send('Hi clt server');
});

app.get('/', (req, res) => {
  res.send('Hi clt root server');
});

app.get('/all', (req, res) => {
  res.send('Hi all server');
});

app.listen(port, err => {
  console.log('Listening port ' + port);
});
