/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest', 
  testEnvironment: 'node', 
  transform: {
    '^.+\\.ts?$': 'ts-jest',  
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts','js'],
  collectCoverage: true, 
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',  
    '!src/**/*.d.ts', 
  ],
  coverageDirectory: 'coverage',  
  coverageReporters: ['text', 'lcov'], 
  clearMocks: true,
  setupFilesAfterEnv: ['./jest.setup.ts'], 
};

