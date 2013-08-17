var childProcess = require('child_process');
var projectRoot = '.';
var command = 'tsc --out bin/app.js --module amd src/app.ts src/models.ts src/views.ts --sourcemap';

childProcess.exec(command, {
        cwd: '.'
      },function(err, stdout, stderr){
    console.log(err);
    console.log(stdout);
    console.log(stderr);
});