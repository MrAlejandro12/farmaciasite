const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./database'); // Ahora importa PostgreSQL

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('public'));

// Agregar un producto
app.post('/add-product', async (req, res) => {
    const { name, description, image } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO products (name, description, image) VALUES ($1, $2, $3) RETURNING *",
            [name, description, image]
        );
        res.json({ message: 'Producto añadido', product: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener productos
app.get('/products', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM products");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar producto
app.delete('/delete-product/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await pool.query("DELETE FROM products WHERE id = $1", [id]);
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
