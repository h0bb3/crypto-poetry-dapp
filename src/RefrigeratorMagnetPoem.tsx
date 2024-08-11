import React from 'react';
import './App.css';

interface RefrigeratorMagnetPoemProps {
  poem: string;
}

// Simple hash function for the poem
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

// Function to generate a consistent random rotation based on the poem hash and word index
const generateConsistentRotation = (poemHash: number, index: number): number => {
  const min = -5;
  const max = 5;
  const seed = poemHash + index;
  const random = Math.sin(seed) * 10000;
  return min + (random - Math.floor(random)) * (max - min);
};

// Function to generate a consistent random left margin for each line
const generateConsistentMargin = (poemHash: number, lineIndex: number): number => {
  const maxIndent = 50; // maximum indentation in pixels
  const seed = poemHash + lineIndex;
  const random = Math.sin(seed) * 10000;
  return Math.abs(random - Math.floor(random)) * maxIndent;
};

const RefrigeratorMagnetPoem: React.FC<RefrigeratorMagnetPoemProps> = ({ poem }) => {
  const lines = poem.split('\n');
  const poemHash = hashString(poem);

  return (
    <div style={{ padding: '10px', width: '100%', overflowX: 'hidden' }}>
      {lines.map((line, lineIndex) => (
        <div
          key={lineIndex}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '8px',
          }}
        >
          {line.split(/\s+/).filter(word => word !== '').map((word, wordIndex) => (
            <div
              key={wordIndex}
              className="word-magnet"
              style={{
                transform: `rotate(${generateConsistentRotation(poemHash, lineIndex * line.length + wordIndex)}deg)`,
                margin: '2px',
              }}
            >
              {word}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RefrigeratorMagnetPoem;
