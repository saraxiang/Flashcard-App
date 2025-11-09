import React, { useState, useEffect } from 'react';
import Layout from '../components/layout';
import { Box, Button, Text, Grid, useToast } from '@chakra-ui/react';

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

// Word list for the game (can be expanded)
const WORD_LIST = [
  'REACT', 'STATE', 'PROPS', 'HOOKS', 'MOUNT', 'CACHE', 'QUERY', 'ROUTE',
  'BUILD', 'STYLE', 'CLASS', 'STORE', 'REDUX', 'FETCH', 'ASYNC', 'ARRAY',
  'SCOPE', 'EVENT', 'FRAME', 'MEDIA', 'VIDEO', 'IMAGE', 'INPUT', 'LABEL',
  'MODAL', 'ALERT', 'THEME', 'LIGHT', 'SHADE', 'COLOR', 'PIXEL', 'POINT',
  'LAYER', 'STACK', 'QUEUE', 'TABLE', 'INDEX', 'MERGE', 'SPLIT', 'JOINS',
  'CLOUD', 'SCALE', 'SPEED', 'BATCH', 'PARSE', 'TOKEN', 'LOGIN', 'ADMIN'
];

// Valid 5-letter words for validation (expanded list)
const VALID_WORDS = [
  ...WORD_LIST,
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT',
  'AFTER', 'AGAIN', 'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT',
  'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE', 'ALLOW', 'ALONE', 'ALONG', 'ALTER',
  'ANGEL', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE', 'APPLY', 'ARENA',
  'ARGUE', 'ARISE', 'ARMED', 'ARMOR', 'ASIDE', 'ASSET', 'AVOID', 'AWARD',
  'AWARE', 'BADLY', 'BAKER', 'BASES', 'BASIC', 'BASIN', 'BASIS', 'BEACH',
  'BEGAN', 'BEGIN', 'BEGUN', 'BEING', 'BELOW', 'BENCH', 'BILLY', 'BIRTH',
  'BLACK', 'BLADE', 'BLAME', 'BLANK', 'BLAST', 'BLEED', 'BLESS', 'BLIND',
  'BLOCK', 'BLOOD', 'BLOOM', 'BLOWN', 'BLUES', 'BOARD', 'BOOST', 'BOOTH',
  'BOUND', 'BRAIN', 'BRAND', 'BREAD', 'BREAK', 'BREED', 'BRIEF', 'BRING',
  'BROAD', 'BROKE', 'BROWN', 'BUNCH', 'BUYER', 'CABLE', 'CALIF', 'CARRY',
  'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHAOS', 'CHARM', 'CHART', 'CHASE',
  'CHEAP', 'CHECK', 'CHEST', 'CHIEF', 'CHILD', 'CHINA', 'CHOSE', 'CIVIL',
  'CLAIM', 'CLEAN', 'CLEAR', 'CLICK', 'CLOCK', 'CLOSE', 'CLOTH', 'COACH',
  'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRACK', 'CRAFT', 'CRASH',
  'CRAZY', 'CREAM', 'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CRUDE', 'CURVE',
  'CYCLE', 'DAILY', 'DANCE', 'DATED', 'DEALT', 'DEATH', 'DEBUT', 'DELAY',
  'DELTA', 'DENSE', 'DEPTH', 'DOING', 'DOUBT', 'DOZEN', 'DRAFT', 'DRAMA',
  'DRANK', 'DRAWN', 'DREAM', 'DRESS', 'DRILL', 'DRINK', 'DRIVE', 'DROVE',
  'DYING', 'EAGER', 'EARLY', 'EARTH', 'EIGHT', 'ELITE', 'EMPTY', 'ENEMY',
  'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'ERROR', 'EVERY', 'EXACT', 'EXIST',
  'EXTRA', 'FAITH', 'FALSE', 'FAULT', 'FIBER', 'FIELD', 'FIFTH', 'FIFTY',
  'FIGHT', 'FINAL', 'FIRST', 'FIXED', 'FLASH', 'FLEET', 'FLOOR', 'FLUID',
  'FOCUS', 'FORCE', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRANK',
  'FRAUD', 'FRESH', 'FRONT', 'FRUIT', 'FULLY', 'FUNNY', 'GIANT', 'GIVEN',
  'GLASS', 'GLOBE', 'GOING', 'GRACE', 'GRADE', 'GRAND', 'GRANT', 'GRASS',
  'GREAT', 'GREEN', 'GROSS', 'GROUP', 'GROWN', 'GUARD', 'GUESS', 'GUEST',
  'GUIDE', 'HAPPY', 'HARRY', 'HEART', 'HEAVY', 'HENCE', 'HENRY', 'HORSE',
  'HOTEL', 'HOUSE', 'HUMAN', 'IDEAL', 'HORSE', 'JUDGE', 'KNOWN', 'LARGE',
  'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN', 'LEASE', 'LEAST', 'LEAVE',
  'LEGAL', 'LEMON', 'LEVEL', 'LEWIS', 'LIGHT', 'LIMIT', 'LINKS', 'LIVES',
  'LOCAL', 'LOGIC', 'LOOSE', 'LOWER', 'LUCKY', 'LUNCH', 'LYING', 'MAGIC',
  'MAJOR', 'MAKER', 'MARCH', 'MARIA', 'MATCH', 'MAYBE', 'MAYOR', 'MEANT',
  'MEDAL', 'METAL', 'MIGHT', 'MINOR', 'MINUS', 'MIXED', 'MODEL', 'MONEY',
  'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVIE', 'MUSIC',
  'NEEDS', 'NEVER', 'NEWLY', 'NIGHT', 'NOISE', 'NORTH', 'NOTED', 'NOVEL',
  'NURSE', 'OCCUR', 'OCEAN', 'OFFER', 'OFTEN', 'ORDER', 'OTHER', 'OUGHT',
  'PAINT', 'PANEL', 'PANIC', 'PAPER', 'PARTY', 'PEACE', 'PETER', 'PHASE',
  'PHONE', 'PHOTO', 'PIECE', 'PILOT', 'PITCH', 'PLACE', 'PLAIN', 'PLANE',
  'PLANT', 'PLATE', 'POINT', 'POUND', 'POWER', 'PRESS', 'PRICE', 'PRIDE',
  'PRIME', 'PRINT', 'PRIOR', 'PRIZE', 'PROOF', 'PROUD', 'PROVE', 'QUEEN',
  'QUICK', 'QUIET', 'QUITE', 'RADIO', 'RAISE', 'RANGE', 'RAPID', 'RATIO',
  'REACH', 'READY', 'REFER', 'RIGHT', 'RIVAL', 'RIVER', 'ROBIN', 'ROGER',
  'ROMAN', 'ROUGH', 'ROUND', 'ROYAL', 'RURAL', 'SCALE', 'SCENE', 'SCOPE',
  'SCORE', 'SENSE', 'SERVE', 'SEVEN', 'SHALL', 'SHAPE', 'SHARE', 'SHARP',
  'SHEET', 'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHIRT', 'SHOCK', 'SHOOT',
  'SHORT', 'SHOWN', 'SIGHT', 'SINCE', 'SIXTH', 'SIXTY', 'SIZED', 'SKILL',
  'SLEEP', 'SLIDE', 'SMALL', 'SMART', 'SMILE', 'SMITH', 'SMOKE', 'SOLID',
  'SOLVE', 'SORRY', 'SOUND', 'SOUTH', 'SPACE', 'SPARE', 'SPEAK', 'SPEED',
  'SPEND', 'SPENT', 'SPLIT', 'SPOKE', 'SPORT', 'STAFF', 'STAGE', 'STAKE',
  'STAND', 'START', 'STUCK', 'STUDY', 'STUFF', 'SWEET', 'TABLE', 'TAKEN',
  'TASTE', 'TAXES', 'TEACH', 'TEETH', 'TERRY', 'TEXAS', 'THANK', 'THEFT',
  'THEIR', 'THEME', 'THERE', 'THESE', 'THICK', 'THING', 'THINK', 'THIRD',
  'THOSE', 'THREE', 'THREW', 'THROW', 'TIGHT', 'TIMES', 'TITLE', 'TODAY',
  'TOPIC', 'TOTAL', 'TOUCH', 'TOUGH', 'TOWER', 'TRACK', 'TRADE', 'TRAIN',
  'TREAT', 'TREND', 'TRIAL', 'TRIBE', 'TRICK', 'TRIED', 'TRIES', 'TROOP',
  'TRUCK', 'TRULY', 'TRUNK', 'TRUST', 'TRUTH', 'TWICE', 'UNDER', 'UNDUE',
  'UNION', 'UNITY', 'UNTIL', 'UPPER', 'URBAN', 'USAGE', 'USUAL', 'VALID',
  'VALUE', 'VIDEO', 'VIRUS', 'VISIT', 'VITAL', 'VOCAL', 'VOICE', 'WASTE',
  'WATCH', 'WATER', 'WHEEL', 'WHERE', 'WHICH', 'WHILE', 'WHITE', 'WHOLE',
  'WHOSE', 'WOMAN', 'WOMEN', 'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH',
  'WOULD', 'WOUND', 'WRITE', 'WRONG', 'WROTE', 'YOUNG', 'YOUTH'
];

