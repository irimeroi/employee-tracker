const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const mysql = require('mysql2');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'company_db'
    },
    console.log('Connected to the company_db database')
);

// db.query('SELECT * FROM department', (err, results) => {
//     console.log(results)
// });

app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});