import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ProgramProvider } from './ProgramContext';
import Home from './Home';
import PoemPage from './PoemPage';
import './App.css';

const App: React.FC = () => {
  return (
    <ProgramProvider>
      
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-4 md:p-8">
          <div className="max-w-lg mx-auto">
            <h1 className="text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">
              Crypto Poetry
            </h1>
            <div className="mb-8 flex justify-center">
              <WalletMultiButton />
            </div>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/poem/:poemHash" element={<PoemPage />} />
              </Routes>
            </Router>
          </div>
        </div>
    </ProgramProvider>
  );
};

export default App;