import { JestConfigWithTsJest } from "ts-jest";

const config = {
  testTimeout: 30000,
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        // tsconfig: 'tsconfig.json',
        isolatedModules: true,
      },
    ],
  },
  globalSetup: "<rootDir>/test/global-setup.ts",
  globalTeardown: "<rootDir>/test/global-teardown.ts",
} satisfies JestConfigWithTsJest;
export default config;
