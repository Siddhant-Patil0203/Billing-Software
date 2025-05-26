// Optional: Global setup for Jest tests
// For example, you can import jest-dom matchers here
import '@testing-library/jest-dom';

// Mock localStorage if your components use it directly and it's not handled by jsdom
// (jsdom should provide a basic localStorage mock)
// global.localStorage = {
//   getItem: jest.fn(),
//   setItem: jest.fn(),
//   removeItem: jest.fn(),
//   clear: jest.fn(),
// };

// Mock next/navigation for components that use useRouter, usePathname, etc.
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: () => jest.fn(),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock next-themes if components use useTheme
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

// You can add other global mocks here if needed
// For example, mocking fetch:
// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve({}),
//   })
// );
