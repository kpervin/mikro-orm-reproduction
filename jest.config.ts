import { JestConfigWithTsJest } from "ts-jest";


const config = {
  testTimeout: 30000,
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!uuid)",
  ],
  // globalSetup: "<rootDir>/test/global-setup.ts",
  // globalTeardown: "<rootDir>/test/global-setup.ts",
} satisfies JestConfigWithTsJest;
export default config;
