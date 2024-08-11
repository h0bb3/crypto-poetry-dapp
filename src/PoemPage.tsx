import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PublicKey } from '@solana/web3.js';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { PoetryAccount } from './types/program-types';
import RefrigeratorMagnetPoem from './RefrigeratorMagnetPoem';
import { useProgram } from './ProgramContext';

const PoemPage: React.FC = () => {
  const { poemHash } = useParams<{ poemHash: string }>();
  const wallet = useAnchorWallet();
  const navigate = useNavigate();
  const [poem, setPoem] = useState<string>('');
  const [poemOwner, setPoemOwner] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const { program, isInitializing } = useProgram();

  useEffect(() => {
    console.log("PoemPage useEffect", poemHash, program, isInitializing);
    if (poemHash && program && !isInitializing) {
      fetchPoemByHash(poemHash);
    }
  }, [poemHash, program, isInitializing]);

  const fetchPoemByHash = async (hash: string) => {
    if (!program) return;

    setIsLoading(true);
    setError(null);

    try {
      const poemPublicKey = new PublicKey(hash);
      const account = await program.account.poetryAccount.fetch(poemPublicKey) as PoetryAccount;
      setPoem(account.poem);
      setPoemOwner(account.owner.toString());
    } catch (error) {
      console.error("Error fetching poem:", error);
      setError("Failed to fetch the poem. It may not exist or there was a network error.");
      setPoem('');
    } finally {
      setIsLoading(false);
    }
  };

  const regeneratePoem = async () => {
    if (!wallet || !program || !poemHash) return;

    setIsLoading(true);
    setError(null);

    try {
      const poemPublicKey = new PublicKey(poemHash);

      const genTx = await program.methods.generatePoetry()
        .accounts({
          poetryAccount: poemPublicKey,
        })
        .rpc();

      console.log("Regenerate poetry transaction signature", genTx);

      const account = await program.account.poetryAccount.fetch(poemPublicKey) as PoetryAccount;
      setPoem(account.poem);
    } catch (error) {
      console.error("Error in poem regeneration process:", error);
      setError("Failed to regenerate the poem. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deletePoem = async () => {
    if (!wallet || !poemHash || !program) return;

    setIsLoading(true);
    setError(null);

    try {
      const poemPublicKey = new PublicKey(poemHash);

      const closeTx = await program.methods.closePoetryAccount()
        .accounts({
          poetryAccount: poemPublicKey,
        })
        .rpc();

      console.log("Close account transaction signature", closeTx);

      navigate('/');
    } catch (error) {
      console.error("Error deleting poem:", error);
      setError("Failed to delete the poem. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => console.error('Failed to copy: ', err));
  };

  const renderPoemSignature = () => {
    if (!poemOwner || (wallet && wallet.publicKey.toString() === poemOwner)) {
      return null;
    }

    return (
      <div className="text-center text-sm text-gray-300">
        creator: {poemOwner}
      </div>
    );
  };

  if (isInitializing || isLoading) {
    return <div className='text-center'>Loading...</div>;
  }

  if (error) {
    return <div className='text-center text-red-500'>{error}</div>;
  }

  return (
    <div className="text-center">
      {poem ? (
        <>
          <RefrigeratorMagnetPoem poem={poem} />
          {renderPoemSignature()}
          <div className="mt-4 space-y-2">
            {wallet && (
              <>
                <button
                  onClick={regeneratePoem}
                  className="btn"
                >
                  Regenerate Poem
                </button>
                <button
                  onClick={deletePoem}
                  className="btn"
                >
                  Delete Poem
                </button>
              </>
            )}
            <button
              onClick={copyUrlToClipboard}
              className="btn"
            >
              {copySuccess ? 'Copied!' : 'Copy URL'}
            </button>
          </div>
        </>
      ) : (
        <div>
          <p>No poem found</p>
        </div>
      )}
      <div className="mt-4">
        <button
          onClick={() => navigate('/')}
          className="btn"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PoemPage;