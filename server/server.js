const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

const port = 3001;

app.use(cors())
app.use(bodyParser.json());


const db = new sqlite3.Database('./database.db', err => {
  if(err){
    console.error(err);
  }
  console.log(`БД подключена!`);
})


app.post('/register', (req, res) => {
  const {login, password} = req.body;

  db.get(`select * from users where login = ?`, [login], (err, row) => {
    if(err){
      return res.status(500).json({ error: err.message})
    }

    if(row){
       return res.status(400).json({ error: 'Пользователь с таким логином уже существует!'})
    }

    db.run(`insert into users (login, password) values (?, ?)`, [login, password], 
    function(err){
      if(err){
        return res.status(400).json({error: err.message})
      }
      res.status(201).json({message: 'Пользователь зарегистрирован'})
    })
  })
})


app.post('/login', (req, res) => {
  const {login, password} = req.body;

  db.get(`select * from users where login = ?`, [login], (err, user) => {
    if(err || !user){
      return res.status(401).json({message: 'Неверный логин'})
    }
    if(user.password !== password){
      return res.status(401).json({message: 'Неверный пароль'});
    }
    const userId = user.id
    const token = jwt.sign({userId: user.id, login: user.login}, 'secret', {expiresIn: '1h'})
    res.json({token, login, userId})
  })
})

app.post('/create', (req, res) => {
  const {title, description, date} = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if(!token){
    return res.status(401).json({message: 'Необходима авторизация'})
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if(err){
      return res.status(401).json({message: 'Неверный токен'})
    }
    const id_user = decoded.userId;

    db.get(`select login from users where id = ?`, [id_user], (err, user) => {
      if(err || !user){
        return res.status(404).json({message: 'Пользователь не найден'})
      }
      const {login} = user;
      const status = 'Новое';

      db.run(`insert into orders (title, description, date, name, status) values (?, ?, ?, ?, ?)`,
      [title, description, date, login, status],
      function(err){
        if(err){
          return res.status(400).json({error: err.message})
        }
        res.status(201).json({message: 'Заказ создан'})
      })
    })
  })
})

app.get('/orders', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if(!token){
    return res.status(401).json({message: 'Необходима авторизация'})
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if(err){
      return res.status(401).json({message: 'Неверный токен'})
    }
    const {login} = decoded;
    if (login === 'admin'){
      db.all(`select * from orders`, [], (err, rows) => {
        if(err){
          return res.status(500).json({message: err.message})
        }
        res.json(rows)
      })
    } else {
      db.all(`select * from orders where name = ?`, [login], (err, rows) => {
         if(err){
          return res.status(500).json({message: err.message})
        }
        res.json(rows)
      })
    }
  })
})

app.put('/order/:id', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if(!token){
    return res.status(401).json({message: 'Необходима авторизация'})
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if(err){
      return res.status(401).json({message: 'Неверный токен'})
    }
    const {status} = req.body;
    const {id} = req.params;

    db.run(`update orders set status = ? where id = ?`, [status, id],
    function(err){
      if(err){
        return res.status(500).json({message: err.message})
      }
      res.json({message: 'Статус обновлен'})
    })
  })
})

app.delete('/order/:id', (req, res) => {
   const token = req.headers.authorization?.split(' ')[1];

  if(!token){
    return res.status(401).json({message: 'Необходима авторизация'})
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if(err){
      return res.status(401).json({message: 'Неверный токен'})
    }
    const {id} = req.params;
    const {login} = decoded;
    if(login === 'admin'){
      db.run(`delete from orders where id = ?`, [id],
      function(err){
        if(err){
          return res.status(500).json({message: err.message})
        }
        res.json({message: 'Заказ удален!'})
      })
    }
  })
})

app.listen(port, () => {
  console.log(`Сервер запущен http://localhost:${port}`)
})