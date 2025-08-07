// Global variables
let currentBreedIndex = 0;
let currentQuestionIndex = 0;
let score = 0;
let horseMood = 'happy';

// Quiz questions and answers
const quizQuestions = [
    {
        question: "What is a baby horse called?",
        options: ["Puppy", "Kitten", "Foal", "Cub"],
        correct: 2
    },
    {
        question: "How many legs does a horse have?",
        options: ["2", "4", "6", "8"],
        correct: 1
    },
    {
        question: "What sound does a horse make?",
        options: ["Meow", "Woof", "Neigh", "Moo"],
        correct: 2
    },
    {
        question: "What do horses primarily eat?",
        options: ["Meat", "Fish", "Grass and hay", "Candy"],
        correct: 2
    },
    {
        question: "Which of these is a horse breed?",
        options: ["Golden Retriever", "Arabian", "Persian", "Siamese"],
        correct: 1
    }
];

// Breed information
const breeds = [
    {
        name: "Arabian",
        emoji: "🐴",
        description: "Known for their distinctive head shape and high tail carriage. They're one of the oldest horse breeds!"
    },
    {
        name: "Thoroughbred",
        emoji: "🏇",
        description: "Famous for racing! These athletic horses are bred for speed and agility."
    },
    {
        name: "Clydesdale",
        emoji: "🎠",
        description: "Gentle giants! These draft horses are known for their feathered feet and kind nature."
    },
    {
        name: "Shetland Pony",
        emoji: "🦄",
        description: "Small but mighty! These ponies are incredibly strong for their size."
    }
];

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize website functionality
function initializeWebsite() {
    console.log('🐎 Horse Paradise website loaded!');
    
    // Add some sparkle effects
    createSparkles();
    
    // Initialize breed carousel
    updateBreedCarousel();
    
    // Add scroll animations
    addScrollAnimations();
}

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Card flipping functionality
function flipCard(card) {
    card.classList.toggle('flipped');
    
    // Add a little bounce effect
    setTimeout(() => {
        card.style.transform = 'scale(1.05)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }, 300);
}

// Breed carousel navigation
function nextBreed() {
    currentBreedIndex = (currentBreedIndex + 1) % breeds.length;
    updateBreedCarousel();
}

function previousBreed() {
    currentBreedIndex = (currentBreedIndex - 1 + breeds.length) % breeds.length;
    updateBreedCarousel();
}

function updateBreedCarousel() {
    const breedCards = document.querySelectorAll('.breed-card');
    breedCards.forEach((card, index) => {
        card.classList.remove('active');
        if (index === currentBreedIndex) {
            card.classList.add('active');
        }
    });
    
    // Update content
    const activeCard = document.querySelector('.breed-card.active');
    if (activeCard && breeds[currentBreedIndex]) {
        const breed = breeds[currentBreedIndex];
        activeCard.querySelector('.breed-emoji').textContent = breed.emoji;
        activeCard.querySelector('h3').textContent = breed.name;
        activeCard.querySelector('p').textContent = breed.description;
    }
}

// Quiz functionality
function checkAnswer(button, isCorrect) {
    const options = document.querySelectorAll('.quiz-option');
    
    // Disable all options
    options.forEach(option => {
        option.disabled = true;
        if (option === button) {
            if (isCorrect) {
                option.classList.add('correct');
                score++;
            } else {
                option.classList.add('incorrect');
            }
        } else if (option.onclick.toString().includes('true')) {
            option.classList.add('correct');
        }
    });
    
    // Show result
    const resultText = document.getElementById('result-text');
    const questionContainer = document.getElementById('question-container');
    const quizResult = document.getElementById('quiz-result');
    
    if (isCorrect) {
        resultText.textContent = '🎉 Correct! Well done!';
        resultText.style.color = '#10ac84';
    } else {
        resultText.textContent = '❌ Oops! Better luck next time!';
        resultText.style.color = '#ff6b6b';
    }
    
    // Update score display
    document.getElementById('score').textContent = score;
    
    // Show result after a delay
    setTimeout(() => {
        questionContainer.style.display = 'none';
        quizResult.classList.remove('hidden');
    }, 1500);
}

function nextQuestion() {
    currentQuestionIndex = (currentQuestionIndex + 1) % quizQuestions.length;
    
    const questionContainer = document.getElementById('question-container');
    const quizResult = document.getElementById('quiz-result');
    const question = document.getElementById('question');
    const options = document.querySelectorAll('.quiz-option');
    
    // Reset display
    questionContainer.style.display = 'block';
    quizResult.classList.add('hidden');
    
    // Load new question
    const currentQuestion = quizQuestions[currentQuestionIndex];
    question.textContent = currentQuestion.question;
    
    // Reset and update options
    options.forEach((option, index) => {
        option.textContent = currentQuestion.options[index];
        option.disabled = false;
        option.className = 'quiz-option';
        
        // Set onclick with correct answer
        option.onclick = () => checkAnswer(option, index === currentQuestion.correct);
    });
}

// Sound effects (simulated with visual feedback)
function playSound(soundType) {
    const button = event.target;
    const sounds = {
        'neigh': '🐴 Neigh neigh!',
        'gallop': '🏃‍♂️ Clip clop clip clop!',
        'whinny': '😊 Whinny whinny!'
    };
    
    // Visual feedback
    button.style.transform = 'scale(1.2)';
    button.style.background = '#ff6b6b';
    
    // Show sound text
    const originalText = button.textContent;
    button.textContent = sounds[soundType];
    
    // Create sound wave effect
    createSoundWaves(button);
    
    setTimeout(() => {
        button.style.transform = '';
        button.style.background = '';
        button.textContent = originalText;
    }, 1000);
}

function createSoundWaves(button) {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const wave = document.createElement('div');
            wave.style.position = 'absolute';
            wave.style.border = '2px solid #ff6b6b';
            wave.style.borderRadius = '50%';
            wave.style.width = '20px';
            wave.style.height = '20px';
            wave.style.left = '50%';
            wave.style.top = '50%';
            wave.style.transform = 'translate(-50%, -50%)';
            wave.style.pointerEvents = 'none';
            wave.style.animation = 'soundWave 1s ease-out forwards';
            
            button.style.position = 'relative';
            button.appendChild(wave);
            
            setTimeout(() => {
                if (wave.parentNode) {
                    wave.parentNode.removeChild(wave);
                }
            }, 1000);
        }, i * 200);
    }
}

