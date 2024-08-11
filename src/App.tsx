import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ProgramProvider } from './ProgramContext';
import Home from './Home';
import PoemPage from './PoemPage';
import './App.css';
import { L33tModeProvider } from './L33tModeContext';
import { Switch } from './components/ui/Switch';

import { useL33tMode } from './L33tModeContext';

const L33tModeToggle: React.FC = () => {
  const { isL33tMode, toggleL33tMode } = useL33tMode();

  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="l33t-mode"
        className="text-sm font-medium leading-none text-[#f472b6]"
      >
        L33t Mode
      </label>
      <Switch
        checked={isL33tMode}
        onCheckedChange={toggleL33tMode}
        id="l33t-mode"
      />
    </div>
  );
};


const AppContents: React.FC = () => {

  const { isL33tMode, toggleL33tMode, useAutoL33t } = useL33tMode();
  const containerRef = useAutoL33t(['excluded-class']);

  return (

        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-4 md:p-8">
          <div className="absolute top-4 right-4">
            <L33tModeToggle />
          </div>
          <div ref={containerRef} className="max-w-lg mx-auto">
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
  );
};

const App: React.FC = () => {

  // Use the automatic L33t transformation

  return (
    <L33tModeProvider>
    <ProgramProvider>
      <AppContents />
    </ProgramProvider>
    </L33tModeProvider>
  );
};

export default App;