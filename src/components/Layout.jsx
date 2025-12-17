import Head from 'next/head';
import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Footer from '@/components/Footer';
import Navbar from '@/components/common/Navbar';
import NavbarGuest from '@/components/NavbarGuest';
import { useAuth } from '@/hooks/useAuth';

export default function Layout({ children }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Pages that should not have any navbar
  const hideNavbarRoutes = ['/login', '/signup', '/forgot-password'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(router.pathname);

  const renderNavbar = () => {
    if (!shouldShowNavbar) return null;

    // The Home page has its own transparent guest navbar for the hero section
    if (router.pathname === '/' && !isAuthenticated) {
      return null;
    }

    return isAuthenticated ? <Navbar /> : <NavbarGuest />;
  };

  return (
    <>
      <Head>
        <title>RentMate - Your Perfect Home</title>
      </Head>

      <Box>
        <header>{renderNavbar()}</header>
        <main>{children}</main>
        {/* The footer will be added to specific page layouts via PageContainer */}
      </Box>
    </>
  );
}
