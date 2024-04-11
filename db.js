import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'Nikita@1234',
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