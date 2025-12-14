import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  AlertDescription,
  Divider,
  Icon,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import {
  FiUser,
  FiCreditCard,
  FiLock,
  FiCalendar,
  FiCheckCircle,
  FiAlertOctagon,
  FiShield,
} from 'react-icons/fi';

export default function PaymentPage() {
  const [fullName, setFullName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [ccv, setCcv] = useState('');
  const [expDate, setExpDate] = useState(''); // YYYY-MM from <input type="month">
  const [message, setMessage] = useState(null); // { type: 'error'|'success', text }
  const router = useRouter();
  const [priceFromQuery, setPriceFromQuery] = useState(null);
  const [propertyTitle, setPropertyTitle] = useState('');
  const [billId, setBillId] = useState('PROP-2023-0567');

  // Compute min for month picker (current month)
  function getMinMonth() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  useEffect(() => {
    // Read from sessionStorage instead of query params
    const storedData = sessionStorage.getItem('paymentData');
    if (storedData) {
      try {
        const { price, id, title } = JSON.parse(storedData);
        if (price) {
          const n = Number(String(price).replace(/[^0-9.-]+/g, ''));
          if (!Number.isNaN(n)) setPriceFromQuery(n);
        }
        if (id) setBillId(String(id));
        if (title) setPropertyTitle(String(title));
      } catch (e) {
        console.error('Error reading payment data:', e);
      }
    }
  }, []);

  // Format card number as user types (4-4-4-4)
  function onCardNumberChange(e) {
    let v = e.target.value.replace(/\D/g, '');
    v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
    if (v.length > 19) v = v.substring(0, 19);
    setCardNumber(v);
  }

  function showMessage(type, text) {
    setMessage({ type, text });
    if (type === 'success') {
      setTimeout(() => setMessage(null), 4000);
    }
  }

  function clearMessage() {
    setMessage(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    clearMessage();

    // simple presence validation
    if (!fullName.trim() || !cardNumber.trim() || !ccv.trim() || !expDate.trim()) {
      showMessage('error', 'Please fill in all fields');
      return;
    }

    const formattedCardNumber = cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(formattedCardNumber)) {
      showMessage('error', 'Please enter a valid 16-digit card number');
      return;
    }

    if (!/^\d{3}$/.test(ccv)) {
      showMessage('error', 'Please enter a valid 3-digit CCV');
      return;
    }

    // expDate may be YYYY-MM from type=month
    let expYear, expMonth;
    if (/^\d{4}-\d{2}$/.test(expDate)) {
      const parts = expDate.split('-');
      expYear = parseInt(parts[0], 10);
      expMonth = parseInt(parts[1], 10);
    } else {
      const m = expDate.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/);
      if (m) {
        expMonth = parseInt(m[1], 10);
        expYear = 2000 + parseInt(m[2], 10);
      } else {
        showMessage('error', 'Please enter a valid expiration date (use the picker or MM/YY)');
        return;
      }
    }

    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth() + 1;
    if (expYear < nowYear || (expYear === nowYear && expMonth < nowMonth)) {
      showMessage('error', 'The card is expired. Please use a valid expiration date.');
      return;
    }

    // All good
    showMessage('success', 'Payment processed successfully!');
    sessionStorage.removeItem('paymentData');
  }

  return (
    <>
      <Head>
        <title>PropertyPay - Secure Payment</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box bg="gray.50" minH="100vh">
        <Container maxW="1400px" px={{ base: 4, md: 10 }} py={12}>
          <Flex direction={{ base: 'column', lg: 'row' }} gap={12}>
            {/* Payment Form Column */}
            <Box flex="1" maxW={{ lg: '50%' }} pr={{ lg: 8 }}>
              <Box bg="white" borderRadius="xl" boxShadow="lg" p={8}>
                <Heading size="xl" color="gray.800" mb={6}>
                  Make Payment
                </Heading>

                <HStack spacing={2} mb={6} color="gray.600">
                  <Icon as={FiAlertOctagon} boxSize={5} color="yellow.500" />
                  <Text fontSize="sm">
                    Please enter complete information for payment to be made
                  </Text>
                </HStack>

                {/* Inline message */}
                {message && (
                  <Alert
                    status={message.type === 'error' ? 'error' : 'success'}
                    borderRadius="md"
                    mb={4}
                  >
                    <AlertIcon />
                    <AlertDescription fontSize="sm">
                      {message.text}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <VStack spacing={6} align="stretch">
                    <FormControl isRequired>
                      <FormLabel htmlFor="fullname" fontSize="sm" fontWeight="medium" color="gray.700">
                        Full Name
                      </FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FiUser} color="gray.400" />
                        </InputLeftElement>
                        <Input
                          id="fullname"
                          name="fullname"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          size="lg"
                          focusBorderColor="blue.500"
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel htmlFor="cardnumber" fontSize="sm" fontWeight="medium" color="gray.700">
                        Card Number
                      </FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FiCreditCard} color="gray.400" />
                        </InputLeftElement>
                        <Input
                          id="cardnumber"
                          name="cardnumber"
                          value={cardNumber}
                          onChange={onCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          size="lg"
                          focusBorderColor="blue.500"
                        />
                      </InputGroup>
                    </FormControl>

                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel htmlFor="ccv" fontSize="sm" fontWeight="medium" color="gray.700">
                            CCV
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <Icon as={FiLock} color="gray.400" />
                            </InputLeftElement>
                            <Input
                              id="ccv"
                              name="ccv"
                              value={ccv}
                              onChange={(e) => setCcv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                              placeholder="123"
                              size="lg"
                              focusBorderColor="blue.500"
                            />
                          </InputGroup>
                        </FormControl>
                      </GridItem>

                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel htmlFor="expdate" fontSize="sm" fontWeight="medium" color="gray.700">
                            Expiration Date
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <Icon as={FiCalendar} color="gray.400" />
                            </InputLeftElement>
                            <Input
                              id="expdate"
                              name="expdate"
                              type="month"
                              value={expDate}
                              min={getMinMonth()}
                              onChange={(e) => setExpDate(e.target.value)}
                              size="lg"
                              focusBorderColor="blue.500"
                            />
                          </InputGroup>
                        </FormControl>
                      </GridItem>
                    </Grid>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      w="100%"
                      leftIcon={<Icon as={FiCheckCircle} />}
                      mt={2}
                    >
                      Complete Payment
                    </Button>
                  </VStack>
                </form>
              </Box>
            </Box>

            {/* Payment Summary Column */}
            <Box flex="1" maxW={{ lg: '50%' }} ml={{ lg: 8 }}>
              <Box
                bg="gray.100"
                borderRadius="xl"
                boxShadow="lg"
                p={8}
                position="sticky"
                top="20px"
              >
                <Heading size="xl" color="gray.800" mb={6}>
                  Payment Summary
                </Heading>

                <VStack spacing={4} mb={6} align="stretch">
                  <Flex justify="space-between">
                    <Text color="gray.600">Bill Number</Text>
                    <Text fontWeight="medium">{billId}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color="gray.600">Property</Text>
                    <Text fontWeight="medium">{propertyTitle || 'N/A'}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color="gray.600">Property Price</Text>
                    <Text fontWeight="medium">
                      {priceFromQuery ? `$${priceFromQuery.toLocaleString()}` : '$1,250,000'}
                    </Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color="gray.600">Processing Fee</Text>
                    <Text fontWeight="medium">$250</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color="gray.600">VAT (20%)</Text>
                    <Text fontWeight="medium">
                      {priceFromQuery ? `$${Math.round(priceFromQuery * 0.2).toLocaleString()}` : '$250,000'}
                    </Text>
                  </Flex>
                </VStack>

                <Divider borderColor="gray.300" mb={4} />

                <Flex justify="space-between" align="center">
                  <Text fontSize="lg" fontWeight="semibold">Total Amount</Text>
                  <Text fontSize="xl" fontWeight="bold" color="blue.600">
                    {priceFromQuery 
                      ? `$${(priceFromQuery + 250 + Math.round(priceFromQuery * 0.2)).toLocaleString()}` 
                      : '$1,500,250'}
                  </Text>
                </Flex>

                <Box mt={8} bg="blue.50" p={4} borderRadius="lg">
                  <HStack align="start" spacing={3}>
                    <Icon as={FiShield} color="blue.500" boxSize={5} mt={0.5} />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" color="blue.800" fontWeight="medium">
                        Secure Payment Guarantee
                      </Text>
                      <Text fontSize="xs" color="blue.600">
                        Your payment information is encrypted and processed securely.
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>
    </>
  );
}