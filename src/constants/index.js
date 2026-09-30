export const EIP6963AnnounceProvider = "eip6963:announceProvider";
export const EIP6963RequestProvider = "eip6963:requestProvider";

export const supportedChains = [1, 8453, 56];

export const chainInfo = {
  1: {
    name: "Ethereum Mainnet",
    hex: "0x1",
    rpc: "https://eth.llamarpc.com",
    explorer: "https://etherscan.io",
    symbol: "ETH",
  },
  8453: {
    name: "Base",
    hex: "0x2105",
    rpc: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    symbol: "ETH",
  },
  56: {
    name: "BNB Smart Chain",
    hex: "0x38",
    rpc: "https://bsc-dataseed.binance.org/",
    explorer: "https://bscscan.com",
    symbol: "BNB",
  },
};