// components/AuthLayout.js
import Head from "next/head";
import { Box } from "@chakra-ui/react";

export default function AuthLayout({ children }) {
  return (
    <>
      <Head>
        <title>RentMate</title>
      </Head>

      <Box minH="100vh">
        {children}
      </Box>
    </>
  );
}
