const express = require('express');

const fs = require('fs');
const http = require('http');
const unzipper = require('unzipper');
const rimraf = require('rimraf');

const router = express.Router();

router.get('/', async (req, res) => {
  let folders = fs.readdirSync('/Templates');

  res.status(200).send(folders);
});

router.post('/add', async (req, res) => {
  let file = fs.createWriteStream('/Templates/file.zip');

  http.get(
    `http://95.84.160.108:5000/api/templates/${req.body.template}`,
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

router.post('/delete/', async (req, res) => {
  try {
    let folders = fs.readdirSync('/Templates');

    rimraf.sync('/Templates/' + req.body.template);

    res.status(200).send('OK');
  } catch (err) {
    console.log(err);
    if (err) res.status(409).send();
  }
});

module.exports = router;
