import { Box, Heading, HStack, Image } from "@chakra-ui/react";

export default function HeaderLogo() {
  return (
    <HStack spacing={3}>
      <Image
        src="/assets/images/RentMate_logo.png"
        alt="RentMate"
        boxSize="40px"
        objectFit="contain"
      />
      <Heading size="lg" color="blue.600">
        RentMate
      </Heading>
    </HStack>
  );
}
