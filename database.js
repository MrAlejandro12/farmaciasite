const { Pool } = require('pg');
require('dotenv').config(); // Asegura que las variables de entorno se carguen

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Necesario para conexiones seguras en Render
    }
});

module.exports = pool;


