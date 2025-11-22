// backend/server.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./inventory.db');

// DB init
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    unit TEXT, category TEXT, brand TEXT,
    stock INTEGER NOT NULL, status TEXT, image TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS inventory_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    oldStock INTEGER, newStock INTEGER,
    changedBy TEXT,
    timestamp TEXT,
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);
});

const upload = multer({ dest: 'uploads/' });

/**------------------ API IMPLEMENTATIONS ------------------------**/

// GET: All products
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products", (err, rows) =>
    err ? res.status(500).json({ error: 'DB error' }) : res.json(rows)
  );
});

// Search products by name (case-insensitive, partial)
app.get('/api/products/search', (req, res) => {
  const { name } = req.query;
  db.all(
    "SELECT * FROM products WHERE LOWER(name) LIKE ?",
    [`%${name.toLowerCase()}%`],
    (err, rows) =>
      err ? res.status(500).json({ error: 'DB error' }) : res.json(rows)
  );
});

// Update product (+ inventory history)
app.put(
  '/api/products/:id',
  [
    body('name').notEmpty(),
    body('stock').isInt({ min: 0 }),
    body('unit').notEmpty(),
    body('category').notEmpty(),
    body('brand').notEmpty(),
    body('status').notEmpty(),
  ],
  (req, res) => {
    const id = req.params.id;
    const { name, unit, category, brand, stock, status, image, changedBy } = req.body;

    // Validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // Check if name is unique (except current)
    db.get(
      'SELECT id FROM products WHERE LOWER(name) = ? AND id != ?',
      [name.toLowerCase(), id],
      (err, row) => {
        if (row) return res.status(400).json({ error: 'Name must be unique' });

        // Get old stock
        db.get('SELECT stock FROM products WHERE id = ?', [id], (err, prod) => {
          if (!prod) return res.status(404).json({ error: 'Product not found' });

          db.run(
            `UPDATE products SET name=?, unit=?, category=?, brand=?, stock=?, status=?, image=? WHERE id=?`,
            [name, unit, category, brand, stock, status, image || '', id],
            function (err) {
              if (err) return res.status(500).json({ error: 'Update failed' });

              // Inventory logs
              if (prod.stock !== stock) {
                db.run(
                  `INSERT INTO inventory_logs (product_id, oldStock, newStock, changedBy, timestamp)
                   VALUES (?, ?, ?, ?, ?)`,
                  [id, prod.stock, stock, changedBy || 'admin', new Date().toISOString()]
                );
              }
              db.get('SELECT * FROM products WHERE id=?', [id], (err, updated) =>
                res.json(updated)
              );
            }
          );
        });
      }
    );
  }
);

// Import products from CSV
app.post('/api/products/import', upload.single('csvFile'), (req, res) => {
  const results = [];
  let added = 0, skipped = 0;
  let duplicates = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      let c = 0;
      results.forEach((product) => {
        db.get(
          'SELECT id FROM products WHERE LOWER(name) = ?',
          [product.name.toLowerCase()],
          (err, row) => {
            if (row) {
              skipped++;
              duplicates.push({ name: product.name, existingId: row.id });
            } else {
              db.run(
                `INSERT INTO products (name, unit, category, brand, stock, status, image)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                  product.name,
                  product.unit,
                  product.category,
                  product.brand,
                  parseInt(product.stock),
                  product.status,
                  product.image || '',
                ],
                (err) => {
                  added++;
                }
              );
            }
            c++;
            if (c === results.length) {
              fs.unlinkSync(req.file.path); // cleanup
              res.json({ added, skipped, duplicates });
            }
          }
        );
      });
    });
});

// Export products to CSV
app.get('/api/products/export', (req, res) => {
  db.all("SELECT * FROM products", (err, rows) => {
    if (err) return res.status(500).json({ error: 'Export failed' });
    // Format as CSV
    const headers = "name,unit,category,brand,stock,status,image\n";
    const csvData =
      headers +
      rows.map((p) =>
        [p.name, p.unit, p.category, p.brand, p.stock, p.status, p.image].map(val => `"${val}"`).join(',')
      ).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
    res.status(200).send(csvData);
  });
});

// Product inventory history
app.get('/api/products/:id/history', (req, res) => {
  db.all(
    'SELECT * FROM inventory_logs WHERE product_id = ? ORDER BY timestamp DESC',
    [req.params.id],
    (err, rows) => err ? res.status(500).json({ error: 'DB error' }) : res.json(rows)
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
