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
router.get('/broom/:id', (req, res) => {
    const id = req.params.id;
    var sqlQuery =/*sql*/ `
    SELECT
     r.*,
     b.id,
     b.name
    FROM
       room AS r
    JOIN
     blocks AS b
      ON
       b.id = r.blockId 
       WHERE
        blockId = ?`
    con.query(sqlQuery,[id], (err, result) => {
        if (err) {
            res.status(409).send(err)
            return
        }
        res.status(200).send(result)
    })
})

router.post('/', (req, res) => {
    const {
        roomNo,
        blockId,
    } = req.body;
    const sqlQuery = 'insert into room (roomNo, blockId) values (?,?)'
    con.query(sqlQuery, [roomNo, blockId], (err, result) => {
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
        roomNo,
        blockId,
    } = req.body;

    const conditionArr = []
    if (roomNo) {
        conditionArr.push(` roomNo = '${roomNo}'`)
    }
    if (blockId) {
        conditionArr.push(` blockId = '${blockId}'`)
    }
    var queryStr = conditionArr.length ? `${conditionArr.join(',')}` : ``
    const sqlQuery = `update room set ${queryStr} where id = ${id}`

    con.query(sqlQuery, (err, result) => {
        if (err) {
            console.log(err)
            res.status(409).send(err.sqlMessage)
            return
        }
        if (result.affectedRows != 0) {
            con.query(`select * from room where id = ${id}`, (err2, result2) => {
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

// router.delete('/:id', (req, res) => {
//     const delId = req.params.id;
//     const sqlQuery = `UPDATE room SET deletedAt = CURRENT_TIMESTAMP WHERE id = ${delId};`
//     con.query(sqlQuery, (err, result) => {
//         if (err) throw err;
//         if (result.affectedRows != 0) {
//             res.status(200).send('delete successfully')
//         } else {
//             res.status(409).send('Invalid User')
//         }
//     })
// })

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const sqlQuery = `select * from room where id = ${id}`
    con.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(409).send(err.sqlMessage)
            return
        }
        res.status(200).send(result[0])
    })
})

module.exports = router;