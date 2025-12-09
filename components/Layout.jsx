import Head from 'next/head';
import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import Footer from './Footer';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const router = useRouter();

  // pages you do NOT want navbar on
  const hideNavbarRoutes = [
    '/login',
    '/register',
    '/message',
    '/forgot-password'
  ];

  const shouldShowNavbar = !hideNavbarRoutes.includes(router.pathname);

  return (
    <>
      <Head>
        <title>Real Estate</title>
      </Head>

      <Box maxWidth='1280px' m='auto'>
        <header>
          {shouldShowNavbar && <Navbar />}
        </header>

        <main>{children}</main>

        <footer>
          <Footer />
        </footer>
      </Box>
    </>
  );
}
