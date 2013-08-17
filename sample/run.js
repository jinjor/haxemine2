var system = require('system');
var page = require('webpage').create();



function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001, //< Default Max Timeout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 100); //< repeat check every 100ms
};




var getSources = function(){
    return ['out/js/sample.js'];
};
var getSpecs = function(){
    return ['test/spec/PathUtilTest.js'];
};

page.onConsoleMessage = function(msg) {
    console.log('phantom > ' + msg);
};
page.onError = function (msg, trace) {
    console.log(msg);
    trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
    })
}
page.open('local.html', function(){
  
  page.injectJs('jasmine-1.3.1/jasmine.js');
  //page.injectJs('jasmine-1.3.1/jasmine-html.js');
  //console.log(page.offlineStoragePath);
  getSources().concat(getSpecs()).forEach(function(path){
    page.injectJs(path);
  });
  page.evaluate(function() {
    if (! jasmine) {
        throw new Exception("jasmine library does not exist in global namespace!");
    }
    var ConsoleReporter = function() {
        this.started = false;
        this.finished = false;
    };
    ConsoleReporter.prototype = {
        reportRunnerResults: function(runner) {
            var dur = (new Date()).getTime() - this.start_time;
            var failed = this.executed_specs - this.passed_specs;
            var spec_str = this.executed_specs + (this.executed_specs === 1 ? " spec, " : " specs, ");
            var fail_str = failed + (failed === 1 ? " failure in " : " failures in ");

            this.log("Runner Finished.");
            this.log(spec_str + fail_str + (dur/1000) + "s.");
                
            this.finished = true;
        },

        reportRunnerStarting: function(runner) {
            this.started = true;
            this.start_time = (new Date()).getTime();
            this.executed_specs = 0;
            this.passed_specs = 0;
            this.log("Runner Started.");
        },

        reportSpecResults: function(spec) {
            var resultText = "Failed.";
            if (spec.results().passed()) {
                this.passed_specs++;
                resultText = "Passed.";
            }

            this.log(resultText);
        },

        reportSpecStarting: function(spec) {
            this.executed_specs++;
            this.log(spec);
            this.log(spec.suite);
            this.log(spec.suite.description + ' : ' + spec.description + ' ... ');
        },

        reportSuiteResults: function(suite) {
            var results = suite.results();
            this.log(suite.description + ": " + results.passedCount + " of " + results.totalCount + " passed.");
        },

        log: function(str) {
            //var console = jasmine.getGlobal().console;
            console.log('jasmine > ' + str);
        }
    };
    window.reporter = new ConsoleReporter();
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;
    jasmineEnv.addReporter(window.reporter);
    jasmineEnv.execute();
    console.log('end');
  });
  waitFor(function(){
      return page.evaluate(function(){
          return window.reporter.finished;
      });
  }, function(){
      var exitCode = page.evaluate(function(){
          return 0;//FIXME
      });
      phantom.exit(exitCode);
  });
  
  
});


