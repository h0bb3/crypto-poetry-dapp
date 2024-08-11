import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Keypair } from '@solana/web3.js';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useProgram } from './ProgramContext';
import UserPoemList from './UserPoemList';


interface Poem {
  id: string;
  title: string;
  content: string;
}

interface PoetryAccount {
  owner: { equals: (key: any) => boolean };
  poem: string;
}

const Home: React.FC = () => {
  const wallet = useAnchorWallet();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [poems, setPoems] = useState<Poem[]>([]);
  const { program, isInitializing } = useProgram();

  useEffect(() => {
    if (wallet && program) {
      fetchUserPoems();
    }
  }, [wallet, program]);

  const fetchUserPoems = async () => {
    if (!wallet || !program) return;

    const replaceLastWordWithEllipsis = (text: string): string => {
        const words = text.trim().split(/\s+/);
        if (words.length <= 1) return text + ' ...';
        return words.slice(0, -1).join(' ') + ' ...';
    };

    setIsLoading(true);
    try {
      const accounts = await program.provider.connection.getProgramAccounts(program.programId);

      const userPoems = await Promise.all(accounts.map(async ({ pubkey, account }) => {
        const poemAccount = await program.account.poetryAccount.fetch(pubkey) as PoetryAccount;
        
        if (poemAccount.owner.equals(wallet.publicKey)) {
          return {
            id: pubkey.toString(),
            // Use the first line of the poem as the title and set the last word to "..."
            title: replaceLastWordWithEllipsis(poemAccount.poem.split('\n')[0]) || 'Untitled Poem',
            content: poemAccount.poem,
          };
        }
        return null;
      }));

      setPoems(userPoems.filter((poem): poem is Poem => poem !== null));
    } catch (error) {
      console.error('Error fetching poems:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAndFetchPoem = async () => {
    if (!wallet || !program) return;

    setIsLoading(true);

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

      // Refresh the poem list
      await fetchUserPoems();

      // Navigate to the new poem page
      navigate(`/poem/${newPoemAccount.publicKey.toBase58()}`);

    } catch (error) {
      console.error("Error in poem generation process:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return <div>Initializing program...</div>;
  }

  return (
    <div >
    
        {wallet ? (
          <div className='text-center mt-4'>
            <button
              onClick={generateAndFetchPoem}
              className="btn mr-2"
              disabled={isLoading || !program}
            >
              {isLoading ? 'Generating...' : 'Generate New Poem'}
            </button>
            
            <UserPoemList poems={poems} isLoading={isLoading} />
          </div>
        ) : (
          <p className="text-center text-xl bg-purple-800 bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-2xl p-8">Connect your wallet to generate a poem</p>
        )}
      </div>
  );
};

export default Home;