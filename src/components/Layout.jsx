import Head from 'next/head';
import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Navbar from '@/components/common/Navbar';

export default function Layout({ children }) {
  const router = useRouter();

  // Pages that should not have a navbar
  const hideNavbarRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password'];
  const shouldShowNavbar = !hideNavbarRoutes.some(path => router.pathname.startsWith(path));

  return (
    <>
      <Head>
        <title>RentMate - Your Perfect Home</title>
      </Head>

      <Box>
        <header>{shouldShowNavbar && <Navbar />}</header>
        <main>{children}</main>
        {/* The footer will be added to specific page layouts via PageContainer */}
      </Box>
    </>
  );
}
