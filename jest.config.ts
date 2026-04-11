// const { createDefaultPreset } = require("ts-jest");

// const tsJestTransformCfg = createDefaultPreset().transform;

// /** @type {import("jest").Config} **/
// export default {
//   testEnvironment: "node",
//   transform: {
//     ...tsJestTransformCfg,
//   },
// };
import type { Config } from '@jest/types';
const baseTestDir = '<rootDir>/test/withMockDatabase/AuthTest';

const config: Config.InitialOptions = {
  // preset: 'ts-jest',
  // verbose: true,
  // testEnvironment: 'node',
  // testMatch: [
  //   `${baseTestDir}/**/*.{spec,test}.{ts,tsx}`,
  // ]
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
};

export default config;