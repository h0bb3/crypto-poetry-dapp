import React, { createContext, useContext, useState, useEffect } from 'react';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { CryptoPoetry } from "./types/crypto_poetry";
import { IDL } from './idl';
import { Connection, PublicKey } from '@solana/web3.js';

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
      let provider;
      
      if (wallet) {
        provider = new AnchorProvider(connection, wallet, {});
      } else {
        // Create a read-only provider when no wallet is connected
        provider = new AnchorProvider(
          connection,
          {
            publicKey: PublicKey.default,
            signTransaction: async () => { throw new Error("Wallet not connected"); },
            signAllTransactions: async () => { throw new Error("Wallet not connected"); },
          },
          AnchorProvider.defaultOptions()
        );
      }

      const program = new Program(IDL, provider);
      setProgram(program);
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