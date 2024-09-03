const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/',async function (req,res)  {
    console.log("hello world")
    res.render('pages/blockPage/blockList.ejs')
})

router.get('/addBlock',async function (req, res) {
    res.render('pages/blockPage/addBlock.ejs')
})

module.exports = router;