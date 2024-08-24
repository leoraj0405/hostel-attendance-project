const express = require('express');
const router = express.Router();
const mysql = require('mysql');

mysql.escape

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root1234@',
    database: 'attendance'
})

const INSERT_QUERY = /*sql*/`INSERT INTO student (
    accNo, 
    firstName, 
    lastName, 
    wardenId,
    blockId, roomId, departmentId, phoneNo, email, native) 
    values (?,?,?,?,?,?,?,?,?,?)`


// con.connect((err) => {
//     if (err) throw err;
//     console.log('connected')
// })
router.get('/', (req, res) => {
    var sqlQuery = /*sql*/`
        SELECT 
            *, 
            DATE_FORMAT(createdAt, "%D %M %Y") AS createdAt 
        FROM student 
        WHERE deletedAt IS NULL`
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
        accNo,
        firstName,
        lastName,
        wardenId,
        blockId,
        roomId,
        departmentId,
        phoneNo,
        email,
        native,
    } = req.body;

    const student = [
        accNo, 
        firstName, 
        lastName, wardenId, 
        blockId, 
        roomId, 
        departmentId, 
        phoneNo, 
        email, 
        native
    ]

    con.query(INSERT_QUERY, student, (err, result) => {
        if (err) {
            console.log(err)
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
        accNo,
        firstName,
        lastName,
        wardenId,
        blockId,
        roomId,
        departmentId,
        phoneNo,
        email,
        native,
    } = req.body;

    const conditionArr = []
    if (accNo) {
        conditionArr.push(` accNo = '${accNo}'`)
    }
    if (firstName) {
        conditionArr.push(` firstName = '${firstName}'`)
    }
    if (lastName) {
        conditionArr.push(` lastName = '${lastName}'`)
    }
    if (wardenId) {
        conditionArr.push(` wardenId = '${wardenId}'`)
    }
    if (blockId) {
        conditionArr.push(` blockId = '${blockId}'`)
    }
    if (roomId) {
        conditionArr.push(` roomId = '${roomId}'`)
    }
    if (departmentId) {
        conditionArr.push(`departmentId = '${departmentId}'`)
    }
    if (phoneNo) {
        conditionArr.push(`phoneNo = '${phoneNo}'`)
    }
    if (email) {
        conditionArr.push(`email = '${email}'`)
    }
    if (native) {
        conditionArr.push(`native = '${native}`)
    }
    var queryStr = conditionArr.length ? `${conditionArr.join(',')}` : ``
    const sqlQuery = `update student set ${queryStr} where id = ${id}`

    con.query(sqlQuery, (err, result) => {
        if (err) {
            console.log(err)
            res.status(409).send(err.sqlMessage)
            return
        }
        if (result.affectedRows != 0) {
            con.query(`select * from student where id = ${id}`, (err2, result2) => {
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

router.delete('/:id', (req, res) => {
    const delId = req.params.id;
    const sqlQuery = `UPDATE student SET deletedAt = CURRENT_TIMESTAMP WHERE id = ${delId};`
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
    const sqlQuery = `select * from student where id = ${id}`
    con.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(409).send(err.sqlMessage)
            return
        }
        res.status(200).send(result[0])
    })
})

module.exports = router;