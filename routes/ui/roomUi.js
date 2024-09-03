const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/:id',async (req,res) => { 
    const id = req.params.id;
    console.log('leo')
    res.render('pages/roomPage/roomList.ejs')
})

module.exports = router;