const WordleGame = () => {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const toast = useToast();

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setTargetWord(randomWord);
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setWon(false);
  };

  const handleKeyPress = (key) => {
    if (gameOver) return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACK') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(currentGuess + key);
    }
  };

  const submitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) {
      toast({
        title: 'Not enough letters',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (!VALID_WORDS.includes(currentGuess)) {
      toast({
        title: 'Not a valid word',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess === targetWord) {
      setWon(true);
      setGameOver(true);
      toast({
        title: '🎉 Congratulations!',
        description: `You won in ${newGuesses.length} ${newGuesses.length === 1 ? 'try' : 'tries'}!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameOver(true);
      toast({
        title: 'Game Over',
        description: `The word was: ${targetWord}`,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getLetterColor = (letter, index, word) => {
    if (targetWord[index] === letter) {
      return 'green';
    } else if (targetWord.includes(letter)) {
      return 'yellow';
    }
    return 'gray';
  };

  const renderGuess = (word, rowIndex) => {
    return (
      <Grid templateColumns="repeat(5, 1fr)" gap={2} mb={2} key={rowIndex}>
        {Array.from({ length: WORD_LENGTH }).map((_, index) => {
          const letter = word[index] || '';
          const bgColor = letter ? getLetterColor(letter, index, word) : 'white';
          const textColor = letter ? 'white' : 'black';
          const borderColor = letter ? bgColor : 'gray.300';

          return (
            <Box
              key={index}
              w="60px"
              h="60px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="2px solid"
              borderColor={borderColor}
              bg={bgColor}
              color={textColor}
              fontWeight="bold"
              fontSize="2xl"
              borderRadius="md"
              transition="all 0.3s"
            >
              {letter}
            </Box>
          );
        })}
      </Grid>
    );
  };

  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
  ];

  const getKeyColor = (key) => {
    if (key === 'ENTER' || key === 'BACK') return 'gray.500';
    
    for (let guess of guesses) {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === key) {
          if (targetWord[i] === key) return 'green.500';
          if (targetWord.includes(key)) return 'yellow.500';
          return 'gray.500';
        }
      }
    }
    return 'gray.200';
  };

  return (
    <Layout>
      <Box maxW="600px" mx="auto" py={8} px={4}>
        <Box textAlign="center" mb={6}>
          <Text fontSize="4xl" fontWeight="bold" mb={2}>
            🎮 Wordle Game
          </Text>
          <Text fontSize="md" color="gray.600" mb={4}>
            Guess the 5-letter word in {MAX_ATTEMPTS} tries
          </Text>
          <Button colorScheme="blue" onClick={startNewGame}>
            New Game
          </Button>
        </Box>

        {/* Game Board */}
        <Box mb={6}>
          {guesses.map((guess, index) => renderGuess(guess, index))}
          {!gameOver && guesses.length < MAX_ATTEMPTS && renderGuess(currentGuess, guesses.length)}
          {Array.from({ length: Math.max(0, MAX_ATTEMPTS - guesses.length - (gameOver ? 0 : 1)) }).map((_, index) => (
            renderGuess('', guesses.length + index + (gameOver ? 0 : 1))
          ))}
        </Box>

        {/* Game Status */}
        {gameOver && (
          <Box textAlign="center" mb={4}>
            <Text fontSize="2xl" fontWeight="bold" color={won ? 'green.500' : 'red.500'}>
              {won ? '🎉 You Won!' : `Game Over! Word was: ${targetWord}`}
            </Text>
          </Box>
        )}

        {/* Keyboard */}
        <Box>
          {keyboard.map((row, rowIndex) => (
            <Box key={rowIndex} display="flex" justifyContent="center" gap={1} mb={1}>
              {row.map((key) => (
                <Button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  bg={getKeyColor(key)}
                  color="white"
                  size="sm"
                  minW={key.length > 1 ? '65px' : '40px'}
                  h="50px"
                  fontWeight="bold"
                  _hover={{ opacity: 0.8 }}
                  disabled={gameOver}
                >
                  {key === 'BACK' ? '⌫' : key}
                </Button>
              ))}
            </Box>
          ))}
        </Box>

        {/* Instructions */}
        <Box mt={8} p={4} bg="gray.50" borderRadius="md">
          <Text fontWeight="bold" mb={2}>How to Play:</Text>
          <Text fontSize="sm" mb={1}>• Guess the 5-letter word in {MAX_ATTEMPTS} tries</Text>
          <Text fontSize="sm" mb={1}>• 🟩 Green: Correct letter in correct position</Text>
          <Text fontSize="sm" mb={1}>• 🟨 Yellow: Correct letter in wrong position</Text>
          <Text fontSize="sm">• ⬜ Gray: Letter not in word</Text>
        </Box>
      </Box>
    </Layout>
  );
};

export default WordleGame;
