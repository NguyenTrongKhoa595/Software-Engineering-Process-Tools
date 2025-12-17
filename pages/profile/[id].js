import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Avatar,
  Text,
  Input,
  Button,
  HStack,
  VStack,
  Divider,
  Spinner,
  useToast,
  FormControl,
  FormLabel,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Heading,
} from '@chakra-ui/react';
import { FiUser, FiShield, FiFileText, FiLogOut } from 'react-icons/fi';
import useRequireAuth from '../../src/hooks/useRequireAuth';
import { useAuth } from '../../src/hooks/useAuth';
import { apiGet, apiPut } from '../../utils/apiClient';
import PageContainer from '../../src/components/ui/PageContainer';
import Card from '../../src/components/ui/Card';

// --- Skeleton Component ---
const ProfileSkeleton = () => (
  <PageContainer>
    <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
      <Box w={{ base: '100%', md: '300px' }}>
        <SkeletonCircle size="120px" mx="auto" />
        <Skeleton h="20px" w="60%" mx="auto" mt={4} />
        <Skeleton h="16px" w="80%" mx="auto" mt={2} />
        <SkeletonText mt={6} noOfLines={3} spacing="4" />
      </Box>
      <Box flex={1}>
        <Skeleton h="300px" borderRadius="xl" />
      </Box>
    </Flex>
  </PageContainer>
);

// --- Main Page Component ---
export default function ProfilePage() {
  const canRender = useRequireAuth();
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();
  const { user: authUser, logout } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!id) return;
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await apiGet(`/users/${id}`);
        setUser(data);
      } catch (err) {
        toast({ status: 'error', title: 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id, toast]);

  const handleSave = async (formData) => {
    try {
      const updated = await apiPut(`/users/${id}`, formData);
      setUser(updated);
      toast({ title: 'Profile updated', status: 'success' });
    } catch (err) {
      toast({ title: 'Update failed', description: err.message, status: 'error' });
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!canRender || loading) return <ProfileSkeleton />;
  if (!user) return <PageContainer><Text>User not found.</Text></PageContainer>;

  return (
    <PageContainer>
      <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 6, lg: 10 }}>
        {/* Left Sidebar */}
        <Card w={{ base: '100%', md: '300px' }} p={6} align="center" h="fit-content">
          <Avatar size="xl" name={user.fullName} src={user.avatarUrl} mb={4} />
          <Text fontWeight="bold" fontSize="xl">{user.fullName}</Text>
          <Text color="gray.500">{user.email}</Text>
          <Divider my={6} />
          <VStack as="nav" w="100%" spacing={2} align="stretch">
            <SidebarButton icon={FiUser} label="Profile" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            <SidebarButton icon={FiShield} label="Security" isActive={activeTab === 'security'} onClick={() => setActiveTab('security')} />
            <SidebarButton icon={FiFileText} label="Documents" isActive={activeTab === 'documents'} onClick={() => setActiveTab('documents')} />
            <SidebarButton icon={FiLogOut} label="Sign Out" color="red.500" onClick={handleLogout} />
          </VStack>
        </Card>

        {/* Right Content */}
        <Box flex={1}>
          {activeTab === 'profile' && <ProfileContent user={user} onSave={handleSave} />}
          {activeTab === 'security' && <SecurityContent />}
          {activeTab === 'documents' && <Text>Documents content goes here.</Text>}
        </Box>
      </Flex>
    </PageContainer>
  );
}

// --- Sub-components for Tabs ---
const SidebarButton = ({ icon, label, isActive, ...props }) => (
  <Button
    leftIcon={icon && <Box as={icon} />}
    justifyContent="flex-start"
    variant={isActive ? 'solid' : 'ghost'}
    colorScheme={isActive ? 'blue' : 'gray'}
    w="100%"
    {...props}
  >
    {label}
  </Button>
);

const ProfileContent = ({ user, onSave }) => {
  const [form, setForm] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
  <Card p={{ base: 6, md: 8 }}>
    <Heading size="lg" mb={6}>Personal Information</Heading>
    <VStack spacing={4}>
      <FormControl>
        <FormLabel>Full Name</FormLabel>
        <Input name="fullName" value={form.fullName} onChange={handleChange} size="lg" />
      </FormControl>
      <FormControl>
        <FormLabel>Email Address</FormLabel>
        <Input name="email" type="email" value={form.email} onChange={handleChange} size="lg" />
      </FormControl>
      <FormControl>
        <FormLabel>Phone Number</FormLabel>
        <Input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} size="lg" />
      </FormControl>
      <Button colorScheme="blue" size="lg" alignSelf="flex-end" mt={4} onClick={() => onSave(form)}>
        Save Changes
      </Button>
    </VStack>
  </Card>
  );
};

const SecurityContent = () => (
  <Card p={{ base: 6, md: 8 }}>
    <Heading size="lg" mb={6}>Change Password</Heading>
    <VStack spacing={4}>
      <FormControl>
        <FormLabel>Current Password</FormLabel>
        <Input type="password" placeholder="••••••••" size="lg" />
      </FormControl>
      <FormControl>
        <FormLabel>New Password</FormLabel>
        <Input type="password" placeholder="••••••••" size="lg" />
      </FormControl>
      <FormControl>
        <FormLabel>Confirm New Password</FormLabel>
        <Input type="password" placeholder="••••••••" size="lg" />
      </FormControl>
      <Button colorScheme="blue" size="lg" alignSelf="flex-end" mt={4}>
        Update Password
      </Button>
    </VStack>
  </Card>
);
