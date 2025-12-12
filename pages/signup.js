import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link,
  Select,
  InputGroup,
  InputRightElement,
  Icon,
  Image,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Flex bg="white" justify="center" align="center" minH="100vh" px={4}>
      <Box
        w="100%"
        maxW="440px"
        px={10}
        py={12}
        borderRadius="lg"
        bg="rgba(255, 255, 255, 0.8)"
        backdropFilter="blur(10px)"
        border="1px solid rgba(180, 180, 180, 0.2)"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.08)"
      >
        {/* Logo */}
        <Flex justify="center" mb={6} direction="column" align="center">
          <Image
            src="/assets/images/RentMate_logo.png"
            alt="RentMate logo"
            maxW="120px"
            objectFit="contain"
          />
          <Text fontSize="xl" fontWeight="bold" color="teal.600" mt={2}>
            RentMate
          </Text>
        </Flex>

        {/* Title */}
        <Text fontSize="2.4xl" fontWeight="semibold" textAlign="center" color="gray.900">
          Create account
        </Text>
        <Text textAlign="center" mt={2} fontSize="md" color="gray.600">
          Enter your details to continue
        </Text>

        {/* Fields */}
        <Box mt={10}>
          <FormControl mt={4}>
            <FormLabel fontSize="sm" color="gray.700">Full name</FormLabel>
            <Input placeholder="Enter your name" bg="gray.100" focusBorderColor="blue.500" />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel fontSize="sm" color="gray.700">Email</FormLabel>
            <Input placeholder="Enter your email" bg="gray.100" focusBorderColor="blue.500" />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel fontSize="sm" color="gray.700">Phone number</FormLabel>
            <Input placeholder="Enter phone number" bg="gray.100" focusBorderColor="blue.500" />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel fontSize="sm" color="gray.700">Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                bg="gray.100"
                focusBorderColor="blue.500"
              />
              <InputRightElement cursor="pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <ViewOffIcon /> : <ViewIcon />}
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel fontSize="sm" color="gray.700">Confirm password</FormLabel>
            <InputGroup>
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                bg="gray.100"
                focusBorderColor="blue.500"
              />
              <InputRightElement cursor="pointer" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <ViewOffIcon /> : <ViewIcon />}
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel fontSize="sm" color="gray.700">Select role</FormLabel>
            <Select placeholder="Choose role" bg="gray.100" focusBorderColor="blue.500">
              <option>Tenant</option>
              <option>Landlord</option>
              <option>Property Manager</option>
            </Select>
          </FormControl>
        </Box>

        {/* Button */}
        <Button
          mt={10}
          py={3}
          w="100%"
          bg="blue.600"
          color="white"
          borderRadius="md"
          fontSize="md"
          _hover={{ bg: "blue.700" }}
        >
          Sign up
        </Button>

        {/* Footer */}
        <Text textAlign="center" pt={6} color="gray.600">
          Already have an account?{" "}
          <Link href="/login" color="blue.600" fontWeight="medium" _hover={{ textDecoration: "underline" }}>
            Sign in
          </Link>
        </Text>
      </Box>
    </Flex>
  );
}
