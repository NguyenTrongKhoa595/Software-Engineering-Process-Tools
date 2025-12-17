import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { apiPost } from '../utils/apiClient';
import { useAuthStore } from '../src/store/authStore';
import {
  Box,
  Flex,
  Image,
  Input,
  Button,
  Text,
  useToast,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Checkbox,
  Link as ChakraLink,
} from '@chakra-ui/react';

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { email: email.trim(), password };
      const res = await apiPost('/auth/login', payload);

      const pick = (obj, keys) => {
        if (!obj) return null;
        for (const k of keys) {
          if (obj[k] !== undefined && obj[k] !== null) return obj[k];
        }
        return null;
      };

      let token = pick(res, ['token', 'accessToken', 'access_token']);
      let user = pick(res, ['user', 'userInfo']);
      if (!token && res.data) token = pick(res.data, ['token', 'accessToken', 'access_token']);
      if (!user && res.data) user = pick(res.data, ['user', 'userInfo']);

      if (!token || !user) {
        throw new Error('Invalid response from server.');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        if (user.id) localStorage.setItem('userId', String(user.id));
        const roleFromUser = user?.role || user?.app_role || user?.user_role || user?.roleName;
        if (roleFromUser) localStorage.setItem('role', roleFromUser);
      }

      useAuthStore.getState().setAuth(user, token);

      toast({ title: 'Signed in', status: 'success', duration: 2000 });
      router.push('/');
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Login failed.';
      toast({ title: 'Login Failed', description: message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" w="100%">
      <Box
        w={{ base: '0', md: '50%', lg: '60%' }}
        bgImage="url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?fm=jpg&q=80&w=3000')"
        bgSize="cover"
        bgPos="center"
      />

      <Flex
        w={{ base: '100%', md: '50%', lg: '40%' }}
        align="center"
        justify="center"
        p={{ base: 4, md: 8 }}
      >
        <VStack as="form" onSubmit={handleLogin} spacing={6} w={{ base: '100%', sm: '380px' }}>
          <Heading as="h1" size="xl" fontWeight="bold" textAlign="center">
            Welcome Back
          </Heading>
          <Text color="gray.500" textAlign="center">
            Sign in to access your dashboard.
          </Text>

          <FormControl id="email">
            <FormLabel>Email Address</FormLabel>
            <Input
              type="email"
              placeholder="you@example.com"
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
            />
          </FormControl>

          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="••••••••"
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
            />
          </FormControl>

          <Flex w="100%" justify="space-between" align="center">
            <Checkbox size="md">Remember me</Checkbox>
            <Link href="/forgot-password" passHref>
              <ChakraLink fontSize="sm" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                Forgot password?
              </ChakraLink>
            </Link>
          </Flex>

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            w="100%"
            isLoading={loading}
          >
            Sign In
          </Button>

          <Text fontSize="sm" color="gray.600">
            Don't have an account?{' '}
            <Link href="/signup" passHref>
              <ChakraLink color="blue.500" fontWeight="medium" _hover={{ textDecoration: 'underline' }}>
                Sign up
              </ChakraLink>
            </Link>
          </Text>
        </VStack>
      </Flex>
    </Flex>
  );
}
