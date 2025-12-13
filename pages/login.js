import {
  Box,
  Flex,
  Image,
  Input,
  Button,
  Text,
  Checkbox,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { login } from "../utils/authApi";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
        setLoading(true);

            const res = await login(email, password);

            console.log("LOGIN RESPONSE:", res);

            localStorage.setItem("access_token", res.access_token);

            router.push("/");
        } catch (err) {
            console.error("LOGIN ERROR:", err);
            console.error("STATUS:", err.status);
            console.error("DATA:", err.data);

            alert(
                err.data?.message ||
                `Login failed (status ${err.status})`
            );
        }
    };


  return (
    <Flex h="100vh" w="100%">
      {/* LEFT IMAGE */}
      <Box w="50%" display={{ base: "none", md: "block" }}>
        <Image
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?fm=jpg&q=60&w=3000"
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

          {/* Email */}
          <Flex
            align="center"
            w="100%"
            border="1px solid"
            borderColor="gray.300"
            h="50px"
            borderRadius="full"
            pl={4}
            mt={8}
          >
            <Input
              placeholder="Email"
              border="none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              _focus={{ boxShadow: "none" }}
            />
          </Flex>

          {/* Password */}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              _focus={{ boxShadow: "none" }}
            />
          </Flex>

          {/* Error */}
          {error && (
            <Text color="red.500" fontSize="sm" mt={3}>
              {error}
            </Text>
          )}

          <Flex
            w="100%"
            justify="space-between"
            mt={6}
            color="gray.600"
            fontSize="sm"
          >
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
            isLoading={loading}
            onClick={handleLogin}
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
