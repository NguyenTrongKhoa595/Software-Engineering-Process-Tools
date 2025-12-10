// pages/profile/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { apiGet, apiPut } from "../../utils/apiClient";
import {
    Box,
    Flex,
    Avatar,
    Text,
    Input,
    Button,
    HStack,
    VStack,
    Spacer,
    Tag,
    TagLabel,
    IconButton,
    Divider,
    Spinner,
    Heading,
    useToast
} from "@chakra-ui/react";

import { FiEdit2, FiFileText, FiLogOut } from "react-icons/fi";
import { CloseIcon } from "@chakra-ui/icons";

const ROLE_LABELS = {
    LANDLORD: "Landlord",
    TENANT: "Tenant",
    PROPERTY_MANAGER: "Tenant",
    ADMIN: "Admin",
};

export default function ProfilePage() {
    const router = useRouter();
    const { id } = router.query;
    const toast = useToast();

    const [user, setUser] = useState(null);
    const [linkedLandlord, setLinkedLandlord] = useState(null);
    const [linkedManager, setLinkedManager] = useState(null);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id) return;

        const loadProfile = async () => {
            try {
                setLoading(true);
                const data = await apiGet(`/users/${id}`);

                setUser(data);
                setForm({
                    fullName: data.fullName || "",
                    email: data.email || "",
                    phoneNumber: data.phoneNumber || "",
                    password: ""
                });

                if (data.landlord) setLinkedLandlord(data.landlord);
                if (data.manager) setLinkedManager(data.manager);

            } catch (err) {
                console.error("Failed to load profile:", err);
                toast({ status: "error", title: "Failed to load profile" });
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [id, toast]);

    const handleSave = async () => {
        if (!id) return;

        setSaving(true);
        try {
            const body = {
                fullName: form.fullName || null,
                email: form.email || null,
                phoneNumber: form.phoneNumber || null
            };

            const updated = await apiPut(`/users/${id}`, body);
            setUser(updated);

            toast({ status: "success", title: "Profile updated" });

        } catch (err) {
            console.error(err);
            toast({ status: "error", title: "Failed to save profile" });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.push("/login");
    };

    const goToProfile = (targetId) => router.push(`/profile/${targetId}`);

    const renderField = (label, field, placeholder = "") => (
        <Box mb={4}>
            <HStack align="center" spacing={6}>
                <Box minW="140px">
                    <Text fontSize="sm" color="gray.500">{label}</Text>
                </Box>

                <HStack
                    flex="1"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    pb={1}
                    spacing={2}
                >
                    <Input
                        variant="unstyled"
                        textAlign="right"
                        placeholder={placeholder}
                        value={form[field]}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, [field]: e.target.value }))
                        }
                    />
                    <IconButton
                        aria-label={`Edit ${label}`}
                        icon={<FiEdit2 />}
                        size="sm"
                        variant="ghost"
                    />
                </HStack>
            </HStack>
        </Box>
    );

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

                        <IconButton
                            aria-label="Close"
                            icon={<CloseIcon boxSize={3} />}
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/")}
                        />
                    </HStack>

                    <HStack spacing={4} mb={6}>
                        <Avatar
                            size="xl"
                            name={user.fullName}
                            src={user.avatarUrl || undefined}
                        />
                        <VStack align="start" spacing={1}>
                            <Text fontWeight="semibold">{user.fullName}</Text>
                            <Text fontSize="sm" color="gray.500">{user.email}</Text>
                        </VStack>
                    </HStack>

                    <Divider mb={6} />

                    {renderField("Name", "fullName", "your name")}
                    {renderField("Email account", "email", "yourname@gmail.com")}
                    {renderField("Phone number", "phoneNumber", "Add number")}

                    {/* Password field */}
                    <Box mt={2}>
                        <HStack align="center" spacing={6}>
                            <Box minW="140px">
                                <Text fontSize="sm" color="gray.500">Password</Text>
                            </Box>

                            <HStack
                                flex="1"
                                borderBottom="1px solid"
                                borderColor="gray.200"
                                pb={1}
                                spacing={2}
                            >
                                <Input
                                    variant="unstyled"
                                    type="password"
                                    placeholder="***********"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            password: e.target.value
                                        }))
                                    }
                                />
                                <IconButton
                                    aria-label="Change password"
                                    icon={<FiEdit2 />}
                                    size="sm"
                                    variant="ghost"
                                />
                            </HStack>
                        </HStack>
                    </Box>

                    <HStack mt={10} spacing={4}>
                        <Button
                            leftIcon={<FiFileText />}
                            variant="outline"
                            colorScheme="blue"
                        >
                            Personal Documents
                        </Button>

                        <Spacer />

                        <Button
                            colorScheme="blue"
                            onClick={handleSave}
                            isLoading={saving}
                        >
                            Save Change
                        </Button>
                    </HStack>

                    <Flex justify="flex-end" mt={6}>
                        <Button
                            leftIcon={<FiLogOut />}
                            colorScheme="red"
                            onClick={handleLogout}
                        >
                            Sign out
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        </Flex>
    );
}
