// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    setupMobileNavigation();
    setupScrollEffects();
    startFloatingAnimations();
    setupIntersectionObserver();
}

// Mobile Navigation
function setupMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth scroll to sections
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

// Scroll effects
function setupScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.95), rgba(78, 205, 196, 0.95))';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, #ff6b6b, #4ecdc4)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Intersection Observer for animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe fact cards
    const factCards = document.querySelectorAll('.fact-card');
    factCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe game cards
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });
}

// Horse Breeds Carousel
let currentBreedIndex = 0;
const breedCards = document.querySelectorAll('.breed-card');
const totalBreeds = breedCards.length;

function showBreed(index) {
    breedCards.forEach((card, i) => {
        card.classList.remove('active');
        if (i === index) {
            card.classList.add('active');
        }
    });
}

function nextBreed() {
    currentBreedIndex = (currentBreedIndex + 1) % totalBreeds;
    showBreed(currentBreedIndex);
    addBreedAnimation();
}

function previousBreed() {
    currentBreedIndex = (currentBreedIndex - 1 + totalBreeds) % totalBreeds;
    showBreed(currentBreedIndex);
    addBreedAnimation();
}

function addBreedAnimation() {
    const activeCard = document.querySelector('.breed-card.active');
    activeCard.style.transform = 'scale(1.05)';
    setTimeout(() => {
        activeCard.style.transform = 'scale(1)';
    }, 200);
}

// Auto-rotate breeds every 5 seconds
setInterval(() => {
    nextBreed();
}, 5000);

// Horse Name Generator
const horseNames = [
    "Thunder Bolt ⚡", "Starlight Dancer ✨", "Midnight Galloper 🌙", 
    "Rainbow Mane 🌈", "Golden Wind 💨", "Silver Storm 🌪️",
    "Cosmic Rider 🚀", "Dreamweaver 💭", "Fire Spirit 🔥",
    "Ocean Breeze 🌊", "Mountain Thunder ⛰️", "Desert Rose 🌹",
    "Crystal Hooves 💎", "Velvet Shadow 🖤", "Sunshine Prancer ☀️",
    "Aurora Dancer 🌌", "Whisper Wind 🍃", "Brave Heart ❤️",
    "Lightning Flash ⚡", "Moonbeam Magic 🌙", "Stardust Runner ⭐"
];

function generateHorseName() {
    const randomIndex = Math.floor(Math.random() * horseNames.length);
    const selectedName = horseNames[randomIndex];
    const resultDiv = document.getElementById('horse-name-result');
    
    resultDiv.style.opacity = '0';
    resultDiv.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        resultDiv.textContent = `Your horse's name is: ${selectedName}`;
        resultDiv.style.opacity = '1';
        resultDiv.style.transform = 'scale(1)';
        resultDiv.style.transition = 'all 0.3s ease';
    }, 100);
    
    // Add sparkle effect
    createSparkles(resultDiv);
}

function createSparkles(element) {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('span');
            sparkle.textContent = '✨';
            sparkle.style.position = 'absolute';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.fontSize = '1.5rem';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.animation = 'sparkleFloat 1s ease-out forwards';
            
            element.style.position = 'relative';
            element.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 1000);
        }, i * 200);
    }
}

// Add sparkle animation to CSS dynamically
const sparkleCSS = `
@keyframes sparkleFloat {
    0% { opacity: 1; transform: translateY(0) scale(0.5); }
    50% { opacity: 1; transform: translateY(-20px) scale(1); }
    100% { opacity: 0; transform: translateY(-40px) scale(0.5); }
}
`;

const style = document.createElement('style');
style.textContent = sparkleCSS;
document.head.appendChild(style);

// Virtual Horse Race
let raceInProgress = false;

function startRace() {
    if (raceInProgress) return;
    
    raceInProgress = true;
    const horses = ['horse1', 'horse2', 'horse3'];
    const raceTrack = document.getElementById('race-track');
    const trackWidth = raceTrack.offsetWidth - 60; // Account for horse emoji width
    
    // Reset positions
    horses.forEach(horseId => {
        const horse = document.getElementById(horseId);
        horse.style.left = '0px';
        horse.style.transition = 'none';
    });
    
    // Start race after a brief delay
    setTimeout(() => {
        horses.forEach(horseId => {
            const horse = document.getElementById(horseId);
            const randomDuration = 2 + Math.random() * 2; // 2-4 seconds
            const randomDistance = trackWidth * (0.8 + Math.random() * 0.2); // 80-100% of track
            
            horse.style.transition = `left ${randomDuration}s ease-in-out`;
            horse.style.left = randomDistance + 'px';
        });
        
        // Determine winner after race
        setTimeout(() => {
            determineWinner(horses);
            raceInProgress = false;
        }, 4500);
    }, 100);
}

