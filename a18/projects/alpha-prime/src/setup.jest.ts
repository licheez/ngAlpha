import 'jest-preset-angular/setup-jest.js';

// @ts-ignore
module.exports = {
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      "tsconfig": "<rootDir>/tsconfig.spec.json",
      "stringifyContentPathRegex": "\\.html$"
    }],
  }
}
