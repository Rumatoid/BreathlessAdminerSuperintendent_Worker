const express = require('express');

const router = express.Router();

router.get('/status', async (req, res) => {
  var exec = require('child_process').exec;
  let flag = false;
  await exec('tasklist', function (err, stdout, stderr) {
    let tasks = stdout.split('\n');
    for (let task of tasks) {
      if (task.indexOf('FastExecuteScript.exe') == 0) {
        res.status(201).send(true);
        flag = true;
        break;
      }
    }

    if (!flag) res.status(201).send(false);
  });
});

module.exports = router;
