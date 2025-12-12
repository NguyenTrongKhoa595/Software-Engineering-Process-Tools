import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Avatar,
  Input,
  IconButton,
  Divider,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";

export default function MessagesPage() {
  const [selectedUser, setSelectedUser] = useState("John Doe");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { from: "manager", text: "Hello John, how can I assist you today?" },
    { from: "customer", text: "I’m interested in the apartment on Main St." },
    { from: "manager", text: "Great choice! When would you like to visit?" },
  ]);

  const users = [
    { name: "John Doe", online: true },
    { name: "Emily Chen", online: false },
    { name: "David Nguyen", online: true },
    { name: "Sophia Lee", online: false },
  ];

  const sendMessage = () => {
    if (message.trim() === "") return;
    setChat([...chat, { from: "manager", text: message }]);
    setMessage("");
  };

  return (
    <Flex height="92vh" p={3} mt={2} gap={3} >
      {/* Sidebar */}
      <Box
        w="300px"
        bg={useColorModeValue("white", "gray.800")}
        shadow="sm"
        borderRadius="xl"
        overflow="hidden"
      >
        <Text fontWeight="bold" fontSize="xl" p={4}>
          Messages
        </Text>

        <Divider />

        <VStack spacing={1} align="stretch" maxH="83vh" overflowY="auto" p={2}>
          {users.map((u) => (
            <HStack
              key={u.name}
              p={3}
              borderRadius="lg"
              cursor="pointer"
              transition="0.2s"
              bg={selectedUser === u.name ? "blue.50" : "transparent"}
              _hover={{ bg: "blue.100" }}
              onClick={() => setSelectedUser(u.name)}
              spacing={3}
            >
              <Box position="relative">
                <Avatar size="sm" name={u.name} />
                {u.online && (
                  <Badge
                    position="absolute"
                    bottom="0"
                    right="0"
                    bg="green.400"
                    borderRadius="full"
                    boxSize="10px"
                  ></Badge>
                )}
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontWeight="medium">{u.name}</Text>
                <Text fontSize="xs" color="gray.500">
                  {u.online ? "Online" : "Offline"}
                </Text>
              </VStack>
            </HStack>
          ))}
        </VStack>
      </Box>

      {/* Chat Window */}
      <Flex
        flex="1"
        direction="column"
        bg={useColorModeValue("white", "gray.800")}
        shadow="sm"
        borderRadius="xl"
      >
        {/* Header */}
        <HStack p={4} spacing={3} borderBottom="1px solid #e7e7e7">
          <Avatar size="sm" name={selectedUser} />
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold">{selectedUser}</Text>
            <Text fontSize="xs" color="green.500">
              Online
            </Text>
          </VStack>
        </HStack>

        {/* Messages */}
        <VStack
          flex="1"
          p={5}
          spacing={4}
          overflowY="auto"
          align="stretch"
          bg={useColorModeValue("#f0f2f5", "gray.700")}
        >
          {chat.map((m, index) => (
            <Flex key={index} justify={m.from === "manager" ? "flex-end" : "flex-start"}>
              <Box
                bg={m.from === "manager" ? "blue.500" : "gray.300"}
                color={m.from === "manager" ? "white" : "black"}
                px={4}
                py={2}
                borderRadius="2xl"
                borderBottomRightRadius={m.from === "manager" ? "0" : "2xl"}
                borderBottomLeftRadius={m.from !== "manager" ? "0" : "2xl"}
                maxW="70%"
                fontSize="sm"
                shadow="md"
              >
                {m.text}
              </Box>
            </Flex>
          ))}
        </VStack>

        {/* Message Input */}
        <HStack p={4} borderTop="1px solid #e7e7e7" spacing={3}>
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            bg={useColorModeValue("white", "gray.600")}
            borderRadius="full"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <IconButton
            icon={<FiSend />}
            colorScheme="blue"
            borderRadius="full"
            size="lg"
            onClick={sendMessage}
          />
        </HStack>
      </Flex>
    </Flex>
  );
}