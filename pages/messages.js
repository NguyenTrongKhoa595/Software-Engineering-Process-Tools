import { useState, useEffect } from 'react';
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
  Heading,
  SkeletonCircle,
  SkeletonText,
  Skeleton,
} from '@chakra-ui/react';
import { FiSend, FiSearch } from 'react-icons/fi';
import useRequireAuth from '@/hooks/useRequireAuth';
import PageContainer from '@/components/ui/PageContainer';
import Card from '@/components/ui/Card';

// --- Mock Data ---
const mockConversations = [
  { id: 1, name: 'Olivia Rhye', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', lastMessage: 'Sure, I can be there at 3 PM.', timestamp: '2m ago' },
  { id: 2, name: 'Phoenix Baker', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', lastMessage: 'Got it, thanks!', timestamp: '1h ago' },
  { id: 3, name: 'Lana Steiner', avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100', lastMessage: 'Can you send over the documents?', timestamp: 'yesterday' },
];

const mockChat = [
  { from: 'other', text: 'Hey! Is the apartment on 5th Ave still available?' },
  { from: 'me', text: 'Hi there! Yes, it is. Are you interested in a tour?' },
  { from: 'other', text: 'Definitely! When are you free?' },
];

// --- Skeleton Component ---
const MessagesSkeleton = () => (
  <Flex h="calc(100vh - 120px)" gap={4}>
    <Card w={{ base: '100%', md: '350px' }} p={0} overflow="hidden">
      <Box p={4}><SkeletonText noOfLines={1} w="120px" /></Box>
      <Divider />
      <VStack spacing={1} p={2}>
        {[...Array(3)].map((_, i) => (
          <HStack key={i} w="100%" p={3} spacing={3}>
            <SkeletonCircle size="10" />
            <VStack align="start" w="100%">
              <Skeleton h="16px" w="80%" />
              <Skeleton h="12px" w="60%" />
            </VStack>
          </HStack>
        ))}
      </VStack>
    </Card>
    <Card flex={1} display={{ base: 'none', md: 'flex' }} />
  </Flex>
);

// --- Main Page Component ---
export default function MessagesPage() {
  const canRender = useRequireAuth();
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(1);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (!canRender) return null;

  return (
    <PageContainer maxW="1400px">
      {loading ? <MessagesSkeleton /> : (
        <Flex h="calc(100vh - 120px)" gap={4}>
          {/* Conversation List */}
          <Card w={{ base: '100%', md: '350px' }} p={0} overflow="hidden">
            <Box p={4}><Heading size="md">Conversations</Heading></Box>
            <Divider />
            <VStack spacing={1} p={2} align="stretch">
              {mockConversations.map(c => (
                <ConversationItem key={c.id} conv={c} isActive={c.id === selectedId} onClick={() => setSelectedId(c.id)} />
              ))}
            </VStack>
          </Card>

          {/* Chat Window */}
          <Card flex={1} display={{ base: 'none', md: 'flex' }} flexDirection="column" p={0} overflow="hidden">
            <ChatHeader name={mockConversations.find(c => c.id === selectedId)?.name} />
            <VStack flex={1} p={6} spacing={4} overflowY="auto" bg="gray.50">
              {mockChat.map((msg, i) => <MessageBubble key={i} from={msg.from} text={msg.text} />)}
            </VStack>
            <MessageInput />
          </Card>
        </Flex>
      )}
    </PageContainer>
  );
}

// --- Sub-components ---
const ConversationItem = ({ conv, isActive, onClick }) => (
  <HStack
    p={3}
    spacing={3}
    borderRadius="lg"
    cursor="pointer"
    bg={isActive ? 'blue.50' : 'transparent'}
    _hover={{ bg: 'gray.100' }}
    onClick={onClick}
  >
    <Avatar name={conv.name} src={conv.avatarUrl} />
    <VStack align="start" spacing={0} flex={1} overflow="hidden">
      <HStack justify="space-between" w="100%">
        <Text fontWeight="bold" noOfLines={1}>{conv.name}</Text>
        <Text fontSize="xs" color="gray.500" whiteSpace="nowrap">{conv.timestamp}</Text>
      </HStack>
      <Text fontSize="sm" color="gray.500" noOfLines={1}>{conv.lastMessage}</Text>
    </VStack>
  </HStack>
);

const ChatHeader = ({ name }) => (
  <HStack p={4} borderBottomWidth="1px">
    <Heading size="sm">{name}</Heading>
  </HStack>
);

const MessageBubble = ({ from, text }) => (
  <Flex w="100%" justify={from === 'me' ? 'flex-end' : 'flex-start'}>
    <Box
      bg={from === 'me' ? 'blue.500' : 'gray.200'}
      color={from === 'me' ? 'white' : 'black'}
      px={4} py={2}
      maxW="80%"
      borderRadius="2xl"
      borderBottomLeftRadius={from === 'other' ? 0 : '2xl'}
      borderBottomRightRadius={from === 'me' ? 0 : '2xl'}
    >
      {text}
    </Box>
  </Flex>
);

const MessageInput = () => (
  <HStack p={4} borderTopWidth="1px" bg="white">
    <Input placeholder="Type a message..." size="lg" />
    <IconButton icon={<FiSend />} colorScheme="blue" size="lg" aria-label="Send message" />
  </HStack>
);
