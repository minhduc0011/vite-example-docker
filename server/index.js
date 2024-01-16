import sqlite3 from 'sqlite3';
import express, { json } from 'express';

const db = new sqlite3.Database(':memory:');
const server = express();

db.exec('create table if not exists blog(userId integer, title text, body text);')
db.exec("insert into blog (userId, title, body) values (0, 'first title', 'first body')")
db.exec("insert into blog (userId, title, body) values (0, 'second title', 'second body')")

server.use(json());
server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
server.get('/posts/:id', async (req, res, next) => {
    db.get('select *, rowid as id from blog where rowid = (?)', req.params.id, (err, row) => {
        if (!err) {
            res.send(row);
            next();
        } else {
            res.status(404);
            res.end();
        }
    });
})

server.get('/posts', async (req, res, next) => {
    db.all('select *, rowid as id from blog', (err, row) => {
        if (!err) {
            res.send(row);
        }
        next();
    });
})

server.post('/posts', async (req, res, next) => {
    let b = req.body;
    if (!b) {
        res.status(400);
        res.end();
    }
    db.run('insert into blog (userId, title, body) values (?, ?, ?)', [b.userId, b.title, b.body], function(err) {
        if (err) {
            res.status(500);
            res.send({ error: `${err}` });
        } else {
            res.send({ id: this.lastID });
            next();
        }
    });
})

server.put('/posts/:id', async (req, res, next) => {
    let b = req.body;
    if (!b) {
        res.status(400);
        res.end();
    }

    db.run('update blog set userId = (?), title = (?), body = (?) where rowid = (?)', [b.userId, b.title, b.body, req.params.id], (err) => {
        if (err) {
            res.status(500);
            res.send({ error: `${err}` });
        } else {
            res.send({ success: true });
            next();
        }
    });
})
server.use(express.static('dist'))

server.listen(3311, () => {
    console.log('Listening on port', 3311)
});

