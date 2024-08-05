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
    var sqlQuery = `SELECT *,DATE_FORMAT(createdAt, "%D %M %Y") as createdAt FROM user`
    con.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(409).send(err.sqlMessage)
            return
        }
        res.status(200).send(result)
    })
})

router.post('/', (req, res) => {
    // const name = req.body.name;
    // res.send(name)
    const {
        firstName,
        lastName,
        phoneNo,
        email,
        loginId,
        password,
    } = req.body;
    const sqlQuery = 'insert into user (firstName, lastName, phoneNo, email, loginId, password) values (?,?,?,?,?,?)'
    con.query(sqlQuery, [firstName, lastName, phoneNo, email, loginId.toLowerCase(), password], (err, result) => {
        if (err) {
            res.status(409).send(err.sqlMessage)
            return
        }
        if(result.affectedRows != 0) {
            res.status(200).send("insert successfully") 
        }
    })
})

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const {
        firstName,
        lastName,
        phoneNo,
        email,
        loginId,
        password,
    } = req.body;

    // console.log(typeof(lastName))
    const conditionArr = []
    if (firstName) {
        conditionArr.push(` firstName = '${firstName}'`)
    }
    if (lastName) {
        conditionArr.push(` lastName = '${lastName}'`)
    }
    if (phoneNo) {
        conditionArr.push(` phoneNo = '${phoneNo}'`)
    }
    if (email) {
        conditionArr.push(` email = '${email}'`)
    }
    if (loginId) {
        conditionArr.push(` loginId = '${loginId}'`)
    }
    if (password) {
        conditionArr.push(` password = '${password}'`)
    }
    var queryStr = conditionArr.length ? `${conditionArr.join(',')}` : ``
    // console.log(queryStr)
    const sqlQuery = `update user set ${queryStr} where id = ${id}`
    // console.log(sqlQuery)

    con.query(sqlQuery, (err, result) => {
        if (err) {
            console.log(err)
            res.status(409).send(err.sqlMessage)
            return
        }
        if (result.affectedRows != 0) {
            con.query(`select * from user where id = ${id}`, (err2, result2) => {
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
//     const sqlQuery = `delete from user  where id = ${delId}`
//     con.query(sqlQuery,(err,result) => {
//         if(err) throw err;
//         res.send('delete suessfully')
//     })
// })

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const sqlQuery = `select * from user where id = ${id}`
    con.query(sqlQuery, (err, result) => {
        if(err){
            res.status(409).send(err.sqlMessage)
            return
        }
        res.status(200).send(result[0])
    })
})

module.exports = router;