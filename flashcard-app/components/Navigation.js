import React from 'react';
import Link from 'next/link';
import { Flex, Box, Text, Spacer } from '@chakra-ui/react';

const Navigation = () => {
  return (
    <Flex as="nav" p="4" bg="gray.100" align="center" justify="space-between" position="sticky" top="0" zIndex="10">
      <Box p="2">
        <Link href="/" passHref>
          <Text fontSize="lg" fontWeight="bold" _hover={{ cursor: 'pointer' }}>
            All flashcards
          </Text>
        </Link>
      </Box>
      <Spacer />
      <Box p="2">
        <Link href="/create" passHref>
          <Text fontSize="lg" fontWeight="bold" _hover={{ cursor: 'pointer' }}>
            Create Flashcard
          </Text>
        </Link>
      </Box>
    </Flex>
  );
};

export default Navigation;
