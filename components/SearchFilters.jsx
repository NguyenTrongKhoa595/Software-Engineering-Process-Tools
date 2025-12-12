import { useState } from 'react';
import { Flex, Select, Box, Input, Button, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { filterData } from '../utils/filterData';
import { BsSearch } from 'react-icons/bs';

export default function SearchFilters() {
  const [filters] = useState(filterData);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const searchProperties = (filterValues) => {
    const path = router.pathname;
    const { query } = router;

    const newQuery = { ...query, ...filterValues };
    Object.keys(newQuery).forEach((key) => !newQuery[key] && delete newQuery[key]);

    router.push({ pathname: path, query: newQuery });
  };

  const handleTextSearch = () => {
    if (searchText.trim()) searchProperties({ search: searchText });
  };

  return (
    <Flex
      bg="white"
      p="5"
      borderRadius="12px"
      flexWrap="wrap"
      justifyContent="center"
      boxShadow="0 4px 12px rgba(0,0,0,0.08)"
      border="1px solid #e5e7eb"
      gap="15px"
    >

      {/* ⬆ All dropdowns stay horizontal */}
      <Flex gap="10px" wrap="wrap" justify="center">
        {filters?.map((filter) => (
          <Box key={filter.queryName}>
            <Select
              onChange={(e) => searchProperties({ [filter.queryName]: e.target.value })}
              placeholder={filter.placeholder}
              w="170px"
              bg="white"
              borderRadius="8px"
              border="1px solid #cbd5e0"
              _hover={{ borderColor: "blue.400" }}
              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
            >
              {filter?.items?.map((item) => (
                <option value={item.value} key={item.value}>
                  {item.name}
                </option>
              ))}
            </Select>
          </Box>
        ))}
      </Flex>

      {/* ⬇ Search input + button on NEW ROW + centered */}
      <HStack spacing={2} justify="center" width="100%">
        <Button
          leftIcon={<BsSearch />}
          bg="white"
          color="black"
          border="1px solid #cbd5e0"
          _hover={{ bg:"#f7f7f7" }}
          borderRadius="8px"
          onClick={handleTextSearch}
        >
          Search
        </Button>
      </HStack>
    </Flex>
  );
}
