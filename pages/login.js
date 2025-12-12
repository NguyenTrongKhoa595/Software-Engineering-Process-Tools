// pages/login.js
import { Box, Flex, Image, Input, Button, Text, Checkbox } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { apiClient } from "../utils/apiClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const result = await apiClient("http://localhost:8081/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      console.log("LOGIN SUCCESS:", result);

      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      setErrorMessage("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <Flex h="100vh" w="100%">
      {/* LEFT IMAGE */}
      <Box w="50%" display={{ base: "none", md: "block" }}>
        <Image
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716"
          alt="login"
          h="100%"
          w="100%"
          objectFit="cover"
        />
      </Box>

      {/* RIGHT LOGIN SIDE */}
      <Flex w={{ base: "100%", md: "50%" }} align="center" justify="center">
        <Box w={{ base: "80%", md: "350px" }} textAlign="center">
          <Text fontSize="4xl" fontWeight="medium">
            Sign in
          </Text>

          {errorMessage && (
            <Text color="red.400" mt={4}>
              {errorMessage}
            </Text>
          )}

          <Flex
            align="center"
            w="100%"
            border="1px solid"
            borderColor="gray.300"
            h="50px"
            borderRadius="full"
            pl={4}
            mt={5}
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
            <Text
              as="a"
              textDecoration="underline"
              cursor="pointer"
              onClick={() => router.push("/forgot-password")}
            >
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
            onClick={handleLogin}
            isLoading={loading}
          >
            Login
          </Button>

          <Text mt={4} fontSize="sm" color="gray.600">
            Don’t have an account?{" "}
            <Text
              as="a"
              color="blue.400"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
              onClick={() => router.push("/signup")}
            >
              Sign up
            </Text>
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}
