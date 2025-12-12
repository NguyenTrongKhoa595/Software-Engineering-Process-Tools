import Head from 'next/head';
import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import Footer from './Footer';
import Navbar from './NavbarLLPM';
import NavbarTenant from './NavbarTenant';
import NavbarGuest from './NavbarGuest';

export default function Layout({ children }) {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);

  // pages you do NOT want navbar on
  const hideNavbarRoutes = [
    '/login',
    '/register',
    '/messages',
    '/forgot-password'
  ];

  const shouldShowNavbar = !hideNavbarRoutes.includes(router.pathname);

  // Get user role from localStorage on mount
  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  // Render appropriate navbar based on role
  const renderNavbar = () => {
    if (!shouldShowNavbar) return null;

    // TEMPORARY: Force NavbarLLPM for testing on landlord routes
    if (router.pathname.startsWith('/landlord')) {
      return <Navbar />;
    }

    switch (userRole) {
      case 'LANDLORD':
      case 'PROPERTY_MANAGER':
        return <Navbar />;
      case 'TENANT':
        return <NavbarTenant />;
      default:
        return <NavbarGuest />;
    }
  };

  return (
    <>
      <Head>
        <title>Real Estate</title>
      </Head>

      <Box maxWidth='1280px' m='auto'>
        <header>
          {renderNavbar()}
        </header>

        <main>{children}</main>

        <footer>
          <Footer />
        </footer>
      </Box>
    </>
  );
}
