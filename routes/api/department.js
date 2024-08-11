const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root1234@',
    database: 'attendance'
})

con.connect((err) => {
    if (err) throw err;
    console.log('connected')
})
router.get('/', (req, res) => {
    var sqlQuery = `select *, DATE_FORMAT(createdAt, "%D %M %Y") as createdAt FROM department where deletedAt is null`
    con.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(409).send(err.sqlMessage)
            return
        }
        res.status(200).send(result)
    })
})

router.post('/', (req, res) => {
    const {
        name
    } = req.body;
    const sqlQuery = 'insert into department (name) values (?)'
    con.query(sqlQuery, [name], (err, result) => {
        if (err) {
            res.status(409).send(err.sqlMessage)
            return
        }
        if (result.affectedRows != 0) {
            res.status(200).send("insert successfully")
        }
    })
})

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const {
        name
    } = req.body;

    const sqlQuery = `update department set name = '${name}' where id = ${id}`
    con.query(sqlQuery, (err, result) => {
        if (err) {
            console.log(err)
            res.status(409).send(err.sqlMessage)
            return
        }
        if (result.affectedRows != 0) {
            con.query(`select * from department where id = ${id}`, (err2, result2) => {
                if (err2) {
                    res.status(409).send(err2.sqlMessage)
                    return
                }
                res.status(200).send(result2[0])
            })
        }
    })
})

router.delete('/:id', (req, res) => {
    const delId = req.params.id;
    const sqlQuery = `UPDATE department SET deletedAt = CURRENT_TIMESTAMP WHERE id = ${delId};`
    con.query(sqlQuery, (err, result) => {
        if (err) throw err;
        if (result.affectedRows != 0) {
            res.status(200).send('delete successfully')
        } else {
            res.status(409).send('Invalid User')
        }
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const sqlQuery = `select * from department where id = ${id}`
    con.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(409).send(err.sqlMessage)
            return
        }
        res.status(200).send(result[0])
    })
})

module.exports = router;