/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testTimeout: 30000,
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleFileExtensions: ["js", "json", "ts"],
  testRegex: ".*(\\.|-)test\\.ts$",
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      // tsconfig: 'tsconfig.json',
      isolatedModules: true,
    }],
  },
  globalSetup: "<rootDir>/test/setup-jest.global.ts",
  globalTeardown: "<rootDir>/test/teardown-jest.global.ts",
  setupFiles: ["./test/setup.ts"],
};
