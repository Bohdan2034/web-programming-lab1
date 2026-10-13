
const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

// Підключення до SQLite
const db = new Database('items.db');

// Створення таблиці
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`);

// Додаємо початкові дані, якщо таблиця порожня
const count = db.prepare('SELECT COUNT(*) AS total FROM items').get();

if (count.total === 0) {
    const insert = db.prepare('INSERT INTO items (name) VALUES (?)');

    insert.run('Перший елемент');
    insert.run('Другий елемент');
    insert.run('Третій елемент');
}

// Віддаємо HTML-клієнт
app.use(express.static(path.join(__dirname, 'public')));

// API: отримання всіх елементів
app.get('/items', (req, res) => {
    const items = db.prepare('SELECT id, name FROM items').all();
    res.json(items);
});

// API: отримання одного елемента за ID
app.get('/items/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'ID повинен бути додатним цілим числом'
        });
    }

    const item = db.prepare(
        'SELECT id, name FROM items WHERE id = ?'
    ).get(id);

    if (!item) {
        return res.status(404).json({
            error: 'Елемент не знайдено'
        });
    }

    res.json(item);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено: http://localhost:${PORT}`);
});
