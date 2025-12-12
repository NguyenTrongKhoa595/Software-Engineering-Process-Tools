import { Box, Flex, Image, Input, Button, Text, Checkbox } from "@chakra-ui/react";
import { useRouter } from 'next/router';

export default function LoginPage() {

  const router = useRouter();

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
            <Input placeholder="Email id" border="none" _focus={{ boxShadow: "none" }} />
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
            <Input type="password" placeholder="Password" border="none" _focus={{ boxShadow: "none" }} />
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
