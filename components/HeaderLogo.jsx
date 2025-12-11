import { Box, HStack, Heading, Image } from "@chakra-ui/react";

export default function HeaderLogo() {
  return (
    <Box py={6}>
      <HStack justify="center" spacing={3}>
        <Image
          src="/assets/images/RentMate_logo.png"
          alt="RentMate"
          boxSize="40px"
          objectFit="contain"
        />
        <Heading size="md" fontWeight="semibold">
          RentMate
        </Heading>
      </HStack>
    </Box>
  );
}
