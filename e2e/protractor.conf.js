// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter, StacktraceOption } = require('jasmine-spec-reporter');
const fs = require('fs');
const path = require('path');
const nycOutput = '.nyc_output';

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    browserName: 'chrome'
  },
  directConnect: true,
  SELENIUM_PROMISE_MANAGER: false,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () { }
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));

    if (fs.existsSync(nycOutput)) {
      let fileList = fs.readdirSync(nycOutput);
      fileList.forEach(function (fileName) {
        fs.unlinkSync(path.join(nycOutput, fileName));
      });
    } else {
      fs.mkdirSync(nycOutput);
    }

    afterEach(async function () {
      await browser.executeScript('return JSON.stringify(window.__coverage__);').then(function (coverage) {
          if (coverage) {
            const report = coverage.split('webpack://').join('root');
            require('fs').writeFile(`${nycOutput}/coverage-${new Date().getTime()}.json`, report, function (err) {
                if (err) {
                  return console.log(err);
                }
                console.log('Coverage file extracted from server and saved to .nyc_output');
              },
            );
          }
        });
    });
  }
};