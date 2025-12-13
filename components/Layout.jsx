import Head from 'next/head';
import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import Footer from './Footer';
import { RoleNavbar } from './Navbar/index'; // 👈 use role-based navbar

// Pages that should NOT have navbar/footer
const AUTH_ROUTES = ['/', '/signup', '/forgot-password'];

export default function Layout({ children }) {
  const router = useRouter();
  const isAuthPage = AUTH_ROUTES.includes(router.pathname);

  return (
    <>
      <Head>
        <title>RentMate</title>
      </Head>

      <Box maxWidth="1280px" m="auto">
        {/* Navbar */}
        {!isAuthPage && (
          <header>
            <RoleNavbar />
          </header>
        )}

        {/* Page Content */}
        <main>{children}</main>

        {/* Footer */}
        {!isAuthPage && (
          <footer>
            <Footer />
          </footer>
        )}
      </Box>
    </>
  );
}