// Add sound wave animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes soundWave {
        0% {
            width: 20px;
            height: 20px;
            opacity: 1;
        }
        100% {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Virtual horse care functions
function feedHorse() {
    const horse = document.getElementById('virtualHorse');
    const mood = document.getElementById('horse-mood');
    
    horse.textContent = '🐴';
    horse.classList.add('happy');
    mood.textContent = 'Yummy! Your horse loves carrots! 🥕😊';
    mood.style.color = '#10ac84';
    
    // Create floating carrots
    createFloatingEmojis('🥕', horse);
    
    setTimeout(() => {
        horse.classList.remove('happy');
    }, 1000);
}

function brushHorse() {
    const horse = document.getElementById('virtualHorse');
    const mood = document.getElementById('horse-mood');
    
    horse.textContent = '✨🐴✨';
    mood.textContent = 'So shiny and clean! Your horse feels great! 🪥✨';
    mood.style.color = '#48dbfb';
    
    // Create sparkle effect
    createFloatingEmojis('✨', horse);
    
    setTimeout(() => {
        horse.textContent = '🐴';
    }, 2000);
}

function petHorse() {
    const horse = document.getElementById('virtualHorse');
    const mood = document.getElementById('horse-mood');
    
    horse.textContent = '😊🐴';
    horse.classList.add('happy');
    mood.textContent = 'Your horse feels so loved! Keep petting! 🤲💕';
    mood.style.color = '#ff9ff3';
    
    // Create floating hearts
    createFloatingEmojis('💕', horse);
    
    setTimeout(() => {
        horse.textContent = '🐴';
        horse.classList.remove('happy');
    }, 1500);
}

function createFloatingEmojis(emoji, parentElement) {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const floatingEmoji = document.createElement('div');
            floatingEmoji.textContent = emoji;
            floatingEmoji.style.position = 'absolute';
            floatingEmoji.style.fontSize = '2rem';
            floatingEmoji.style.left = Math.random() * 100 + '%';
            floatingEmoji.style.top = '100%';
            floatingEmoji.style.pointerEvents = 'none';
            floatingEmoji.style.animation = 'floatUp 2s ease-out forwards';
            floatingEmoji.style.zIndex = '1000';
            
            parentElement.style.position = 'relative';
            parentElement.appendChild(floatingEmoji);
            
            setTimeout(() => {
                if (floatingEmoji.parentNode) {
                    floatingEmoji.parentNode.removeChild(floatingEmoji);
                }
            }, 2000);
        }, i * 200);
    }
}

