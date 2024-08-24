const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root1234@',
    database: 'attendance'
})

// con.connect((err) => {
//     if (err) throw err;
//     console.log('connected')
// })
router.get('/', (req, res) => {
    var sqlQuery = `select *,DATE_FORMAT(date,'%d-%m-%y') as date FROM dayattendance`
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
        studentId,
        wardenId,
        appearance,
        date
    } = req.body;
    const sqlQuery = 'insert into dayattendance (studentId, wardenId, appearance,date) values (?,?,?,?)'
    con.query(sqlQuery, [studentId, wardenId, appearance, date], (err, result) => {
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
        studentId,
        wardenId,
        appearance,
        date
    } = req.body;

    const conditionArr = []

    if (studentId) {
        conditionArr.push(` studentId = '${studentId}'`)
    }
    if (wardenId) {
        conditionArr.push(` wardenId = '${wardenId}'`)
    }
    if (appearance) {
        conditionArr.push(` appearance = '${appearance}'`)
    }
    if (date) {
        conditionArr.push(` date = '${date}'`)
    }

    var queryStr = conditionArr.length ? `${conditionArr.join(',')}` : ``
    const sqlQuery = `update dayattendance set ${queryStr} where id = ${id}`

    con.query(sqlQuery, (err, result) => {
        if (err) {
            console.log(err)
            res.status(409).send(err.sqlMessage)
            return
        }
        if (result.affectedRows != 0) {
            con.query(`select *, DATE_FORMAT(date, "%d-%m-%y") as date from dayattendance where id = ${id}`, (err2, result2) => {
                if (err2) {
                    console.log(err2)
                    res.status(409).send(err2.sqlMessage)
                    return
                }
                res.status(200).send(result2[0])
            })
        }
    })
})
module.exports = router;