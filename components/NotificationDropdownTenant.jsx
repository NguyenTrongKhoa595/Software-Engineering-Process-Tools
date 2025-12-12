import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, VStack, HStack, Text, Avatar, Flex, Box } from '@chakra-ui/react';
import { BsBell } from 'react-icons/bs';
import { notifications } from '../utils/notification';

const NotificationDropdownTenant = () => {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Box>
          <Flex
            w="42px"
            h="42px"
            border="1px solid #ddd"
            borderRadius="full"
            align="center"
            justify="center"
            cursor="pointer"
            transition="0.2s"
            color="white"
            _hover={{ bg: "gray.50" }}
          >
            <BsBell size={18} />
          </Flex>
        </Box>
      </PopoverTrigger>

      <PopoverContent w="350px">
        <PopoverArrow />
        <PopoverHeader fontWeight="bold">Notifications</PopoverHeader>

        <PopoverBody>
          <VStack align="stretch" spacing="4">
            {notifications.map((item, i) => (
              <HStack key={i} align="start" spacing="3">
                <Avatar name={item.sender} size="sm" />
                <VStack align="start" spacing="1">
                  <Text fontWeight="semibold">{item.sender}</Text>
                  <Text fontSize="sm" color="gray.600">{item.message}</Text>
                  <Text fontSize="xs" color="gray.500">{item.timeAgo}</Text>
                </VStack>
              </HStack>
            ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdownTenant;
