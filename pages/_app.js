import { useEffect } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import NProgress from 'nprogress';
import { ChakraProvider } from '@chakra-ui/react';

import Layout from '../components/Layout';
import 'nprogress/nprogress.css';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

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

  return (
    <ChakraProvider>
      {getLayout(<Component {...pageProps} />)}
    </ChakraProvider>
  );
}

export default MyApp;
