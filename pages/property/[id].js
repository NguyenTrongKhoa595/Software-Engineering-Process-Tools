import { useRouter } from 'next/router';
import { Box, Text } from '@chakra-ui/react';
import Property from '../../components/Property';
import { mockProperties } from '../../utils/mockProperties'; // import shared mock

export default function PropertyPage() {
  return null;
}

export async function getServerSideProps(context) {
  const id = context.params?.id ? encodeURIComponent(context.params.id) : '';
  return {
    redirect: {
      destination: `/property${id ? `?id=${id}` : ''}`,
      permanent: false,
    },
  };
}
