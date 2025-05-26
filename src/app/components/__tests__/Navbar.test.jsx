import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar.jsx'; // Adjust path as needed
import { GlobalProvider, useGlobalContext } from '../../contexts/GlobalContext.jsx'; // Adjust path

// Mock the useGlobalContext hook
jest.mock('../../contexts/GlobalContext.jsx', () => {
  const originalModule = jest.requireActual('../../contexts/GlobalContext.jsx');
  return {
    ...originalModule,
    useGlobalContext: jest.fn(),
  };
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'), // Default pathname
  useRouter: () => ({
    push: jest.fn(),
  }),
}));


describe('Navbar Component', () => {
  const mockRouter = { push: jest.fn() };
  beforeEach(() => {
    // Reset mocks for each test
    useGlobalContext.mockReset();
    // Reset next/navigation mocks if they are more complex
    require('next/navigation').usePathname.mockReturnValue('/'); 
  });

  test('renders login and signup links when not authenticated', () => {
    useGlobalContext.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: jest.fn(),
      loading: false,
    });

    render(
      <GlobalProvider> {/* Needs to be wrapped if Navbar consumes context directly, but here we mock useGlobalContext */}
        <Navbar />
      </GlobalProvider>
    );

    // Check that at least one "Login" and "Sign Up" link is present
    expect(screen.getAllByText('Login').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sign Up').length).toBeGreaterThan(0);
    expect(screen.queryByText('Invoices')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  test('renders authenticated links and user info when authenticated', () => {
    useGlobalContext.mockReturnValue({
      isAuthenticated: true,
      user: { email: 'test@example.com', companyName: 'Test Co' },
      logout: jest.fn(),
      loading: false,
    });

    render(
        <Navbar /> // No need to wrap with GlobalProvider if useGlobalContext is fully mocked
    );

    expect(screen.getAllByText('Invoices').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Projects').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Settings').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Logout').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hi, Test Co/i).length).toBeGreaterThan(0); 
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  test('does not render Login link on /login page when not authenticated', () => {
    require('next/navigation').usePathname.mockReturnValue('/login');
    useGlobalContext.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: jest.fn(),
      loading: false,
    });
    render(<Navbar />);
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.getAllByText('Sign Up').length).toBeGreaterThan(0);
  });

   test('shows loading state', () => {
    useGlobalContext.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: jest.fn(),
      loading: true, // Set loading to true
    });
    render(<Navbar />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
