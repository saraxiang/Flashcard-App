import React, { useEffect, useRef, useState } from 'react';
import Layout from '../components/layout';

const HorseGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const gameStateRef = useRef({
    horse: { x: 100, y: 300, width: 60, height: 60, velocityY: 0, isJumping: false },
    obstacles: [],
    score: 0,
    animationId: null,
    keys: {}
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const gameState = gameStateRef.current;

    // Game constants
    const GRAVITY = 0.6;
    const JUMP_STRENGTH = -12;
    const GROUND_Y = 300;
    const OBSTACLE_SPEED = 5;
    const OBSTACLE_SPAWN_RATE = 120; // frames

    let frameCount = 0;

    // Handle keyboard input
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && gameStarted && !gameOver) {
        e.preventDefault();
        if (!gameState.horse.isJumping) {
          gameState.horse.velocityY = JUMP_STRENGTH;
          gameState.horse.isJumping = true;
        }
      }
      if ((e.code === 'Space' || e.code === 'Enter') && !gameStarted) {
        startGame();
      }
      if ((e.code === 'Space' || e.code === 'Enter') && gameOver) {
        restartGame();
      }
    };

    // Draw horse
    const drawHorse = () => {
      const horse = gameState.horse;
      ctx.save();
      
      // Horse body (brown)
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(horse.x, horse.y, horse.width, horse.height * 0.6);
      
      // Horse head
      ctx.fillRect(horse.x + horse.width, horse.y - 10, 25, 30);
      
      // Eye
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(horse.x + horse.width + 15, horse.y, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Mane
      ctx.fillStyle = '#654321';
      ctx.fillRect(horse.x + horse.width - 5, horse.y - 15, 15, 20);
      
      // Legs
      ctx.fillStyle = '#8B4513';
      const legY = horse.y + horse.height * 0.6;
      const legOffset = Math.sin(frameCount * 0.2) * 5;
      
      // Front legs
      ctx.fillRect(horse.x + 10, legY, 8, 30);
      ctx.fillRect(horse.x + 30, legY + legOffset, 8, 30);
      
      // Back legs
      ctx.fillRect(horse.x + horse.width - 30, legY - legOffset, 8, 30);
      ctx.fillRect(horse.x + horse.width - 10, legY, 8, 30);
      
      // Tail
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(horse.x, horse.y + 20);
      ctx.quadraticCurveTo(
        horse.x - 20, 
        horse.y + 30 + Math.sin(frameCount * 0.1) * 10,
        horse.x - 25,
        horse.y + 50
      );
      ctx.stroke();
      
      ctx.restore();
    };

    // Draw obstacle
    const drawObstacle = (obstacle) => {
      ctx.fillStyle = '#228B22';
      // Draw fence
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(obstacle.x + i * 15, obstacle.y, 8, obstacle.height);
      }
      // Horizontal bars
      ctx.fillRect(obstacle.x, obstacle.y + 10, obstacle.width, 5);
      ctx.fillRect(obstacle.x, obstacle.y + obstacle.height - 15, obstacle.width, 5);
    };

    // Draw ground
    const drawGround = () => {
      ctx.fillStyle = '#90EE90';
      ctx.fillRect(0, GROUND_Y + 90, canvas.width, canvas.height - GROUND_Y - 90);
      
      // Grass details
      ctx.strokeStyle = '#228B22';
      ctx.lineWidth = 2;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i + (frameCount % 20), GROUND_Y + 90);
        ctx.lineTo(i + 5 + (frameCount % 20), GROUND_Y + 85);
        ctx.stroke();
      }
    };

    // Draw sky and clouds
    const drawBackground = () => {
      // Sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#E0F6FF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      const cloudOffset = (frameCount * 0.5) % canvas.width;
      
      for (let i = 0; i < 3; i++) {
        const x = (i * 300 - cloudOffset) % (canvas.width + 200);
        const y = 50 + i * 40;
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.arc(x + 25, y, 40, 0, Math.PI * 2);
        ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Update game state
    const update = () => {
      if (!gameStarted || gameOver) return;

      const horse = gameState.horse;
      
      // Apply gravity
      horse.velocityY += GRAVITY;
      horse.y += horse.velocityY;
      
      // Ground collision
      if (horse.y >= GROUND_Y) {
        horse.y = GROUND_Y;
        horse.velocityY = 0;
        horse.isJumping = false;
      }
      
      // Spawn obstacles
      if (frameCount % OBSTACLE_SPAWN_RATE === 0) {
        gameState.obstacles.push({
          x: canvas.width,
          y: GROUND_Y + 30,
          width: 40,
          height: 60
        });
      }
      
      // Update obstacles
      gameState.obstacles = gameState.obstacles.filter(obstacle => {
        obstacle.x -= OBSTACLE_SPEED;
        
        // Check collision
        const horseBottom = horse.y + horse.height * 0.6 + 30; // Include legs
        const horseRight = horse.x + horse.width + 25; // Include head
        
        if (
          horseRight > obstacle.x &&
          horse.x < obstacle.x + obstacle.width &&
          horseBottom > obstacle.y &&
          horse.y < obstacle.y + obstacle.height
        ) {
          setGameOver(true);
          if (gameState.score > highScore) {
            setHighScore(gameState.score);
          }
          return false;
        }
        
        // Increase score when passing obstacle
        if (obstacle.x + obstacle.width < horse.x && !obstacle.scored) {
          obstacle.scored = true;
          gameState.score++;
          setScore(gameState.score);
        }
        
        return obstacle.x > -obstacle.width;
      });
      
      frameCount++;
    };

    // Render game
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawBackground();
      drawGround();
      drawHorse();
      
      gameState.obstacles.forEach(drawObstacle);
      
      // Draw score
      ctx.fillStyle = '#000';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Score: ${gameState.score}`, 20, 40);
      ctx.fillText(`High Score: ${highScore}`, 20, 70);
      
      if (!gameStarted) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('HORSE RACING GAME', canvas.width / 2, canvas.height / 2 - 60);
        ctx.font = '24px Arial';
        ctx.fillText('Press SPACE or ENTER to Start', canvas.width / 2, canvas.height / 2);
        ctx.fillText('Press SPACE to Jump', canvas.width / 2, canvas.height / 2 + 40);
        ctx.textAlign = 'left';
      }
      
      if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 - 40);
        ctx.font = '24px Arial';
        ctx.fillText(`Final Score: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText('Press SPACE or ENTER to Restart', canvas.width / 2, canvas.height / 2 + 50);
        ctx.textAlign = 'left';
      }
    };

    // Game loop
    const gameLoop = () => {
      update();
      render();
      gameState.animationId = requestAnimationFrame(gameLoop);
    };

    const startGame = () => {
      setGameStarted(true);
      setGameOver(false);
      gameState.score = 0;
      setScore(0);
    };

    const restartGame = () => {
      gameState.horse = { x: 100, y: 300, width: 60, height: 60, velocityY: 0, isJumping: false };
      gameState.obstacles = [];
      gameState.score = 0;
      setScore(0);
      setGameOver(false);
      frameCount = 0;
    };

    window.addEventListener('keydown', handleKeyDown);
    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gameState.animationId) {
        cancelAnimationFrame(gameState.animationId);
      }
    };
  }, [gameStarted, gameOver, highScore]);

  return (
    <Layout>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '20px',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh'
      }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          color: '#333'
        }}>
          🐴 Horse Racing Game 🏆
        </h1>
        
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            style={{
              border: '3px solid #333',
              borderRadius: '5px',
              backgroundColor: '#87CEEB'
            }}
          />
        </div>
        
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          maxWidth: '800px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
            How to Play:
          </h2>
          <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
            <li>Press <strong>SPACE</strong> or <strong>ENTER</strong> to start the game</li>
            <li>Press <strong>SPACE</strong> to make your horse jump</li>
            <li>Avoid the fence obstacles by jumping over them</li>
            <li>Your score increases for each obstacle you pass</li>
            <li>Game ends if you hit an obstacle</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default HorseGame;
