import { Box, Flex, Image, Input, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <Flex h="100vh" w="100%">
      {/* LEFT IMAGE */}
      <Box w="50%" display={{ base: "none", md: "block" }}>
        <Image
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D"
          alt="forgot password"
          h="100%"
          w="100%"
          objectFit="cover"
        />
      </Box>

      {/* RIGHT SIDE  */}
      <Flex w={{ base: "100%", md: "50%" }} align="center" justify="center">
        <Box w={{ base: "80%", md: "350px" }} textAlign="center">
          <Text fontSize="4xl" fontWeight="medium" color="gray.800">
            Forgot Password
          </Text>
          <Text fontSize="sm" color="gray.500" mt={3}>
            Enter your email and we’ll send you reset instructions.
          </Text>

          <Flex
            align="center"
            w="100%"
            mt={10}
            border="1px solid"
            borderColor="gray.300"
            h="50px"
            borderRadius="full"
            pl={4}
            gap={2}
          >
            <Input placeholder="Email id" border="none" _focus={{ boxShadow: "none" }} />
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
            Send Reset Link
          </Button>

          <Text mt={4} fontSize="sm" color="gray.600">
            Remember your password?{" "}
            <Text
              as="a"
              color="blue.400"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
              onClick={() => router.push("/login")}
            >
              Back to Login
            </Text>
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}
