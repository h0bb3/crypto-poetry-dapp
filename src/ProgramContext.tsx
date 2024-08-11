import React, { createContext, useContext, useState, useEffect } from 'react';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { CryptoPoetry } from "./types/crypto_poetry";
import { IDL } from './idl';

type ProgramContextType = {
  program: Program<CryptoPoetry> | null;
  isInitializing: boolean;
};

const ProgramContext = createContext<ProgramContextType>({
  program: null,
  isInitializing: true,
});

export const useProgram = () => useContext(ProgramContext);

export const ProgramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [program, setProgram] = useState<Program<CryptoPoetry> | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  useEffect(() => {
    const initializeProgram = async () => {
      if (wallet) {
        const provider = new AnchorProvider(connection, wallet, {});
        const program = new Program(IDL, provider);
        setProgram(program);
      } else {
        setProgram(null);
      }
      setIsInitializing(false);
    };

    initializeProgram();
  }, [wallet, connection]);

  return (
    <ProgramContext.Provider value={{ program, isInitializing }}>
      {children}
    </ProgramContext.Provider>
  );
};