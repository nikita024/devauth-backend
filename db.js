import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: process.env.DB_PASSWORD,
  database: 'userauth'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL');
});

export default db