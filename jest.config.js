module.exports = {
  testEnvironment: 'jest-environment-jsdom', // Use jsdom for testing React components
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Optional: for global setup
  moduleNameMapper: {
    // Handle CSS imports (if you import CSS in components)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle module aliases (if you have them in jsconfig.json or tsconfig.json)
    '^@/components/(.*)$': '<rootDir>/src/app/components/$1',
    '^@/contexts/(.*)$': '<rootDir>/src/app/contexts/$1',
    '^@/lib/(.*)$': '<rootDir>/src/app/lib/$1',
    '^@/models/(.*)$': '<rootDir>/src/app/models/$1',
    // Next.js specific mocks or configurations if needed
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: [['@babel/preset-env', { targets: { node: 'current' } }], ['@babel/preset-react', {runtime: 'automatic'}]] }],
  },
  // Ignore Next.js build directory and node_modules
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
};
