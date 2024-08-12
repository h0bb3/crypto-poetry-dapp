import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Toaster } from 'react-hot-toast';
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

  // const { isL33tMode, toggleL33tMode, useAutoL33t } = useL33tMode();
  // const containerRef = useAutoL33t(['excluded-class']);

  return (

        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-4 md:p-8">
          {/* <div className="absolute top-4 right-4">
            <L33tModeToggle />
          </div> */}
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
              {/* Toaster setup */}
                <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 5000,
                  style: {
                    background: '#2D1B69',  // Dark purple background
                    color: '#FFA6C9',       // Light pink text
                    borderRadius: '10px',   // Rounded corners
                    padding: '16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#FFA6C9',   // Light pink icon
                      secondary: '#2D1B69', // Dark purple background
                    },
                  },
                  error: {
                    style: {
                      background: '#69142D', // Darker red-purple for errors
                    },
                    iconTheme: {
                      primary: '#FFA6C9',    // Light pink icon
                      secondary: '#69142D',  // Dark red-purple background
                    },
                  },
                }}
              />
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