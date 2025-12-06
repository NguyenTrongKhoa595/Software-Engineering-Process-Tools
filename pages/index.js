import Link from 'next/link';
import Image from 'next/image';
import { Flex, Box, Text, Button } from '@chakra-ui/react';

import headerImg from '../assets/images/Header.png';

import Property from '../components/Property';

import SearchFilters from '../components/SearchFilters';

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

// ---------------- Home Page ----------------
const Home = () => (
    <Box>
    {/* ------- Header Image (Replacing Banner) ------- */}
    <Box width="100%" height="450px" position="relative">
      <Image
        src= {headerImg} 
        alt="Header"
        layout="fill"
        style={{ objectFit: 'cover' }}
      />

      {/* ⭐ Place SearchFilters INSIDE HEADER */}
      <Box
        position="absolute"
        bottom="100px"
        left="50%"
        transform="translateX(-50%)"
        width="70%"   // Keep it responsive
        maxWidth="70%"
      >
        <SearchFilters />
      </Box>
    </Box>

    {/* ------- Properties Grid ------- */}
    <Flex flexWrap="wrap" justifyContent="center" mt="10">
      {mockProperties.map((property) => (
        <Property property={property} key={property.id} />
      ))}
    </Flex>
  </Box>
);

export default Home;
