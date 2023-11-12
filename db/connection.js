const mysql = require('mysql2');

// connects to dabase
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'company_db'
    },
    console.log('Connected to the company_db database')
);

db.on('error', (err) => {
    console.log('There was a problem with your connection:', err)
});

module.exports = db;