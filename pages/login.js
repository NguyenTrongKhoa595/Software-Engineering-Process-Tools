import { Box, Flex, Image, Input, Button, Text, Checkbox, useToast } from "@chakra-ui/react";
import { useRouter } from 'next/router';
import { useState } from 'react';
import { apiPost } from '../utils/apiClient';

export default function LoginPage() {

  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <Flex h="100vh" w="100%" >
      {/* LEFT IMAGE */}
      <Box w="50%" display={{ base: "none", md: "block" }}>
        <Image
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D"
          alt="login"
          h="100%"
          w="100%"
          objectFit="cover"
        />
      </Box>

      {/* RIGHT SIDE LOGIN */}
      <Flex w={{ base: "100%", md: "50%" }} align="center" justify="center">
        <Box w={{ base: "80%", md: "350px" }} textAlign="center">
          <Text fontSize="4xl" fontWeight="medium" color="gray.800">
            Sign in
          </Text>
          <Text fontSize="sm" color="gray.500" mt={3}>
            Welcome back! Please sign in to continue
          </Text>

          <Button w="100%" mt={8} bg="gray.100" h="50px" borderRadius="full">
            <Image src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg" />
          </Button>

          <Flex align="center" gap={3} w="100%" my={5}>
            <Box flex="1" h="1px" bg="gray.300" />
            <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
              or sign in with email
            </Text>
            <Box flex="1" h="1px" bg="gray.300" />
          </Flex>

          <Flex
            align="center"
            w="100%"
            border="1px solid"
            borderColor="gray.300"
            h="50px"
            borderRadius="full"
            pl={4}
            gap={2}
          >
            <Input
              placeholder="Email"
              border="none"
              _focus={{ boxShadow: "none" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Flex>

          <Flex
            align="center"
            mt={5}
            w="100%"
            border="1px solid"
            borderColor="gray.300"
            h="50px"
            borderRadius="full"
            pl={4}
            gap={2}
          >
            <Input
              type="password"
              placeholder="Password"
              border="none"
              _focus={{ boxShadow: "none" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Flex>

          <Flex w="100%" justify="space-between" mt={6} color="gray.600" fontSize="sm">
            <Checkbox>Remember me</Checkbox>
            <Text as="a" textDecoration="underline" cursor="pointer" onClick={() => router.push("/forgot-password")}>
              Forgot password?
            </Text>
          </Flex>

          <Button
            w="100%"
            h="44px"
            mt={8}
            borderRadius="full"
            color="white"
            bg="blue.500"
            _hover={{ opacity: 0.9 }}
            isLoading={loading}
            onClick={async () => {
              setLoading(true);
              try {
                const payload = { email: email.trim(), password };
                const res = await apiPost('/auth/login', payload);

                console.debug('Auth response:', res);

                const pick = (obj, keys) => {
                  if (!obj) return null;
                  for (const k of keys) {
                    if (obj[k] !== undefined && obj[k] !== null) return obj[k];
                  }
                  return null;
                };

                // Try common token/user field names
                let token = pick(res, ['token', 'accessToken', 'access_token', 'access', 'jwt', 'authToken']);
                let user = pick(res, ['user', 'userInfo', 'profile']);

                // Try nested data
                if (!token && res && typeof res === 'object') {
                  token = pick(res.data, ['token', 'accessToken', 'access_token', 'access']) || (res.data && res.data.tokens && res.data.tokens.access) || token;
                }
                if (!user && res && typeof res === 'object') {
                  user = pick(res.data, ['user', 'userInfo', 'profile']) || user;
                }

                // Some APIs return { data: { accessToken, user } }
                if (!token && res && res.data && typeof res.data === 'object') {
                  token = pick(res.data, ['accessToken', 'token', 'access_token']);
                }

                if (!user && res && res.data && typeof res.data === 'object') {
                  user = res.data.user || res.data;
                }

                if (!token || !user) {
                  const debugStr = JSON.stringify(res, Object.keys(res || {}).slice(0, 20), 2);
                  console.error('Unable to extract auth token/user from response', res);
                  throw new Error('Invalid response from auth server — unexpected response shape: ' + (debugStr ? debugStr.slice(0, 400) : 'empty'));
                }

                if (typeof window !== 'undefined') {
                  localStorage.setItem('accessToken', token);
                  localStorage.setItem('user', JSON.stringify(user));
                  if (user && user.id) localStorage.setItem('userId', String(user.id));
                }

                toast({ title: 'Signed in', description: 'Redirecting...', status: 'success', duration: 2000 });
                router.push('/');
              } catch (err) {
                console.error('Login error', err);
                const msg = err?.message || 'Login failed';
                // Show a longer duration so user can read debug info if present
                toast({ title: 'Login failed', description: msg, status: 'error', duration: 8000, isClosable: true });
              } finally {
                setLoading(false);
              }
            }}
          >
            Login
          </Button>

          <Text mt={4} fontSize="sm" color="gray.600">
            Don’t have an account?{" "}
            <Text as="a" color="blue.400" cursor="pointer" _hover={{ textDecoration: "underline" }} onClick={() => router.push("/signup")} >
              Sign up
            </Text>
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}
