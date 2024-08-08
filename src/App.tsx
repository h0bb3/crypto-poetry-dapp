import React, { useState, useEffect } from 'react';
import { PublicKey, Keypair } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PoetryAccount } from './types/program-types';
import { IDL } from './idl';
import { RefridgeratorPoetry } from "./types/refridgerator_poetry";
import RefrigeratorMagnetPoem from './RefrigeratorMagnetPoem';
import './App.css';
import { set } from '@coral-xyz/anchor/dist/cjs/utils/features';

type ProgramType = Program<RefridgeratorPoetry>;

declare global {
  interface Window {
    program: ProgramType;
  }
}

const App: React.FC = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [poem, setPoem] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPoemVisible, setIsPoemVisible] = useState<boolean>(false);

  useEffect(() => {
    if (wallet) {
      initializeProgram();
    }
  }, [wallet, connection]);

  const initializeProgram = async () => {
    if (!wallet) return;

    const provider = new AnchorProvider(connection, wallet, {});
    const program = new Program(IDL, provider);

    window.program = program;
  };

  const generateAndFetchPoem = async () => {
    if (!wallet) return;
    const program = window.program;
    if (!program) return;

    setIsLoading(true);
    setIsPoemVisible(false);
    setPoem('');

    try {
      const newPoemAccount = Keypair.generate();

      // Initialize the account
      const initTx = await program.methods.initialize()
        .accounts({
          poetryAccount: newPoemAccount.publicKey,
          user: wallet.publicKey,
        })
        .signers([newPoemAccount])
        .rpc();

      console.log("Initialization transaction signature", initTx);

      // Generate the poem
      const genTx = await program.methods.generatePoetry()
        .accounts({
          poetryAccount: newPoemAccount.publicKey,
        })
        .rpc();

      console.log("Generate poetry transaction signature", genTx);

      // Fetch the generated poem
      const account = await program.account.poetryAccount.fetch(newPoemAccount.publicKey) as PoetryAccount;


      // Close the account
      const closeTx = await program.methods.closePoetryAccount()
        .accounts({
          poetryAccount: newPoemAccount.publicKey,
          user: wallet.publicKey,
        })
        .rpc();

      setIsPoemVisible(true);
      setPoem(account.poem);

      console.log("Close account transaction signature", closeTx);
    } catch (error) {
      console.error("Error in poem generation process:", error);
    } finally {
      
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="text-3xl font-bold mb-6">Solana Refrigerator Poetry</h1>
        <div className="mb-6">
          <WalletMultiButton />
        </div>
        {wallet && (
          <div className="text-center">
            <button
              onClick={generateAndFetchPoem}
              className="btn"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate New Poem'}
            </button>
            {poem && (
              <div className={`mt-8 ${isPoemVisible ? 'fade-in' : ''}`}>
                <RefrigeratorMagnetPoem poem={poem} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
