import { IconButton, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, VStack, HStack, Text, Avatar } from '@chakra-ui/react';
import { MdNotifications } from 'react-icons/md';
import { notifications } from '../utils/notification';

const NotificationDropdown = () => {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <IconButton
          aria-label="Notifications"
          icon={<MdNotifications size={24} />}
          variant="ghost"
        />
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

export default NotificationDropdown;
