require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT_NUMBER = 5000;

const cors = require('cors');

app.use(cors());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    password: process.env.DB_PASS,
    port: process.env.PORT,
  });

app.get("/", async (req, res) => {
    // res.send("Server is running.");
    try{
        const result = await pool.query('SELECT * FROM container;');
        res.json({ title: 'Hello from server', body: result.rows });
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


// template get api request
// app.get("/api/data", async (req,res) => {
//     try{
//         const result = await pool.query('SELECT * FROM container;');
//         res.json({ title: 'Hello from server', body: result.rows });
//     }catch(err){
//         console.error(err.message);
//         res.status(500).send("Server error");
//     }
// });

app.listen(PORT_NUMBER, console.log(`Server started on PORT ${PORT_NUMBER}`));