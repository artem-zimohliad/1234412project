const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connectionConfig = {
  host: "mysql",
  user: "root",
  password: "root",
  database: "user_data",
};

let connection;

function connectToDatabase(retries = 5) {
  connection = mysql.createConnection(connectionConfig);

  connection.connect((err) => {
    if (err) {
      console.error("Ошибка подключения к базе данных:", err);
      if (retries === 0) {
        console.error("Не удалось подключиться к базе данных после нескольких попыток.");
        process.exit(1);
      }
      console.log(`Повторная попытка подключения через 2 секунды... (${retries} попыток осталось)`);
      setTimeout(() => connectToDatabase(retries - 1), 2000);
    } else {
      console.log("Подключение к базе данных прошло успешно");
    }
  });
}

connectToDatabase();

// Добавить нового пользователя
app.post("/app/user", (req, res) => {
  const { user_key, username, password, email, phone } = req.body;

  if (!user_key || !username || !password || !email || !phone) {
    return res.status(400).json({ message: "Все поля обязательны" });
  }

  const query = "INSERT INTO users (user_key, username, password, email, phone) VALUES (?, ?, ?, ?, ?)";
  connection.query(query, [user_key, username, password, email, phone], (err, result) => {
    if (err) {
      console.error("Ошибка при добавлении пользователя:", err);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
    res.status(201).json({ message: "Пользователь успешно добавлен", userId: result.insertId });
  });
});

// Получить всех пользователей
app.get("/app/user", (req, res) => {
  const page = parseInt(req.query._page, 10) || 1; // Текущая страница
  const limit = parseInt(req.query._limit, 10) || 5; // Количество записей на странице
  const offset = (page - 1) * limit;

  const query = "SELECT * FROM users LIMIT ? OFFSET ?";
  connection.query(query, [limit, offset], (err, results) => {
    if (err) {
      console.error("Ошибка при получении пользователей:", err);
      return res.status(500).json({ message: "Ошибка сервера" });
    }

    // Считаем общее количество пользователей для подсчёта страниц
    connection.query("SELECT COUNT(*) as count FROM users", (countErr, countResults) => {
      if (countErr) {
        console.error("Ошибка при подсчёте пользователей:", countErr);
        return res.status(500).json({ message: "Ошибка сервера" });
      }

      const totalItems = countResults[0].count;
      res.json({ data: results, totalItems });
    });
  });
});


// Получить пользователя по ID
app.get("/app/user/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM users WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Ошибка при получении пользователя:", err);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json(results[0]);
  });
});

// Обновить данные пользователя
app.put("/app/user/:id", (req, res) => {
  const { id } = req.params;
  const { username, password, email, phone } = req.body;

  if (!username || !password || !email || !phone) {
    return res.status(400).json({ message: "Все поля обязательны: username, password, email, phone" });
  }

  const query = "UPDATE users SET username = ?, password = ?, email = ?, phone = ? WHERE id = ?";
  connection.query(query, [username, password, email, phone, id], (err, result) => {
    if (err) {
      console.error("Ошибка при обновлении пользователя:", err);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json({ message: "Данные пользователя успешно обновлены" });
  });
});

// Удалить пользователя
app.delete("/app/user/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM users WHERE id = ?";
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error("Ошибка при удалении пользователя:", err);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json({ message: "Пользователь успешно удалён" });
  });
});

app.listen(3000, () => {
  console.log("Сервер запущен на порту 3000");
});