// Add floating animation to CSS
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(1.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(floatStyle);

// Create sparkle effects
function createSparkles() {
    const sparkleContainer = document.querySelector('.stars');
    
    setInterval(() => {
        if (Math.random() > 0.7) {
            const sparkle = document.createElement('div');
            sparkle.textContent = '✨';
            sparkle.style.position = 'absolute';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.fontSize = '1rem';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.animation = 'sparkleFloat 3s ease-out forwards';
            
            sparkleContainer.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 3000);
        }
    }, 1000);
}

// Add sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleFloat {
        0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
`;
document.head.appendChild(sparkleStyle);

// Add scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        observer.observe(section);
    });
}

// Add fade in animation
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
    @keyframes fadeInUp {
        0% {
            opacity: 0;
            transform: translateY(30px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(fadeStyle);

// Easter egg: Konami code for special horse
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    konamiCode = konamiCode.slice(-10);
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        activateUnicornMode();
    }
});

function activateUnicornMode() {
    const horses = document.querySelectorAll('.virtual-horse, .running-horse');
    horses.forEach(horse => {
        horse.textContent = '🦄';
    });
    
    // Show special message
    const specialMessage = document.createElement('div');
    specialMessage.innerHTML = '🦄✨ UNICORN MODE ACTIVATED! ✨🦄';
    specialMessage.style.position = 'fixed';
    specialMessage.style.top = '50%';
    specialMessage.style.left = '50%';
    specialMessage.style.transform = 'translate(-50%, -50%)';
    specialMessage.style.background = 'linear-gradient(45deg, #ff6b6b, #feca57)';
    specialMessage.style.color = 'white';
    specialMessage.style.padding = '20px 40px';
    specialMessage.style.borderRadius = '20px';
    specialMessage.style.fontSize = '2rem';
    specialMessage.style.fontWeight = 'bold';
    specialMessage.style.zIndex = '10000';
    specialMessage.style.animation = 'bounce 1s ease-in-out';
    
    document.body.appendChild(specialMessage);
    
    setTimeout(() => {
        document.body.removeChild(specialMessage);
    }, 3000);
}

// Add some random horse facts that appear on scroll
const randomFacts = [
    "🐴 Horses can run shortly after birth!",
    "🐴 A horse's teeth never stop growing!",
    "🐴 Horses can sleep both lying down and standing up!",
    "🐴 Horses have excellent memories!",
    "🐴 A horse's heart weighs about 8-10 pounds!"
];

// Show random facts occasionally
setInterval(() => {
    if (Math.random() > 0.95) {
        showRandomFact();
    }
}, 5000);

function showRandomFact() {
    const fact = randomFacts[Math.floor(Math.random() * randomFacts.length)];
    const factElement = document.createElement('div');
    
    factElement.textContent = fact;
    factElement.style.position = 'fixed';
    factElement.style.bottom = '20px';
    factElement.style.right = '20px';
    factElement.style.background = 'rgba(0,0,0,0.8)';
    factElement.style.color = 'white';
    factElement.style.padding = '15px 20px';
    factElement.style.borderRadius = '15px';
    factElement.style.fontSize = '1rem';
    factElement.style.zIndex = '1000';
    factElement.style.animation = 'slideInRight 0.5s ease-out';
    factElement.style.maxWidth = '300px';
    
    document.body.appendChild(factElement);
    
    setTimeout(() => {
        factElement.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => {
            if (factElement.parentNode) {
                document.body.removeChild(factElement);
            }
        }, 500);
    }, 4000);
}

// Add slide animations
const slideStyle = document.createElement('style');
slideStyle.textContent = `
    @keyframes slideInRight {
        0% {
            transform: translateX(100%);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        0% {
            transform: translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(slideStyle);

console.log('🐎 All horse magic loaded! Try the Konami code for a surprise! 🦄');