const express = require('express');

const convert = require('xml-js');
const fs = require('fs');

const router = express.Router();

router.get('/', async (req, res) => {
  let folders = fs.readdirSync('/');
  console.log(folders);

  res.status(200).send('DONE');
});

module.exports = router;
