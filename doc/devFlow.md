npx @angular/cli@15 new sandbox

cd sandbox

ng g library AlphaLbs

cd projects/alpha-lbs

... edit project, readme, unit tests...

npm init --scope @pvway

edit the name into the angular.json file

ng build AlphaLbs

cd ../../dist/alpha-lbs

npm publish --access public


## Install Karma

Angular removes e2e testing starting from version 11 and the default configuration does not include a Karma setup. The deprecation notice goes as follows:
As of Angular CLI 12, we are no longer include E2E in new projects, and we will be working towards removing them from the Angular ecosystem while providing better integration with Cypress and other popular tooling.
In order to incorporate unit testing and Karma/Jasmine configurations into your project, please follow this guide.
First, you'll need to install the required dependencies:

```bash
npm install --save-dev karma karma-chrome-launcher karma-jasmine karma-jasmine-html-reporter jasmine-core jasmine-spec-reporter @types/jasmine
```
Then, you'll need to create a karma.conf.js file in your project root:

```bash
touch karma.conf.js
```

``` typescript
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {},
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/my-app'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
```

You also need to create a test.ts file inside the src folder (src/test.ts) with the following content:

```typescript
import 'zone.js/dist/zone';
import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
const context = require.context('./', true, /\.spec\.ts$/);
context.keys().map(context);
```
This will set up the Angular testing environment.
Update your angular.json file and add the following configuration under the projects -> your-project-name section:

```json lines
{
    "test": {
      "builder": "@angular-devkit/build-angular:karma",
      "options": {
        "main": "src/test.ts",
        "karmaConfig": "./karma.conf.js",
        "polyfills": "src/polyfills.ts",
        "tsConfig": "./tsconfig.spec.json",
        "scripts": [],
        "styles": [
          "styles.css"
        ],
        "assets": [
          "favicon.ico",
          "assets"
        ]
      }
    }
}
```

# Jest
https://medium.com/@zeeshankhan8838/unit-testing-angular-with-jest-configuration-e324ec61620c