function determineWinner(horses) {
    const positions = horses.map(horseId => {
        const horse = document.getElementById(horseId);
        return {
            id: horseId,
            position: parseInt(horse.style.left)
        };
    });
    
    positions.sort((a, b) => b.position - a.position);
    const winner = positions[0];
    
    const horseEmojis = { horse1: '🐴', horse2: '🐎', horse3: '🦄' };
    const winnerEmoji = horseEmojis[winner.id];
    
    // Create winner announcement
    const announcement = document.createElement('div');
    announcement.innerHTML = `🏆 Winner: ${winnerEmoji} 🏆`;
    announcement.style.position = 'absolute';
    announcement.style.top = '50%';
    announcement.style.left = '50%';
    announcement.style.transform = 'translate(-50%, -50%)';
    announcement.style.background = 'rgba(255, 215, 0, 0.9)';
    announcement.style.padding = '1rem 2rem';
    announcement.style.borderRadius = '20px';
    announcement.style.fontSize = '1.5rem';
    announcement.style.fontWeight = 'bold';
    announcement.style.zIndex = '10';
    announcement.style.animation = 'winnerPop 0.5s ease';
    
    const raceTrack = document.getElementById('race-track');
    raceTrack.style.position = 'relative';
    raceTrack.appendChild(announcement);
    
    setTimeout(() => {
        announcement.remove();
    }, 3000);
}

// Horse Trivia
const triviaQuestions = [
    {
        question: "How fast can horses run? 🏃‍♂️",
        answer: "The fastest recorded horse speed is 55 mph (88 km/h)!"
    },
    {
        question: "How long do horses live? ⏰",
        answer: "Horses typically live 25-30 years, with some reaching 35!"
    },
    {
        question: "How much can horses weigh? ⚖️",
        answer: "Horses can weigh anywhere from 380 to 2,200 pounds!"
    },
    {
        question: "Do horses sleep standing up? 💤",
        answer: "Yes! Horses can sleep standing up thanks to a special leg-locking mechanism!"
    },
    {
        question: "How many horse breeds are there? 🐴",
        answer: "There are over 300 horse breeds worldwide!"
    },
    {
        question: "What's a group of horses called? 👥",
        answer: "A group of horses is called a herd, and baby horses are called foals!"
    },
    {
        question: "Can horses see in color? 👁️",
        answer: "Horses can see some colors, but not as many as humans. They see blues and greens best!"
    },
    {
        question: "How big is a horse's heart? ❤️",
        answer: "A horse's heart weighs about 8-10 pounds and is as big as a basketball!"
    }
];

let currentTriviaIndex = 0;

function getTrivia() {
    const question = triviaQuestions[currentTriviaIndex];
    const questionElement = document.getElementById('trivia-question');
    const answerElement = document.getElementById('trivia-answer');
    
    // Show question with animation
    questionElement.style.transform = 'scale(0.9)';
    questionElement.style.opacity = '0.7';
    
    setTimeout(() => {
        questionElement.textContent = question.question;
        questionElement.style.transform = 'scale(1)';
        questionElement.style.opacity = '1';
        questionElement.style.transition = 'all 0.3s ease';
    }, 150);
    
    // Show answer after a delay
    setTimeout(() => {
        answerElement.textContent = question.answer;
        answerElement.style.opacity = '1';
        answerElement.style.transform = 'translateY(0)';
        answerElement.style.transition = 'all 0.5s ease';
    }, 1000);
    
    currentTriviaIndex = (currentTriviaIndex + 1) % triviaQuestions.length;
}

// Emoji Gallery Animation
function animateEmoji(element) {
    element.classList.add('emoji-animate');
    
    // Create floating hearts effect
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const heart = document.createElement('span');
            heart.textContent = '💖';
            heart.style.position = 'absolute';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.transform = 'translate(-50%, -50%)';
            heart.style.pointerEvents = 'none';
            heart.style.fontSize = '1rem';
            heart.style.animation = `heartFloat 1.5s ease-out forwards`;
            
            element.style.position = 'relative';
            element.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 1500);
        }, i * 100);
    }
    
    setTimeout(() => {
        element.classList.remove('emoji-animate');
    }, 600);
}

// Add heart float animation
const heartCSS = `
@keyframes heartFloat {
    0% { 
        opacity: 1; 
        transform: translate(-50%, -50%) scale(0.5);
    }
    50% { 
        opacity: 1; 
        transform: translate(-50%, -150%) scale(1);
    }
    100% { 
        opacity: 0; 
        transform: translate(-50%, -200%) scale(0.5);
    }
}

@keyframes winnerPop {
    0% { transform: translate(-50%, -50%) scale(0); }
    50% { transform: translate(-50%, -50%) scale(1.1); }
    100% { transform: translate(-50%, -50%) scale(1); }
}
`;

