const connectionString = {
  host: 'localhost', 
  port: 5432,
  database: 'asistencia',
  user: 'postgres',
  password: 't2ysfu5exzxw'
};

const pg = require('pg-promise')();
const db = pg(connectionString);      

module.exports = {db}