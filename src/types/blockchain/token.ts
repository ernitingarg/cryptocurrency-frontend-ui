// Soteria native token
export const NativeToken = 'USDS';

// Number of decimals supported by each token (including stablecoins)
export const DECIMALS: { [key: string]: number } = { BTC: 8, ETH: 18, USDS: 6, USDC: 6, USDT: 6 };

// List of all supported tokens (including stablecoins)
export const tokenTypes = ['BTC', 'ETH', NativeToken, 'USDC', 'USDT'] as const;
export type TokenType = typeof tokenTypes[number];

// List of only stablecoins
export const stableTokenTypes: TokenType[] = [NativeToken, 'USDC', 'USDT'];
export const stableTokenPairs = stableTokenTypes.map((tokenType: TokenType) => `${tokenType}-USD` as TokenPair);

// List of possible token pairs with USD
const tokenPairs = tokenTypes.map((tokenType: TokenType) => `${tokenType}-USD`);
export type TokenPair = typeof tokenPairs[number];
