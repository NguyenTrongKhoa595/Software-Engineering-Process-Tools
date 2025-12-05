import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image'
import { Flex, Box, Text, Icon } from '@chakra-ui/react';
import { BsFilter } from 'react-icons/bs';

import Property from '../components/Property';
import SearchFilters from '../components/SearchFilters';
import { baseUrl, fetchApi } from '../utils/fetchApi';
import noresult from '../assets/images/noresult.svg'

const Search = ({ properties }) => {
  const [searchFilters, setSearchFilters] = useState(false);
  const router = useRouter();

  return (
    <Box>
      <Flex
        onClick={() => setSearchFilters(!searchFilters)}
        cursor='pointer'
        bg='gray.100'
        borderBottom='1px'
        borderColor='gray.200'
        p='2'
        fontWeight='black'
        fontSize='lg'
        justifyContent='center'
        alignItems='center'
      >
        <Text>Search Property By Filters</Text>
        <Icon paddingLeft='2' w='7' as={BsFilter} />
      </Flex>
      {searchFilters && <SearchFilters />}
      <Text fontSize='2xl' p='4' fontWeight='bold'>
        Properties {router.query.purpose}
      </Text>
      <Flex flexWrap='wrap'>
        {properties.map((property) => <Property property={property} key={property.id} />)}
      </Flex>
      {properties.length === 0 && (
        <Flex justifyContent='center' alignItems='center' flexDir='column' marginTop='5' marginBottom='5'>
          <Image src={noresult} />
          <Text fontSize='xl' marginTop='3'>No Result Found.</Text>
        </Flex>
      )}
    </Box>
  );
};

export async function getServerSideProps({ query }) {
  // Just return the same mockProperties for now
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

  return {
    props: {
      properties: mockProperties,
    },
  };
}

export default Search;
