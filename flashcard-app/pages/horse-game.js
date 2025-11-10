import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/layout';
import { Box, Heading, Text, Button, VStack, HStack, Progress } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const HorseGame = () => {
  const [playerPosition, setPlayerPosition] = useState(0);
  const [opponentPosition, setOpponentPosition] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [timer, setTimer] = useState(0);
  const [keyPressed, setKeyPressed] = useState(false);

  const FINISH_LINE = 100;
  const PLAYER_SPEED = 2;
  const OPPONENT_SPEED = 0.5;

  // Handle keyboard input
  const handleKeyPress = useCallback((event) => {
    if (!gameStarted || gameOver) return;
    
    if (event.code === 'Space' || event.code === 'ArrowUp') {
      event.preventDefault();
      setKeyPressed(true);
      setPlayerPosition(prev => Math.min(prev + PLAYER_SPEED, FINISH_LINE));
    }
  }, [gameStarted, gameOver]);

  const handleKeyUp = useCallback(() => {
    setKeyPressed(false);
  }, []);

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyPress, handleKeyUp]);

  // Game timer
  useEffect(() => {
    let interval;
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTimer(prev => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Opponent AI movement
  useEffect(() => {
    let interval;
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setOpponentPosition(prev => {
          const newPos = prev + OPPONENT_SPEED + Math.random() * 0.3;
          return Math.min(newPos, FINISH_LINE);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Check for winner
  useEffect(() => {
    if (playerPosition >= FINISH_LINE && !gameOver) {
      setGameOver(true);
      setWinner('player');
    } else if (opponentPosition >= FINISH_LINE && !gameOver) {
      setGameOver(true);
      setWinner('opponent');
    }
  }, [playerPosition, opponentPosition, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setPlayerPosition(0);
    setOpponentPosition(0);
    setWinner(null);
    setTimer(0);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setPlayerPosition(0);
    setOpponentPosition(0);
    setWinner(null);
    setTimer(0);
  };

  return (
    <Layout>
      <Box 
        minH="calc(100vh - 200px)" 
        bg="gradient-to-b from-sky-200 to-green-100"
        p={8}
      >
        <VStack spacing={6} maxW="1200px" mx="auto">
          <Heading size="2xl" color="blue.800">
            🐴 Horse Racing Game 🏁
          </Heading>

          {!gameStarted && !gameOver && (
            <VStack spacing={4} bg="white" p={8} borderRadius="lg" shadow="xl">
              <Text fontSize="xl" textAlign="center">
                Press <strong>SPACEBAR</strong> or <strong>↑ UP ARROW</strong> repeatedly to make your horse run!
              </Text>
              <Text fontSize="md" color="gray.600" textAlign="center">
                Race against the computer and reach the finish line first!
              </Text>
              <Button 
                colorScheme="green" 
                size="lg" 
                onClick={startGame}
                mt={4}
              >
                Start Race!
              </Button>
            </VStack>
          )}

          {gameStarted && (
            <>
              <HStack spacing={8} w="full" justify="center">
                <Text fontSize="2xl" fontWeight="bold">
                  Time: {timer.toFixed(1)}s
                </Text>
              </HStack>

              {/* Race Track */}
              <Box 
                w="full" 
                bg="white" 
                borderRadius="xl" 
                p={8} 
                shadow="2xl"
                position="relative"
              >
                {/* Player Horse */}
                <Box mb={12}>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">
                      You 🐴
                    </Text>
                    <Text fontSize="md" color="gray.600">
                      {playerPosition.toFixed(0)}%
                    </Text>
                  </HStack>
                  <Box position="relative" h="60px" bg="green.100" borderRadius="md" overflow="hidden">
                    <Box
                      position="absolute"
                      right="0"
                      h="full"
                      w="4px"
                      bg="red.500"
                      zIndex={1}
                    >
                      <Text
                        position="absolute"
                        right="8px"
                        top="50%"
                        transform="translateY(-50%)"
                        fontSize="2xl"
                      >
                        🏁
                      </Text>
                    </Box>
                    <motion.div
                      animate={{ 
                        x: `${playerPosition}%`,
                        scale: keyPressed ? [1, 1.1, 1] : 1
                      }}
                      transition={{ 
                        x: { type: "spring", stiffness: 100 },
                        scale: { duration: 0.1 }
                      }}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '2.5rem'
                      }}
                    >
                      🐴
                    </motion.div>
                  </Box>
                  <Progress 
                    value={playerPosition} 
                    size="sm" 
                    colorScheme="blue" 
                    mt={2}
                  />
                </Box>

                {/* Opponent Horse */}
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="lg" fontWeight="bold" color="red.600">
                      Computer 🐎
                    </Text>
                    <Text fontSize="md" color="gray.600">
                      {opponentPosition.toFixed(0)}%
                    </Text>
                  </HStack>
                  <Box position="relative" h="60px" bg="yellow.100" borderRadius="md" overflow="hidden">
                    <Box
                      position="absolute"
                      right="0"
                      h="full"
                      w="4px"
                      bg="red.500"
                      zIndex={1}
                    >
                      <Text
                        position="absolute"
                        right="8px"
                        top="50%"
                        transform="translateY(-50%)"
                        fontSize="2xl"
                      >
                        🏁
                      </Text>
                    </Box>
                    <motion.div
                      animate={{ x: `${opponentPosition}%` }}
                      transition={{ type: "spring", stiffness: 100 }}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '2.5rem'
                      }}
                    >
                      🐎
                    </motion.div>
                  </Box>
                  <Progress 
                    value={opponentPosition} 
                    size="sm" 
                    colorScheme="red" 
                    mt={2}
                  />
                </Box>
              </Box>

              {!gameOver && (
                <Box 
                  bg="blue.50" 
                  p={4} 
                  borderRadius="md" 
                  textAlign="center"
                  animation={keyPressed ? "pulse 0.3s" : "none"}
                >
                  <Text fontSize="lg" fontWeight="bold" color="blue.700">
                    Keep pressing SPACEBAR or ↑ to run! 🏃‍♂️
                  </Text>
                </Box>
              )}
            </>
          )}

          {gameOver && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <VStack spacing={4} bg="white" p={8} borderRadius="lg" shadow="2xl">
                <Heading size="xl" color={winner === 'player' ? 'green.500' : 'red.500'}>
                  {winner === 'player' ? '🎉 You Won! 🎉' : '😢 You Lost! 😢'}
                </Heading>
                <Text fontSize="xl">
                  Final Time: <strong>{timer.toFixed(2)}s</strong>
                </Text>
                <HStack spacing={4} mt={4}>
                  <Button 
                    colorScheme="green" 
                    size="lg" 
                    onClick={startGame}
                  >
                    Race Again!
                  </Button>
                  <Button 
                    colorScheme="gray" 
                    size="lg" 
                    onClick={resetGame}
                  >
                    Back to Start
                  </Button>
                </HStack>
              </VStack>
            </motion.div>
          )}
        </VStack>
      </Box>
    </Layout>
  );
};

export default HorseGame;
