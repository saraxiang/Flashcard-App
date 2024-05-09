import React, { useState } from 'react';
import Layout from '../components/layout';
import { Input, Button, VStack, Heading } from '@chakra-ui/react';

const CreateFlashcard = () => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const handleSaveFlashcard = () => {
    // TODO: Implement save functionality
    console.log('Front:', front);
    console.log('Back:', back);
  };

  return (
    <Layout>
      <VStack spacing={4} align="stretch" m={4}>
        <Heading>Create a New Flashcard</Heading>
        <Input
          placeholder="Front of the flashcard"
          value={front}
          onChange={(e) => setFront(e.target.value)}
        />
        <Input
          placeholder="Back of the flashcard"
          value={back}
          onChange={(e) => setBack(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleSaveFlashcard}>
          Save Flashcard
        </Button>
      </VStack>
    </Layout>
  );
};

export default CreateFlashcard;
