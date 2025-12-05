import Link from 'next/link';
import Image from 'next/image';
import { Flex, Box, Text, Button } from '@chakra-ui/react';

import Property from '../components/Property';

// ---------------- Mock Data ----------------
const mockProperties = [
  {
    id: '1',
    coverPhoto: { url: 'https://www.hellolanding.com/blog/wp-content/uploads/2020/05/image-3.png' },
    price: 500000,
    rentFrequency: 'yearly',
    rooms: 3,
    title: 'Beautiful Family Home',
    baths: 2,
    area: 1200,
    agency: { logo: { url: 'https://plus.unsplash.com/premium_photo-1711697144877-b068f748bcd1?q=80&w=830&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
    isVerified: true,
  },
  {
    id: '2',
    coverPhoto: { url: 'https://www.hellolanding.com/blog/wp-content/uploads/2020/05/image-3.png' },
    price: 750000,
    rentFrequency: 'yearly',
    rooms: 4,
    title: 'Luxury Villa with Pool',
    baths: 3,
    area: 2000,
    agency: { logo: { url: 'https://plus.unsplash.com/premium_photo-1711697144877-b068f748bcd1?q=80&w=830&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
    isVerified: true,
  },
];

// ---------------- Banner Component ----------------
const Banner = ({ purpose, title1, title2, desc1, desc2, buttonText, linkName, imageUrl }) => (
  <Flex flexWrap='wrap' justifyContent='center' alignItems='center' m='10'>
    <Image src={imageUrl} width={500} height={300} alt='Banner' />
    <Box p='5'>
      <Text color='gray.500' fontSize='sm' fontWeight='medium'>{purpose}</Text>
      <Text fontSize='3xl' fontWeight='bold'>{title1}<br />{title2}</Text>
      <Text fontSize='lg' pt='3' pb='3' color='gray.700'>{desc1}<br />{desc2}</Text>
      <Link href={linkName} passHref>
        <Button fontSize='xl' bg='blue.300' color='white'>
          {buttonText}
        </Button>
      </Link>
    </Box>
  </Flex>
);

// ---------------- Home Page ----------------
const Home = () => (
  <Box>
    {/* Rent Banner */}
    <Banner
      purpose='RENT A HOME'
      title1='Rental Homes for'
      title2='Everyone'
      desc1='Explore from Apartments, builder floors, villas'
      desc2='and more'
      buttonText='Explore Renting'
      linkName='/search?purpose=for-rent'
      imageUrl='https://www.hellolanding.com/blog/wp-content/uploads/2020/05/image-3.png'
    />

    {/* Mock Properties */}
    <Flex flexWrap='wrap'>
      {mockProperties.map((property) => (
        <Property property={property} key={property.id} />
      ))}
    </Flex>
  </Box>
);

export default Home;
