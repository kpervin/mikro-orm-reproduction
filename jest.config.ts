import { JestConfigWithTsJest } from "ts-jest";

const config = {
  testTimeout: 30000,
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        isolatedModules: true,
      },
    ],
  },
} satisfies JestConfigWithTsJest;
export default config;
