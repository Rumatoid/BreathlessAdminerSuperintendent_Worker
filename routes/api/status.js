const express = require('express');

const router = express.Router();

router.get('/status', async (req, res) => {
  var exec = require('child_process').exec;
  let flag = 0;
  await exec('tasklist', function (err, stdout, stderr) {
    let tasks = stdout.split('/n');
    for (let task of tasks) {
      if (task.indexOf('FastExecuteScript.exe') == 0) {
        flag = 1;
      } else if (task.indexOf('Worker.exe') == 0 && flag == 1) {
        flag = 2;
        res.status(201).send('Online');
        break;
      } else if (task.indexOf('Worker.exe') == 0 && flag == 0) {
        flag = 3;
      }
    }

    if (flag == 0) res.status(201).send('Offline');
    else if (flag == 3) res.status(201).send('Need reboot');
  });
});

router.get('/reboot', async (req, res) => {
  var exec = require('child_process').exec;

  await exec('wmic process where name="FastExecuteScript.exe" call terminate');
  await exec('wmic process where name="Worker.exe" call terminate');

  await exec(
    'C:/Users/Administrator/Downloads/Worker/serverHeavyXProfilesOFFXdbTEST/RemoteExecuteScriptSilent.exe',
    function (err, stdout, stderr) {
      console.log(stdout);
    }
  );

  res.status(201).send('Done');
});

router.get('/update', async (req, res) => {
  var exec = require('child_process').exec;

  await exec(
    'git pull',
    {
      cwd:
        'C:/Users/Administrator/Downloads/BreathlessAdminerSuperintendent_Worker',
    },
    function (err, stdout, stderr) {
      console.log(stdout);
    }
  );

  res.status(201).send('TRUE');
});

module.exports = router;
