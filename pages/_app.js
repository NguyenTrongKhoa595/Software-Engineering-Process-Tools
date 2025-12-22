import { useEffect } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../styles/theme';

import Layout from '../components/Layout';
import 'nprogress/nprogress.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

    Router.events.on('routeChangeStart', handleStart);
    Router.events.on('routeChangeComplete', handleStop);
    Router.events.on('routeChangeError', handleStop);

    return () => {
      Router.events.off('routeChangeStart', handleStart);
      Router.events.off('routeChangeComplete', handleStop);
      Router.events.off('routeChangeError', handleStop);
    };
  }, []);

  // ✅ This is the important part
  const getLayout =
    Component.getLayout ||
    ((page) => <Layout>{page}</Layout>);

  return (
    <ChakraProvider theme={theme}>
      {getLayout(<Component {...pageProps} />)}
    </ChakraProvider>
  );
}

export default MyApp;
