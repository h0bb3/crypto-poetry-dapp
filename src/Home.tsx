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
  isUserPoem: boolean;
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
    if (program) {
      fetchAllPoems();
    }
  }, [wallet, program]);

  const fetchAllPoems = async () => {
    if (!program) return;

    const replaceLastWordWithEllipsis = (text: string): string => {
      const words = text.trim().split(/\s+/);
      if (words.length <= 1) return text + ' ...';
      return words.slice(0, -1).join(' ') + ' ...';
    };

    setIsLoading(true);
    try {
      const accounts = await program.provider.connection.getProgramAccounts(program.programId);

      const allPoems = await Promise.all(accounts.map(async ({ pubkey, account }) => {
        const poemAccount = await program.account.poetryAccount.fetch(pubkey) as PoetryAccount;
        return {
          id: pubkey.toString(),
          title: replaceLastWordWithEllipsis(poemAccount.poem.split('\n')[0]) || 'Untitled Poem',
          content: poemAccount.poem,
          isUserPoem: wallet ? poemAccount.owner.equals(wallet.publicKey) : false,
        };
      }));

      setPoems(allPoems);
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
      await fetchAllPoems();

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

  const userPoems = poems.filter(poem => poem.isUserPoem);
  const otherPoems = poems.filter(poem => !poem.isUserPoem);

  return (
    <div>
      {wallet ? (
        <>
          <div className='text-center mt-4'>
            <button
              onClick={generateAndFetchPoem}
              className="btn mr-2"
              disabled={isLoading || !program}
            >
              {isLoading ? 'Generating...' : 'Generate New Poem'}
            </button>
          </div>
          <h2 className="text-2xl font-bold mt-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">
            Your Poems
          </h2>
          <UserPoemList poems={userPoems} isLoading={isLoading} />
          <h2 className="text-2xl font-bold mt-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">
            Other Poems
          </h2>
          <UserPoemList poems={otherPoems} isLoading={isLoading} />
        </>
      ) : (
        <>
          <p className="text-center text-xl bg-purple-800 bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-2xl p-8">Connect your wallet to generate a poem</p>
          <h2 className="text-2xl font-bold mt-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">
            Poems
          </h2>
          <UserPoemList poems={poems} isLoading={isLoading} />
        </>
      )}
    </div>
  );
};

export default Home;