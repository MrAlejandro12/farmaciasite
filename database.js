const { Pool } = require('pg');

// Conexión con la base de datos en Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Usa la variable de entorno de Render
  ssl: { rejectUnauthorized: false } // Necesario para conexiones seguras
});

// Crear la tabla si no existe
pool.query(`
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL
  );
`, (err) => {
  if (err) console.error("Error creando la tabla:", err);
});

module.exports = pool;

