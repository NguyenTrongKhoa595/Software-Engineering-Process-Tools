import { useState } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Textarea,
  Input,
  Button,
  Image,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { FiUploadCloud } from "react-icons/fi";
import HeaderLogo from "../../components/HeaderLogo";

export default function MaintenanceSubmitPage() {
  const [issueDate, setIssueDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const toast = useToast();

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const handleSubmit = () => {
    toast({
      title: "Request submitted",
      description: "Your maintenance request has been sent.",
      status: "success",
    });
  };

  return (
    <Flex minH="100vh" justify="center" align="flex-start" bg="gray.50" py={10}>
      <VStack spacing={10} w="100%" maxW="1000px">
        <HeaderLogo />

        {/* Main Form Card */}
        <Flex
          w="100%"
          bg="white"
          p={10}
          rounded="3xl"
          boxShadow="2xl"
          justify="space-between"
          flexWrap="wrap"
        >

          {/* Left Section */}
          <VStack align="flex-start" spacing={8} w={["100%", "45%"]}>
            <Box w="100%">
              <Text fontSize="sm" mb={1} color="gray.600">
                Issue Date
              </Text>
              <Input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                bg="white"
                borderColor="gray.300"
                rounded="md"
              />
            </Box>

            <Box w="100%">
              <Text fontSize="sm" mb={1} color="gray.600">
                Preferred Access Time
              </Text>
              <Input
                type="date"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                bg="white"
                borderColor="gray.300"
                rounded="md"
              />
            </Box>
          </VStack>

          {/* Right Section */}
          <VStack align="flex-start" spacing={6} w={["100%", "45%"]}>
            <Box w="100%">
              <Text fontSize="sm" mb={1} color="gray.600">
                Description
              </Text>
              <Textarea
                placeholder="Max 200 words"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                size="md"
                bg="gray.100"
                rounded="md"
                minH="180px"
              />
            </Box>

            {/* Upload Box */}
            <Box
              w="100%"
              border="2px dashed #C0C0C0"
              rounded="lg"
              minH="220px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              bg="white"
              _hover={{ borderColor: "blue.400" }}
            >
              <Icon as={FiUploadCloud} boxSize={10} color="blue.400" mb={3} />
              <Text fontSize="sm" color="gray.600">
                Drag and Drop here
              </Text>
              <Text fontSize="xs" color="gray.400" mb={3}>
                or
              </Text>

              <Button
                colorScheme="blue"
                size="sm"
                onClick={() => document.getElementById("file-input").click()}
              >
                Select file
              </Button>

              <input
                id="file-input"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />

              {file && (
                <Text mt={3} fontSize="xs" color="gray.700">
                  Selected: {file.name}
                </Text>
              )}
            </Box>
          </VStack>
        </Flex>

        {/* Submit Button */}
        <Button
          colorScheme="blue"
          size="lg"
          px={14}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </VStack>
    </Flex>
  );
}
