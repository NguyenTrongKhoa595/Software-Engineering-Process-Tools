import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  AlertDescription,
  Icon,
  Image,
  FormErrorMessage,
} from '@chakra-ui/react';
import {
  FiUpload,
  FiX,
  FiHome,
  FiMapPin,
  FiDollarSign,
  FiCheckCircle,
} from 'react-icons/fi';

export default function LandlordCreate() {
  const fileInputRef = useRef(null);
  const [previews, setPreviews] = useState([]); 
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  function showMessage(type, text) {
    setMessage({ type, text });
    if (type === 'success') setTimeout(() => setMessage(null), 3000);
  }

  function processFiles(filesArray) {
    if (!filesArray || !filesArray.length) return;
    const files = Array.from(filesArray);

    const maxFiles = 10;
    if (previews.length + files.length > maxFiles) {
      showMessage('error', `You can upload a maximum of ${maxFiles} images`);
      return;
    }

    const newPreviews = [];
    for (let i = 0; i < files.length && newPreviews.length + previews.length < maxFiles; i++) {
      const file = files[i];
      if (!file.type.match('image.*')) continue;
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showMessage('error', `File ${file.name} exceeds 5MB and was skipped.`);
        continue;
      }
      const url = URL.createObjectURL(file);
      newPreviews.push({ id: `${Date.now()}-${i}-${file.name}`, url, file });
    }

    if (newPreviews.length) {
      setPreviews(prev => [...prev, ...newPreviews]);
      setErrors(prev => ({ ...prev, photos: undefined }));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleFilesSelected(e) {
    processFiles(e.target.files);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  }

  function removePreview(id) {
    setPreviews(prev => {
      const next = prev.filter(p => p.id !== id);
      prev.forEach(p => { if (p.id === id) URL.revokeObjectURL(p.url); });
      return next;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    showMessage('success', 'Property listing submitted successfully!');
    setTimeout(() => {
      setPreviews(prev => {
        prev.forEach(p => URL.revokeObjectURL(p.url));
        return [];
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 800);
  }

  function validateForm() {
    const propertyName = (document.getElementById('propertyName') || {}).value || '';
    const propertyDescription = (document.getElementById('propertyDescription') || {}).value || '';
    const priceVal = (document.getElementById('price') || {}).value || '';
    const categoryVal = (document.getElementById('category') || {}).value || '';
    const locationVal = (document.getElementById('location') || {}).value || '';

    const newErrors = {};
    if (!propertyName.trim()) newErrors.propertyName = 'Please enter the property name';
    if (!propertyDescription.trim()) newErrors.propertyDescription = 'Please provide a short description';

    const price = Number(priceVal);
    if (!priceVal || Number.isNaN(price) || price <= 0) newErrors.price = 'Please enter a valid price greater than 0';

    if (!categoryVal.trim()) newErrors.category = 'Please enter the property category (e.g., Villa, Apartment)';
    if (!locationVal.trim()) newErrors.location = 'Please enter the property location';

    if (previews.length === 0) newErrors.photos = 'Please upload at least one photo of the property';

    setErrors(newErrors);

    const firstKey = Object.keys(newErrors)[0];
    if (firstKey) {
      const el = document.getElementById(firstKey);
      if (el) el.focus();
      showMessage('error', newErrors[firstKey]);
      return false;
    }

    return true;
  }

  return (
    <>
      <Head>
        <title>Create New Property</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box bg="gray.50" minH="100vh">
        <Container maxW="1400px" px={{ base: 4, md: 10 }} py={8}>
          <Heading size="xl" color="purple.800" mb={8}>
            Create New Property Listing
          </Heading>

          <form onSubmit={handleSubmit}>
            <Flex direction={{ base: 'column', lg: 'row' }} gap={12} columnGap={{ lg: 12 }}>
              {/* Left Column - Property Details */}
              <Box flex="1" maxW={{ lg: '50%' }} pr={{ lg: 8 }}>
                <Box bg="white" p={6} borderRadius="xl" boxShadow="md">
                  <Heading size="lg" color="gray.800" mb={6}>
                    Property Details
                  </Heading>

                  <VStack spacing={6} align="stretch">
                    <FormControl isInvalid={errors.propertyName}>
                      <FormLabel htmlFor="propertyName" fontSize="sm" fontWeight="medium" color="gray.700">
                        Property Name
                      </FormLabel>
                      <Input
                        id="propertyName"
                        name="propertyName"
                        onChange={() => setErrors(prev => ({ ...prev, propertyName: undefined }))}
                        focusBorderColor="purple.500"
                      />
                      <FormErrorMessage fontSize="xs">{errors.propertyName}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.propertyDescription}>
                      <FormLabel htmlFor="propertyDescription" fontSize="sm" fontWeight="medium" color="gray.700">
                        Description
                      </FormLabel>
                      <Textarea
                        id="propertyDescription"
                        name="propertyDescription"
                        rows={4}
                        onChange={() => setErrors(prev => ({ ...prev, propertyDescription: undefined }))}
                        focusBorderColor="purple.500"
                      />
                      <FormErrorMessage fontSize="xs">{errors.propertyDescription}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.photos}>
                      <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                        Upload Photos (Max 10)
                      </FormLabel>
                      <Box
                        border="2px"
                        borderStyle="dashed"
                        borderColor={isDragging ? 'purple.400' : 'gray.300'}
                        bg={isDragging ? 'purple.50' : 'white'}
                        borderRadius="lg"
                        p={4}
                        textAlign="center"
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                        onDrop={handleDrop}
                      >
                        <HStack justify="center" spacing={2} color="gray.500" mb={2}>
                          <Icon as={FiUpload} />
                          <Text fontSize="sm">Drag & drop photos here or click to browse</Text>
                        </HStack>
                        <input
                          ref={fileInputRef}
                          type="file"
                          id="propertyPhotos"
                          style={{ display: 'none' }}
                          multiple
                          accept="image/*"
                          onChange={handleFilesSelected}
                        />
                        <Button
                          colorScheme="purple"
                          size="sm"
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        >
                          Select Files
                        </Button>
                        <Text fontSize="xs" color="gray.500" mt={2}>
                          JPEG or PNG, maximum 5MB each
                        </Text>
                        {errors.photos && (
                          <Text fontSize="xs" color="red.600" mt={2}>
                            {errors.photos}
                          </Text>
                        )}

                        {previews.length > 0 && (
                          <Grid templateColumns="repeat(3, 1fr)" gap={2} mt={4}>
                            {previews.map(p => (
                              <Box key={p.id} position="relative" role="group">
                                <Image
                                  src={p.url}
                                  alt="Preview"
                                  w="100%"
                                  h="24"
                                  objectFit="cover"
                                  borderRadius="md"
                                />
                                <Button
                                  position="absolute"
                                  top={1}
                                  right={1}
                                  size="xs"
                                  colorScheme="red"
                                  borderRadius="full"
                                  p={1}
                                  minW="auto"
                                  h="auto"
                                  opacity={0}
                                  _groupHover={{ opacity: 1 }}
                                  transition="opacity 0.2s"
                                  onClick={() => removePreview(p.id)}
                                >
                                  <Icon as={FiX} boxSize={3} />
                                </Button>
                              </Box>
                            ))}
                          </Grid>
                        )}
                      </Box>
                    </FormControl>
                  </VStack>
                </Box>
              </Box>

              {/* Right Column - Property Specifications */}
              <Box flex="1" maxW={{ lg: '50%' }} ml={{ lg: 8 }}>
                <Box bg="white" p={6} borderRadius="xl" boxShadow="md">
                  <Heading size="lg" color="gray.800" mb={6}>
                    Property Specifications
                  </Heading>

                  <VStack spacing={6} align="stretch">
                    <FormControl isInvalid={errors.category}>
                      <FormLabel htmlFor="category" fontSize="sm" fontWeight="medium" color="gray.700">
                        <HStack spacing={1}>
                          <Icon as={FiHome} boxSize={3} />
                          <Text>Category</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        id="category"
                        name="category"
                        placeholder="e.g., Villa, Apartment, Townhouse"
                        onChange={() => setErrors(prev => ({ ...prev, category: undefined }))}
                        focusBorderColor="purple.500"
                      />
                      <FormErrorMessage fontSize="xs">{errors.category}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.location}>
                      <FormLabel htmlFor="location" fontSize="sm" fontWeight="medium" color="gray.700">
                        <HStack spacing={1}>
                          <Icon as={FiMapPin} boxSize={3} />
                          <Text>Location</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        id="location"
                        name="location"
                        placeholder="e.g., Jumeirah Village, Downtown"
                        onChange={() => setErrors(prev => ({ ...prev, location: undefined }))}
                        focusBorderColor="purple.500"
                      />
                      <FormErrorMessage fontSize="xs">{errors.location}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.price}>
                      <FormLabel htmlFor="price" fontSize="sm" fontWeight="medium" color="gray.700">
                        <HStack spacing={1}>
                          <Icon as={FiDollarSign} boxSize={3} />
                          <Text>Price</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Property price"
                        onChange={() => setErrors(prev => ({ ...prev, price: undefined }))}
                        focusBorderColor="purple.500"
                      />
                      <FormErrorMessage fontSize="xs">{errors.price}</FormErrorMessage>
                    </FormControl>

                    <Box pt={4}>
                      <Button
                        type="submit"
                        colorScheme="purple"
                        size="lg"
                        w="100%"
                        leftIcon={<Icon as={FiCheckCircle} />}
                      >
                        Submit for Leasing
                      </Button>
                    </Box>

                    {message && (
                      <Alert
                        status={message.type === 'error' ? 'error' : 'success'}
                        borderRadius="md"
                      >
                        <AlertIcon />
                        <AlertDescription fontSize="sm">
                          {message.text}
                        </AlertDescription>
                      </Alert>
                    )}
                  </VStack>
                </Box>
              </Box>
            </Flex>
          </form>
        </Container>
      </Box>
    </>
  );
}