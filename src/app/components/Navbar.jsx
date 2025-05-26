"use client";

import Link from 'next/link';
import { useGlobalContext } from '../contexts/GlobalContext.jsx';
import { Button } from '@nextui-org/react'; // Using NextUI for consistency
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { isAuthenticated, user, logout, loading } = useGlobalContext();
  const pathname = usePathname();

  if (loading) {
    return (
      <nav className="bg-gray-100 dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold text-gray-700 dark:text-white">
            BillingApp
          </Link>
          <div>Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-gray-700 dark:text-white">
            BillingApp
          </Link>
        </div>

        {/* Mobile menu button (optional, can be added later) */}
        {/* <div className="md:hidden">...</div> */}

        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <NavLink href="/invoices">Invoices</NavLink>
              <NavLink href="/projects">Projects</NavLink>
              <NavLink href="/settings">Settings</NavLink>
              <span className="text-gray-700 dark:text-gray-200">Hi, {user?.companyName || user?.email}</span>
              <Button color="danger" variant="flat" onClick={logout} size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              {pathname !== '/login' && <NavLink href="/login">Login</NavLink>}
              {pathname !== '/signup' && <NavLink href="/signup">Sign Up</NavLink>}
            </>
          )}
        </div>
      </div>
      {/* Mobile Menu (conditionally rendered) - basic version for now */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {isAuthenticated ? (
            <>
              <MobileNavLink href="/invoices">Invoices</MobileNavLink>
              <MobileNavLink href="/projects">Projects</MobileNavLink>
              <MobileNavLink href="/settings">Settings</MobileNavLink>
              <div className="px-3 py-2">
                <span className="block text-base font-medium text-gray-700 dark:text-gray-200">Hi, {user?.companyName || user?.email}</span>
              </div>
              <Button color="danger" variant="flat" onClick={logout} fullWidth className="mt-1">
                Logout
              </Button>
            </>
          ) : (
            <>
              {pathname !== '/login' && <MobileNavLink href="/login">Login</MobileNavLink>}
              {pathname !== '/signup' && <MobileNavLink href="/signup">Sign Up</MobileNavLink>}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className={`px-3 py-2 rounded-md text-sm font-medium ${
        isActive 
          ? 'bg-primary-500 text-white dark:bg-primary-400' 
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className={`block px-3 py-2 rounded-md text-base font-medium ${
        isActive 
          ? 'bg-primary-500 text-white dark:bg-primary-400' 
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {children}
    </Link>
  );
};


export default Navbar;
