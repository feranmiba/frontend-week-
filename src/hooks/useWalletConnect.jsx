import { useState, useEffect, useCallback, useMemo } from "react";
import { BrowserProvider, JsonRpcSigner, formatEther } from "ethers";
import { EIP6963AnnounceProvider, EIP6963RequestProvider, supportedChains, chainInfo } from "../constants";

export const useWalletConnection = () => {
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState(null);
  const [balance, setBalance] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [browserProvider, setBrowserProvider] = useState(null);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const setAccountAndSigner = useCallback(
    async (accounts) => {
      if (accounts.length > 0) {
        const newAccount = accounts[0];
        setAccount(newAccount);
        const nextSigner = await browserProvider.getSigner(newAccount);
        setSigner(nextSigner);
      } else {
        setAccount(null);
        setSigner(null);
        setBalance(null);
      }
    },
    [browserProvider]
  );

  const connectWallet = useCallback(async () => {
    if (!browserProvider) {
      throw new Error("No wallet provider detected.");
    }

    const accounts = await browserProvider.send("eth_requestAccounts", []);
    await setAccountAndSigner(accounts);

    const network = await browserProvider.getNetwork();
    const nextChainId = Number(network.chainId);
    setChainId(nextChainId);
    handleSupportedChains(nextChainId);
  }, [browserProvider, setAccountAndSigner]);

  const disconnectWallet = useCallback(async () => {
    try {
      if (provider) {
        await provider.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
      }
    } catch (disconnectError) {
      console.error("Failed to revoke wallet permission:", disconnectError);
    }

    setAccount(null);
    setSigner(null);
    setChainId(null);
    setBalance(null);
    setError(null);
  }, [provider]);

  const handleAccountsChanged = useCallback(
    async (accounts) => {
      await setAccountAndSigner(accounts);

      if (accounts.length === 0) {
        setChainId(null);
        setBalance(null);
      }
    },
    [setAccountAndSigner]
  );

  const handleSupportedChains = useCallback((nextChainId) => {
    const normalized = Number(nextChainId);

    if (!supportedChains.includes(normalized)) {
      const supportedChainList = supportedChains
        .map((id) => chainInfo[id]?.name || `Chain ${id}`)
        .join(", ");

      setAccount("");
      setChainId(0);
      setBalance(null);
      setError(`Unsupported chain. Supported chains: ${supportedChainList}`);
      return false;
    }

    setError(null);
    return true;
  }, []);

  const switchChain = useCallback(async (targetChainId) => {
    if (!provider) {
      throw new Error("No wallet provider detected.");
    }

    const target = chainInfo[targetChainId];
    if (!target) {
      setError("Unsupported chain target.");
      return;
    }

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: target.hex }],
      });
    } catch (switchError) {
      console.error("Failed to switch chain:", switchError);
      setError(`Failed to switch to ${target.name}. Please add it in your wallet.`);
    }
  }, [provider]);

  const syncBalance = useCallback(async () => {
    if (!browserProvider || !account) {
      setBalance(null);
      return;
    }

    try {
      setIsLoadingBalance(true);
      const nextBalance = await browserProvider.getBalance(account);
      setBalance(formatEther(nextBalance));
    } catch (balanceError) {
      console.error("Failed to fetch balance:", balanceError);
      setBalance(null);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [browserProvider, account]);

  const handleRefetchBalance = useCallback(async () => {
    await syncBalance();
  }, [syncBalance]);

  const handleChainChanged = useCallback((newChainId) => {
    const nextChainId = Number(newChainId);
    handleSupportedChains(nextChainId);
    setChainId(nextChainId);
    setBalance(null);
  }, [handleSupportedChains]);

  const handleDisconnect = useCallback(
    async (disconnectError) => {
      console.error("Wallet disconnected with error:", disconnectError);
      await disconnectWallet();
    },
    [disconnectWallet]
  );

  const getBalance = useCallback(async () => {
    await syncBalance();
  }, [syncBalance]);

  useEffect(() => {
    const init = async () => {
      if (!browserProvider) {
        return;
      }

      const accounts = await browserProvider.send("eth_accounts", []);
      if (accounts.length === 0) {
        return;
      }

      await setAccountAndSigner(accounts);
      const network = await browserProvider.getNetwork();
      const nextChainId = Number(network.chainId);
      setChainId(nextChainId);
      handleSupportedChains(nextChainId);
    };

    init();
  }, [browserProvider, handleSupportedChains, setAccountAndSigner]);

  useEffect(() => {
    if (!provider) {
      return;
    }

    provider.on("chainChanged", handleChainChanged);
    provider.on("accountsChanged", handleAccountsChanged);
    provider.on("disconnect", handleDisconnect);

    return () => {
      provider.removeListener("chainChanged", handleChainChanged);
      provider.removeListener("accountsChanged", handleAccountsChanged);
      provider.removeListener("disconnect", handleDisconnect);
    };
  }, [provider, handleAccountsChanged, handleChainChanged, handleDisconnect]);

  useEffect(() => {
    if (!account || !browserProvider) {
      return;
    }

    syncBalance();
  }, [account, browserProvider, chainId, syncBalance]);

  useEffect(() => {
    const handleProviderAnnouncement = async (event) => {
      if (event.detail.info.rdns === "io.metamask") {
        const injectedProvider = event.detail.provider;
        setProvider(injectedProvider);
        setBrowserProvider(new BrowserProvider(injectedProvider));
      }
    };

    window.addEventListener(EIP6963AnnounceProvider, handleProviderAnnouncement);
    window.dispatchEvent(new Event(EIP6963RequestProvider));

    return () => {
      window.removeEventListener(EIP6963AnnounceProvider, handleProviderAnnouncement);
    };
  }, []);

  return {
    account,
    provider,
    browserProvider,
    signer,
    balance,
    chainId,
    connectWallet,
    disconnectWallet,
    switchChain,
    supportedChains,
    chainInfo,
    getBalance,
    handleRefetchBalance,
    error,
    isLoadingBalance,
    syncBalance,
  };
};