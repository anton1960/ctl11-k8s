const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
pgClient.on('error', () => console.log('Lost PG connection'));
console.log(pgClient)
pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(err => console.log(err)); 
  console.log("Tabelle erstellt")

  pgClient
  .query('CREATE TABLE IF NOT EXISTS werte (number INT)')
  .catch(err => console.log(err));
  console.log("Tabelle erstellt")
  // pgClient.query('INSERT INTO werte (number) VALUES("999")');

// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/values/all', async (req, res) => {
  console.log("values/all request")
  const values = await pgClient.query('SELECT number from werte');
  console.log("values/all reques done")
  console.log(values.rows)
  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }
  console.log("index " + index)
  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  console.log('insert $1')
  pgClient.query('INSERT INTO werte(number) VALUES('+ index + ')', [index]);
  pgClient.query('INSERT INTO werte(number) VALUES('+ index + ')');
  console.log(' insert done')
  res.send({ working: true });
});

app.listen(5000, err => {
  console.log('Listening');
});
