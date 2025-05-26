import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../page.js'; // Adjust path to your LoginPage component
import { GlobalProvider, useGlobalContext } from '../../contexts/GlobalContext.jsx'; // Adjust path
import Validator from '../../contexts/Validator.js'; // Adjust path

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
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: () => jest.fn().mockReturnValue('/login'), // Mock pathname for login page
  useSearchParams: () => ({ get: jest.fn() }),
}));

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

// Mock Validator
jest.mock('../../contexts/Validator.js', () => jest.fn()); // Mock as jest.fn()

// Mock fetch
global.fetch = jest.fn();

describe('LoginPage Component', () => {
  beforeEach(() => {
    // Default return value for Validator for tests that don't specify errors
    Validator.mockReturnValue({}); 
    useGlobalContext.mockReturnValue({
      login: jest.fn(),
      isAuthenticated: false,
      loading: false,
      user: null,
    });
    fetch.mockClear();
    // Clear mock call history for Validator if needed, though jest.fn() does this for individual calls
    // Validator.mockClear(); // Already a jest.fn(), so calls are cleared.
  });

  test('renders login form correctly', () => {
    render(
      <GlobalProvider>
        <LoginPage />
      </GlobalProvider>
    );

    // Use more specific queries if getByLabelText is ambiguous due to component library structure
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    // Assuming "Password" label is unique enough for getByLabelText or use getByRole for password too
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument(); 
    expect(screen.getByRole('button', { name: /^Sign in$/i, type: 'submit' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register\?/i })).toBeInTheDocument();
  });

  test('allows user to input email and password', () => {
    render( // This test was missing GlobalProvider wrapper, which could cause issues.
      <GlobalProvider>
        <LoginPage />
      </GlobalProvider>
    );
    
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i); // Assuming this is fine

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('shows validation errors from Validator', () => {
    Validator.mockReturnValueOnce({ email: 'Email is required', password: 'Password is required' });
    render(
      <GlobalProvider>
        <LoginPage />
      </GlobalProvider>
    );

    fireEvent.submit(screen.getByRole('button', { name: /^Sign in$/i, type: 'submit' }));

    // Depending on how Validator errors are displayed (e.g., text content)
    expect(screen.getByText('Email is required')).toBeInTheDocument(); 
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  test('calls login API on submit with valid data and handles success', async () => {
    Validator.mockReturnValueOnce({}); // No validation errors
    const mockLoginContextFn = jest.fn();
    useGlobalContext.mockReturnValue({
      login: mockLoginContextFn, // This is the function from useGlobalContext
      isAuthenticated: false,
      loading: false,
      user: null, // ensure user is null initially
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: '1', email: 'test@example.com' }, token: 'fake-token' }),
    });

    render( // This test was missing GlobalProvider wrapper
      <GlobalProvider>
        <LoginPage />
      </GlobalProvider>
    );

    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } }); // Assuming this is fine
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } }); // Assuming this is fine
    fireEvent.submit(screen.getByRole('button', { name: /^Sign in$/i, type: 'submit' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/login', expect.any(Object));
      expect(fetch.mock.calls[0][1].body).toContain('test@example.com');
    });
    
    await waitFor(() => {
      expect(mockLoginContextFn).toHaveBeenCalledWith(
        { id: '1', email: 'test@example.com' },
        'fake-token'
      );
    });
  });

  test('shows server error message on API failure', async () => {
    Validator.mockReturnValueOnce({}); // No validation errors
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    render(
      <GlobalProvider>
        <LoginPage />
      </GlobalProvider>
    );
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: /^Sign in$/i, type: 'submit' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
  
  test('redirects if user is already authenticated', () => {
    // Get the mocked useRouter
    const { useRouter } = require('next/navigation');
    const mockRouter = useRouter(); // This will get the object with jest.fn() for push

    useGlobalContext.mockReturnValue({
      login: jest.fn(),
      isAuthenticated: true, // User is authenticated
      loading: false, // Auth check is complete
      user: { email: 'test@example.com' } // Provide some user data
    });

    render(
      <GlobalProvider> {/* Ensure the provider is here if useEffect depends on context values */}
        <LoginPage />
      </GlobalProvider>
    );
    
    // useEffect in LoginPage should call router.push
    expect(mockRouter.push).toHaveBeenCalledWith('/invoices');
  });

});
