const express = require('express');

const convert = require('xml-js');
const fs = require('fs');
const { time } = require('console');

const router = express.Router();

router.get('/status', async (req, res) => {
  var exec = require('child_process').exec;
  let FastExecuteScript = false;
  let Worker = false;
  await exec('tasklist', function (err, stdout, stderr) {
    let tasks = stdout.split('\n');
    for (let task of tasks) {
      if (task.indexOf('FastExecuteScript.exe') == 0) {
        FastExecuteScript = true;
      } else if (task.indexOf('Worker.exe') == 0) {
        Worker = true;
      }
    }

    if (FastExecuteScript && Worker) res.status(201).send('Online');
    else if (!FastExecuteScript) res.status(201).send('Offline');
    else if (FastExecuteScript && !Worker) res.status(201).send('Need reboot');
  });
});

router.get('/reboot', async (req, res) => {
  console.log('Go to reboot');
  var exec = require('child_process').exec;

  await exec('wmic process where name="FastExecuteScript.exe" call terminate');
  await exec('wmic process where name="Worker.exe" call terminate');

  await exec(
    'C:/Users/Administrator/Downloads/Worker/serverHeavyXProfilesOFFXdbTEST/RemoteExecuteScriptSilent.exe',
    function (err, stdout, stderr) {
      console.log(stdout);
    }
  );
  console.log('Reboot Done');

  res.status(200).send('Done');
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

  res.status(200).send('TRUE');
});

router.get('/getSettings', async (req, res) => {
  let xml_string = fs.readFileSync(
    'D:/Programs/BrowserAutomationStudio/release/serverHeavyXProfilesOFFXdbTEST/appsremote/serverHeavyXProfilesOFFXdbTEST/SID71a5577f/engine/Actual.serverHeavyXProfilesOFFXdbTEST.xml',
    'utf8'
  );

  var result = JSON.parse(
    convert.xml2json(xml_string, { compact: true, spaces: 4 })
  );

  res.status(200).send(result.BrowserAutomationStudioProject.ModelList.Model);
});

router.post('/saveSettings', async (req, res) => {
  let xml_string = fs.readFileSync(
    'D:/Programs/BrowserAutomationStudio/release/serverHeavyXProfilesOFFXdbTEST/appsremote/serverHeavyXProfilesOFFXdbTEST/SID71a5577f/engine/Actual.serverHeavyXProfilesOFFXdbTEST.xml',
    'utf8'
  );

  var result = JSON.parse(
    convert.xml2json(xml_string, { compact: true, spaces: 4 })
  );

  result.BrowserAutomationStudioProject.ModelList.Model = req.body;

  var options = { compact: true, ignoreComment: true, spaces: 4 };
  var resultXML = convert.json2xml(result, options);

  fs.writeFileSync(
    'D:/Programs/BrowserAutomationStudio/release/serverHeavyXProfilesOFFXdbTEST/appsremote/serverHeavyXProfilesOFFXdbTEST/SID71a5577f/engine/Actual.serverHeavyXProfilesOFFXdbTEST.xml',
    resultXML
  );

  console.log('Save Settings Done');

  res.status(200).send('Done');
});

module.exports = router;
