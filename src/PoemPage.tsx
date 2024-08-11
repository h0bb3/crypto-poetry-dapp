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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const { program, isInitializing } = useProgram();

  useEffect(() => {
    if (poemHash && program && !isInitializing) {
      fetchPoemByHash(poemHash);
    }
  }, [poemHash, program, isInitializing]);

  const fetchPoemByHash = async (hash: string) => {
    if (!program) return;

    setIsLoading(true);

    try {
      const poemPublicKey = new PublicKey(hash);
      const account = await program.account.poetryAccount.fetch(poemPublicKey) as PoetryAccount;
      setPoem(account.poem);
    } catch (error) {
      console.error("Error fetching poem:", error);
      setPoem('');
    } finally {
      setIsLoading(false);
    }
  };

  const regeneratePoem = async () => {
    if (!wallet || !program || !poemHash) return;

    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const deletePoem = async () => {
    if (!wallet || !poemHash || !program) return;

    setIsLoading(true);

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

  if (isInitializing || isLoading) {
    return <div className='text-center'>Loading...</div>;
  }

  return (
    <div className="text-center">
      {poem ? (
        <>
          <RefrigeratorMagnetPoem poem={poem} />
          <div className="mt-4 space-y-2">
            <button
              onClick={regeneratePoem}
              className="btn"
              disabled={!wallet}
            >
              Regenerate Poem
            </button>
            <button
              onClick={deletePoem}
              className="btn"
              disabled={!wallet}
            >
              Delete Poem
            </button>
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
      <div>
        {wallet && (
          <button
            onClick={() => navigate('/')}
            className="btn mt-4"
          >
            Back to Home
          </button>
        )}
      </div>
    </div>
  );
};

export default PoemPage;