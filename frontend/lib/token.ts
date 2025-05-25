import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { SVMAI_TOKEN_MINT, SVMAI_TOKEN_DECIMALS } from './constants';

/**
 * Get the user's $SVMAI token balance
 */
export async function getSvmaiBalance(
  connection: Connection,
  walletAddress: PublicKey
): Promise<number> {
  try {
    const associatedTokenAddress = await getAssociatedTokenAddress(
      SVMAI_TOKEN_MINT,
      walletAddress
    );

    const tokenAccount = await getAccount(connection, associatedTokenAddress);
    const balance = Number(tokenAccount.amount) / Math.pow(10, SVMAI_TOKEN_DECIMALS);
    
    return balance;
  } catch (error) {
    // Token account doesn't exist or other error
    console.warn('Error fetching SVMAI balance:', error);
    return 0;
  }
}

/**
 * Format $SVMAI amount for display
 */
export function formatSvmaiAmount(amount: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Convert raw token amount to human readable
 */
export function lamportsToSvmai(lamports: bigint): number {
  return Number(lamports) / Math.pow(10, SVMAI_TOKEN_DECIMALS);
}

/**
 * Convert human readable amount to raw token amount
 */
export function svmaiToLamports(amount: number): bigint {
  return BigInt(Math.floor(amount * Math.pow(10, SVMAI_TOKEN_DECIMALS)));
}

/**
 * Check if user has sufficient $SVMAI balance for staking requirement
 */
export function hasSufficientBalance(balance: number, required: number): boolean {
  return balance >= required;
}

/**
 * Get token metadata
 */
export const SVMAI_TOKEN_INFO = {
  mint: SVMAI_TOKEN_MINT.toString(),
  symbol: 'SVMAI',
  name: 'Solana Virtual Machine AI Token',
  decimals: SVMAI_TOKEN_DECIMALS,
  logoURI: '/icons/svmai-logo.png', // Add this logo to public/icons/
} as const;

/**
 * Generate Jupiter swap URL for $SVMAI
 */
export function getJupiterSwapUrl(inputToken: string = 'SOL'): string {
  return `https://jup.ag/swap/${inputToken}-${SVMAI_TOKEN_MINT.toString()}`;
}

/**
 * Generate Raydium swap URL for $SVMAI
 */
export function getRaydiumSwapUrl(inputToken: string = 'sol'): string {
  return `https://raydium.io/swap/?inputCurrency=${inputToken}&outputCurrency=${SVMAI_TOKEN_MINT.toString()}`;
}

/**
 * Generate Solscan token page URL
 */
export function getSolscanTokenUrl(): string {
  return `https://solscan.io/token/${SVMAI_TOKEN_MINT.toString()}`;
}