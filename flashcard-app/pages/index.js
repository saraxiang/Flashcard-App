import React from 'react';
import Layout from '../components/layout';

const HomePage = () => {
  // Example flashcards data
  const flashcards = [
    { id: 1, front: 'test1', back: 'test2' },
    { id: 2, front: 'test3', back: 'test4' },
    { id: 3, front: 'test5', back: 'test6' },
  ];

  return (
    <Layout>
      <div>
        <h1>All Flashcards</h1>
        <ul>
          {flashcards.map((card) => (
            <li key={card.id}>
              <div>
                <strong>Front:</strong> {card.front}
              </div>
              <div>
                <strong>Back:</strong> {card.back}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default HomePage;
