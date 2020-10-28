const express = require('express');

const fs = require('fs');
const http = require('http');
const unzipper = require('unzipper');

const router = express.Router();

router.get('/', async (req, res) => {
  let folders = fs.readdirSync('/Templates');

  res.status(200).send(folders);
});

router.post('/add', async (req, res) => {
  let file = fs.createWriteStream('/Templates/file.zip');

  http.get(
    `http://95.84.135.236:5000/api/templates/${req.body.template}`,
    async (httpRes) => {
      httpRes.pipe(file);

      fs.createReadStream('/Templates/file.zip')
        .pipe(unzipper.Extract({ path: '/Templates' }))
        .promise()
        .then(
          () => {
            res.status(200).send('SEND');
            fs.unlinkSync('/Templates/file.zip');
          },
          (e) => {
            res.status(200).send('ERROR');
            fs.unlinkSync('/Templates/file.zip');
          }
        );
    }
  );
});

module.exports = router;
