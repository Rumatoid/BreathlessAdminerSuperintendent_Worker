const express = require('express');

const router = express.Router();

router.get('/status', async (req, res) => {
  var exec = require('child_process').exec;
  let FastExecuteScript = false;
  let Worker = false;
  await exec('tasklist', function (err, stdout, stderr) {
    let tasks = stdout.split('/n');
    for (let task of tasks) {
      console.log(task);
      if (task.indexOf('FastExecuteScript.exe') == 0) {
        FastExecuteScript = true;
      } else if (task.indexOf('Worker.exe') == 0) {
        Worker = true;
      }
    }

    console.log(FastExecuteScript, Worker);

    if (FastExecuteScript && Worker) res.status(201).send('Online');
    else if (!FastExecuteScript) res.status(201).send('Offline');
    else if (FastExecuteScript && !Worker) res.status(201).send('Need reboot');
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
