import { PublicKey } from '@solana/web3.js';

export interface PoetryAccount {
    poem: string;
    owner: PublicKey;
    locked: boolean;
}