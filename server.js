
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

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено: http://localhost:${PORT}`);
});
