const express = require('express');
const router = express.Router();
//const fetch = require('node-fetch');

router.get('/login',(req, res) => {
    res.render('pages/login.ejs')
});

router.get('/home', (req, res) => {
    // if(req.session.isLogged == true) {
    const name = 'leo'
         res.render('pages/home.ejs',{name})
    // } else {
    //     res.redirect('http://localhost:2000/sh/login')
    // }
})

router.get('/logout', (req, res) => {
    req.session.destroy ((err) => {
        if (err) throw err;
        res.redirect('http://localhost:2000/sh/login')
    })
})

router.get('/signup', (req, res) => {
    res.render('pages/signup')
})

module.exports = router;