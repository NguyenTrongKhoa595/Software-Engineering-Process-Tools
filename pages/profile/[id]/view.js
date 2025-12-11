// pages/profile/[id]/view.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { apiGet } from "../../../utils/apiClient";
import {
  Box,
  Flex,
  Avatar,
  Text,
  VStack,
  HStack,
  Tag,
  TagLabel,
  Heading,
  Spinner,
  Divider,
} from "@chakra-ui/react";

const ROLE_LABELS = {
  LANDLORD: "Landlord",
  TENANT: "Tenant",
  PROPERTY_MANAGER: "Tenant",
  ADMIN: "Admin",
};

export default function PublicProfileView() {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await apiGet(`/users/${id}`);
        if (mounted) setUser(data);
      } catch (e) {
        console.error("Failed to load public profile", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, [id]);

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!user) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Text>Profile not found.</Text>
      </Flex>
    );
  }

  const roleLabel = ROLE_LABELS[user.role] || "Tenant";

  return (
    <Flex direction="column" minH="100vh" bg="gray.50">
      <Box py={6}>
        <HStack justify="center" spacing={3}>
          <Box
            w="40px"
            h="40px"
            borderRadius="full"
            bgGradient="linear(to-tr, pink.400, purple.500, orange.400)"
          />
          <Heading size="md">RentMate</Heading>
        </HStack>
      </Box>

      <Flex
        flex="1"
        maxW="1200px"
        mx="auto"
        mb={10}
        bg="white"
        rounded="3xl"
        boxShadow="2xl"
        overflow="hidden"
      >
        <Box
          flex="1"
          bgImage="url('/images/profile-hero.jpg')"
          bgSize="cover"
          bgPos="center"
          minH="480px"
        />

        <Box flex="1" px={12} py={10}>
          <HStack justify="space-between" mb={8}>
            <Tag size="sm" borderRadius="full" variant="subtle">
              <TagLabel>{roleLabel}</TagLabel>
            </Tag>
          </HStack>

          <HStack spacing={4} mb={6}>
            <Avatar size="xl" name={user.fullName} src={user.avatarUrl || undefined} />
            <VStack align="start" spacing={1}>
              <Text fontWeight="semibold">{user.fullName}</Text>
              <Text fontSize="sm" color="gray.500">{user.email}</Text>
            </VStack>
          </HStack>

          <Divider mb={6} />

          <VStack align="stretch" spacing={4}>
            <Box>
              <Text fontSize="sm" color="gray.500">Name</Text>
              <Text fontSize="md">{user.fullName || "-"}</Text>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.500">Email</Text>
              <Text fontSize="md">{user.email || "-"}</Text>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.500">Phone number</Text>
              <Text fontSize="md">{user.phoneNumber || "-"}</Text>
            </Box>

            {/* Optionally show linked landlord/manager names */}
            {/* Show linked landlord only when viewing a Property Manager */}
            {user.role === "PROPERTY_MANAGER" && user.landlord && (
              <Box>
                <Text fontSize="sm" color="gray.500">Linked landlord</Text>
                <HStack
                  spacing={3}
                  mt={1}
                  cursor="pointer"
                  onClick={() => router.push(`/profile/${user.landlord.id}/view`)}
                >
                  <Avatar size="sm" name={user.landlord.fullName} src={user.landlord.avatarUrl || undefined} />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="md">{user.landlord.fullName || user.landlord.email}</Text>
                    <Text fontSize="xs" color="gray.500">View profile</Text>
                  </VStack>
                </HStack>
              </Box>
            )}

            {/* Show linked manager only when viewing a Landlord */}
            {user.role === "LANDLORD" && user.manager && (
              <Box>
                <Text fontSize="sm" color="gray.500">Linked manager</Text>
                <HStack
                  spacing={3}
                  mt={1}
                  cursor="pointer"
                  onClick={() => router.push(`/profile/${user.manager.id}/view`)}
                >
                  <Avatar size="sm" name={user.manager.fullName} src={user.manager.avatarUrl || undefined} />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="md">{user.manager.fullName || user.manager.email}</Text>
                    <Text fontSize="xs" color="gray.500">View profile</Text>
                  </VStack>
                </HStack>
              </Box>
            )}
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
}