const heartStyle = document.createElement('style');
heartStyle.textContent = heartCSS;
document.head.appendChild(heartStyle);

// Floating animations for hero section
function startFloatingAnimations() {
    const floatingElements = document.querySelectorAll('.floating-emoji');
    
    floatingElements.forEach((element, index) => {
        // Add random movement
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;
            element.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 360}deg)`;
        }, 3000 + index * 500);
    });
}

// Add some fun keyboard interactions
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        generateHorseName();
    } else if (e.code === 'Enter') {
        e.preventDefault();
        startRace();
    } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        nextBreed();
    } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        previousBreed();
    }
});

// Add random horse sounds (text-based fun)
const horseSounds = ['Neigh! 🐴', 'Whinny! 🎵', 'Clip-clop! 👇', 'Gallop! 🏃‍♂️'];

function playHorseSound() {
    const sound = horseSounds[Math.floor(Math.random() * horseSounds.length)];
    
    const soundElement = document.createElement('div');
    soundElement.textContent = sound;
    soundElement.style.position = 'fixed';
    soundElement.style.top = '20px';
    soundElement.style.right = '20px';
    soundElement.style.background = 'rgba(102, 126, 234, 0.9)';
    soundElement.style.color = 'white';
    soundElement.style.padding = '1rem';
    soundElement.style.borderRadius = '20px';
    soundElement.style.fontSize = '1.2rem';
    soundElement.style.fontWeight = 'bold';
    soundElement.style.zIndex = '9999';
    soundElement.style.animation = 'soundPop 2s ease-in-out forwards';
    
    document.body.appendChild(soundElement);
    
    setTimeout(() => {
        soundElement.remove();
    }, 2000);
}

// Add sound pop animation
const soundCSS = `
@keyframes soundPop {
    0% { opacity: 0; transform: scale(0.5) translateY(-20px); }
    20% { opacity: 1; transform: scale(1.1) translateY(0); }
    80% { opacity: 1; transform: scale(1) translateY(0); }
    100% { opacity: 0; transform: scale(0.8) translateY(-10px); }
}
`;

const soundStyle = document.createElement('style');
soundStyle.textContent = soundCSS;
document.head.appendChild(soundStyle);

// Play random horse sounds occasionally
setInterval(() => {
    if (Math.random() < 0.1) { // 10% chance every 10 seconds
        playHorseSound();
    }
}, 10000);

// Easter egg: Konami code for extra fun
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateUnicornMode();
        konamiCode = [];
    }
});

function activateUnicornMode() {
    // Replace all horse emojis with unicorns temporarily
    const allEmojis = document.querySelectorAll('.horse-emoji, .breed-image, .emoji-card, .footer-horses span');
    const originalEmojis = [];
    
    allEmojis.forEach((element, index) => {
        originalEmojis[index] = element.textContent;
        if (element.textContent.includes('🐴') || element.textContent.includes('🐎')) {
            element.textContent = '🦄';
        }
    });
    
    // Show unicorn message
    const unicornMessage = document.createElement('div');
    unicornMessage.innerHTML = '🦄 UNICORN MODE ACTIVATED! 🦄<br>✨ Magic is everywhere! ✨';
    unicornMessage.style.position = 'fixed';
    unicornMessage.style.top = '50%';
    unicornMessage.style.left = '50%';
    unicornMessage.style.transform = 'translate(-50%, -50%)';
    unicornMessage.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    unicornMessage.style.color = 'white';
    unicornMessage.style.padding = '2rem';
    unicornMessage.style.borderRadius = '20px';
    unicornMessage.style.fontSize = '1.5rem';
    unicornMessage.style.fontWeight = 'bold';
    unicornMessage.style.textAlign = 'center';
    unicornMessage.style.zIndex = '10000';
    unicornMessage.style.animation = 'unicornMagic 3s ease-in-out forwards';
    
    document.body.appendChild(unicornMessage);
    
    // Restore original emojis after 10 seconds
    setTimeout(() => {
        allEmojis.forEach((element, index) => {
            element.textContent = originalEmojis[index];
        });
        unicornMessage.remove();
    }, 10000);
}

// Add unicorn magic animation
const unicornCSS = `
@keyframes unicornMagic {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5) rotate(-180deg); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1) rotate(0deg); }
    100% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
}
`;

const unicornStyle = document.createElement('style');
unicornStyle.textContent = unicornCSS;
document.head.appendChild(unicornStyle);