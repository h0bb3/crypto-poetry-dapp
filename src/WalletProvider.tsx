import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from "@solana/web3.js";

require('@solana/wallet-adapter-react-ui/styles.css');


const WalletProviderWrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  // We'll always use Devnet for the network, but change the endpoint for local development
  const network = WalletAdapterNetwork.Devnet;
  
  const endpoint = useMemo(() => {
    // return 'http://127.0.0.1:8899';
    return clusterApiUrl(network);
  }, [network]);

  const wallets = useMemo(
    () => [
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletProviderWrapper;