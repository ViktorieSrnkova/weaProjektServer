import mysql from "mysql";
import env from "../src/services/env.js";
env();

const conn = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_SERVER,
});

conn.connect(function (err) {
  if (err) throw err;
  console.log("database connected");
});

export default conn;
