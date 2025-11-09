'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const HORSES = [
  { id: 1, name: 'Thunder', emoji: '🐎', color: 'bg-red-100', odds: '3:1' },
  { id: 2, name: 'Lightning', emoji: '🐴', color: 'bg-blue-100', odds: '4:1' },
  { id: 3, name: 'Storm', emoji: '🏇', color: 'bg-green-100', odds: '2:1' },
  { id: 4, name: 'Blaze', emoji: '🦄', color: 'bg-yellow-100', odds: '5:1' },
  { id: 5, name: 'Spirit', emoji: '🎠', color: 'bg-purple-100', odds: '6:1' },
];

export default function HorseRacingGame() {
  const [positions, setPositions] = useState(HORSES.map(() => 0));
  const [racing, setRacing] = useState(false);
  const [winner, setWinner] = useState(null);
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [betAmount, setBetAmount] = useState(10);
  const [balance, setBalance] = useState(100);
  const [raceHistory, setRaceHistory] = useState([]);
  const animationRef = useRef(null);

  const handleRaceEnd = useCallback((winnerIndex) => {
    setRacing(false);
    setWinner(winnerIndex);
    clearInterval(animationRef.current);

    // Calculate winnings
    if (selectedHorse === winnerIndex) {
      const odds = parseInt(HORSES[winnerIndex].odds.split(':')[0]);
      const winnings = betAmount * (odds + 1);
      setBalance(prev => prev + winnings);
      setRaceHistory(prev => [...prev, { horse: HORSES[winnerIndex].name, result: 'Won', amount: winnings }]);
    } else if (selectedHorse !== null) {
      setRaceHistory(prev => [...prev, { horse: selectedHorse !== null ? HORSES[selectedHorse].name : 'None', result: 'Lost', amount: -betAmount }]);
    }
  }, [selectedHorse, betAmount]);

  useEffect(() => {
    if (racing) {
      animationRef.current = setInterval(() => {
        setPositions(prevPositions => {
          const newPositions = prevPositions.map((pos, index) => {
            const speed = Math.random() * 3 + 1;
            return Math.min(pos + speed, 100);
          });

          const maxPos = Math.max(...newPositions);
          if (maxPos >= 100) {
            const winnerIndex = newPositions.findIndex(pos => pos >= 100);
            handleRaceEnd(winnerIndex);
          }

          return newPositions;
        });
      }, 50);

      return () => clearInterval(animationRef.current);
    }
  }, [racing, handleRaceEnd]);

  const startRace = () => {
    if (selectedHorse !== null && betAmount > 0 && betAmount <= balance) {
      setBalance(prev => prev - betAmount);
      setPositions(HORSES.map(() => 0));
      setWinner(null);
      setRacing(true);
    }
  };

  const resetRace = () => {
    setPositions(HORSES.map(() => 0));
    setWinner(null);
    setRacing(false);
    setSelectedHorse(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🏇 Horse Racing Game 🏇
          </h1>
          <p className="text-gray-600 text-lg">Place your bets and watch the race!</p>
        </div>

        {/* Balance and Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 px-6 py-3 rounded-xl">
                <span className="text-sm text-gray-600">Balance:</span>
                <span className="text-2xl font-bold text-green-600 ml-2">${balance}</span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600">Bet Amount:</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(1, Math.min(balance, parseInt(e.target.value) || 0)))}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2 w-32"
                  disabled={racing}
                  min="1"
                  max={balance}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={startRace}
                disabled={racing || selectedHorse === null || betAmount <= 0 || betAmount > balance}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all shadow-lg"
              >
                🏁 Start Race!
              </button>
              <button
                onClick={resetRace}
                disabled={racing}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all shadow-lg"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>

        {/* Horse Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Select Your Horse:</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {HORSES.map((horse, index) => (
              <button
                key={horse.id}
                onClick={() => setSelectedHorse(index)}
                disabled={racing}
                className={`p-4 rounded-xl border-3 transition-all transform hover:scale-105 ${
                  selectedHorse === index
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                    : 'border-gray-300 hover:border-blue-300'
                } ${racing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-4xl mb-2">{horse.emoji}</div>
                <div className="font-bold text-gray-800">{horse.name}</div>
                <div className="text-sm text-gray-500">Odds: {horse.odds}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Race Track */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="relative">
            {HORSES.map((horse, index) => (
              <div key={horse.id} className={`mb-6 ${horse.color} rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-800">
                    {horse.name} {selectedHorse === index && '⭐'}
                  </span>
                  {winner === index && (
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                      🏆 WINNER!
                    </span>
                  )}
                </div>
                <div className="relative h-12 bg-white rounded-lg overflow-hidden border-2 border-gray-300">
                  <div
                    className="absolute left-0 top-0 h-full flex items-center transition-all duration-100"
                    style={{ transform: `translateX(${positions[index]}%)` }}
                  >
                    <span className="text-3xl">{horse.emoji}</span>
                  </div>
                  {/* Finish Line */}
                  <div className="absolute right-0 top-0 h-full w-1 bg-red-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Winner Announcement */}
        {winner !== null && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-xl p-6 mb-6 text-center animate-pulse">
            <h2 className="text-3xl font-bold text-white mb-2">
              🎉 {HORSES[winner].name} WINS! 🎉
            </h2>
            {selectedHorse === winner && (
              <p className="text-xl text-white font-bold">
                Congratulations! You won ${betAmount * (parseInt(HORSES[winner].odds.split(':')[0]) + 1)}! 💰
              </p>
            )}
            {selectedHorse !== null && selectedHorse !== winner && (
              <p className="text-xl text-white font-bold">
                Better luck next time! You lost ${betAmount} 😢
              </p>
            )}
          </div>
        )}

        {/* Race History */}
        {raceHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Race History:</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {raceHistory.slice(-10).reverse().map((race, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    race.result === 'Won' ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <span className="font-bold">{race.horse}</span>
                  <span className={`ml-2 ${race.result === 'Won' ? 'text-green-600' : 'text-red-600'}`}>
                    {race.result} ${Math.abs(race.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
