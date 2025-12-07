import { useState } from 'react';
import { Flex, Select, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { filterData, getFilterValues } from '../utils/filterData';

export default function SearchFilters() {
  const [filters] = useState(filterData);
  const router = useRouter();

  const searchProperties = (filterValues) => {
  const path = router.pathname;
  const { query } = router;

  const newQuery = { ...query, ...filterValues }; // merge with existing query

  Object.keys(newQuery).forEach((key) => {
    if (newQuery[key] === '' || newQuery[key] === undefined) {
      delete newQuery[key];
    }
  });

  router.push({ pathname: path, query: newQuery });
  };

  return (
    <Flex bg="gray.100" p="4" justifyContent="center" flexWrap="wrap" borderRadius="full" borderColor="black" borderWidth="1px">
      {filters?.map((filter) => (
        <Box key={filter.queryName} mx="2" my="1">
          <Select
            onChange={(e) => searchProperties({ [filter.queryName]: e.target.value })}
            placeholder={filter.placeholder}
            w="fit-content"
            p="2"
            borderRadius="full"           // fully rounded corners
            borderWidth="1px"             // make the border visible
            borderColor="gray.400"        // set a color that contrasts with the container
            bg="white"                    // optional, ensures background is white
            _hover={{ borderColor: "blue.400" }} // optional hover effect
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
  );
}
