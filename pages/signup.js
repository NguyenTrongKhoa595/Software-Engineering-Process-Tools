import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Select,
  InputGroup,
  InputRightElement,
  VStack,
  Heading,
  useToast,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function SignupPage() {
  const router = useRouter();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock signup handler
  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast({ title: 'Account created (mock)', status: 'success' });
      setLoading(false);
      router.push('/login');
    }, 1000);
  };

  return (
    <Flex minH="100vh" w="100%">
      <Box
        w={{ base: '0', md: '50%', lg: '60%' }}
        bgImage="url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?fm=jpg&q=80&w=3000')"
        bgSize="cover"
        bgPos="center"
      />

      <Flex
        w={{ base: '100%', md: '50%', lg: '40%' }}
        align="center"
        justify="center"
        p={{ base: 4, md: 8 }}
      >
        <VStack as="form" onSubmit={handleSignup} spacing={4} w={{ base: '100%', sm: '380px' }}>
          <Heading as="h1" size="xl" fontWeight="bold" textAlign="center">
            Create Your Account
          </Heading>
          <Text color="gray.500" textAlign="center">
            Join RentMate to find your next home.
          </Text>

          <FormControl id="fullName">
            <FormLabel>Full Name</FormLabel>
            <Input placeholder="John Doe" size="lg" isRequired />
          </FormControl>

          <FormControl id="email">
            <FormLabel>Email Address</FormLabel>
            <Input type="email" placeholder="you@example.com" size="lg" isRequired />
          </FormControl>

          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                size="lg"
                isRequired
              />
              <InputRightElement h="100%">
                <Button variant="ghost" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl id="confirmPassword">
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                size="lg"
                isRequired
              />
              <InputRightElement h="100%">
                <Button variant="ghost" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl id="role">
            <FormLabel>I am a...</FormLabel>
            <Select placeholder="Select your role" size="lg" isRequired>
              <option value="TENANT">Tenant</option>
              <option value="LANDLORD">Landlord</option>
              <option value="PROPERTY_MANAGER">Property Manager</option>
            </Select>
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            w="100%"
            mt={4}
            isLoading={loading}
          >
            Create Account
          </Button>

          <Text fontSize="sm" color="gray.600">
            Already have an account?{' '}
            <Link href="/login" passHref>
              <ChakraLink color="blue.500" fontWeight="medium" _hover={{ textDecoration: 'underline' }}>
                Sign in
              </ChakraLink>
            </Link>
          </Text>
        </VStack>
      </Flex>
    </Flex>
  );
}
