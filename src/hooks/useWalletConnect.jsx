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

  const setAccountAndSigner = useCallback(
    async (accounts) => {
      if (accounts.length > 0) {
        const newAccount = accounts[0];
        setAccount(newAccount);
        const signer = await browserProvider.getSigner(newAccount);
        setSigner(signer);
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
    setChainId(Number(network.chainId));
    handleSupportedChains(network.chainId)
  }, [browserProvider, setAccountAndSigner]);

  const disconnectWallet = useCallback(async () => {
    try {
      if (provider) {
        await provider.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
      }
    } catch (error) {
      console.error("Failed to revoke wallet permission:", error);
    }

    setAccount(null);
    setSigner(null);
    setChainId(null);
    setBalance(null);
  }, [provider]);

  const handleAccountsChanged = useCallback(
    async (accounts) => {
      await setAccountAndSigner(accounts);

      if (accounts.length == 0) {
        setChainId(null);
        setBalance(null);
      }
    },
    [setAccountAndSigner]
  );

  const handleSupportedChains = useCallback((chainId) => {
    if (!supportedChains.includes(parseInt(chainId, 16))) {
      const supportedChainList = supportedChains
        .map(id => chainInfo[id]?.name || `Chain ${id}`)
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
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainInfo[targetChainId].hex }],
      });
    } catch (error) {
      console.error("Failed to switch chain:", error);
      setError(`Failed to switch to ${chainInfo[targetChainId]?.name || `Chain ${targetChainId}`}`);
    }
  }, [provider]);


  const handleRefetchBalance = useCallback(async () => {
    if (!browserProvider || !account) {
      return;
    }
    const balance = await browserProvider.getBalance(account);
    setBalance(formatEther(balance));
  }, [browserProvider, account]);


  const handleChainChanged = useCallback((newChainId) => {

    handleSupportedChains(newChainId)

    setChainId(parseInt(newChainId, 16));

    setBalance(null);
  }, [handleSupportedChains]);

  const handleDisconnect = useCallback(
    async (error) => {
      console.error("Wallet disocnnected with error: ", error);
      await disconnectWallet();
      console.log("handle disconnect successful...");
    },
    [disconnectWallet]
  );

  const getBalance = useCallback(async () => {
    if (browserProvider && account) {
      const balance = await browserProvider.getBalance(account);
      console.log("Balance: ", balance);
      setBalance(formatEther(balance));
    //   1 * 10*18;
    }
  }, [browserProvider, account]);



  useEffect(() => {
    const init = async () => {
      const accounts = await browserProvider.send("eth_accounts", []);
      if (accounts.length == 0) {
        return;
      }
      console.log("Accounts: ", accounts);
      await setAccountAndSigner(accounts);

      const network = await browserProvider.getNetwork();
      setChainId(Number(network.chainId));
    };

    if (!browserProvider) {
      console.log("browserProvider is not set....");
      return;
    }

    init();
  }, [browserProvider, setAccountAndSigner]);

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
    getBalance();
  }, [account, browserProvider, getBalance]);

  useEffect(() => {
    const handleProviderAnnouncement = (event) => {
      if (event.detail.info.rdns === "io.metamask") {
        const injectedProvider = event.detail.provider;
        console.log("Injected provider detected:", injectedProvider);

        setProvider(injectedProvider);
        setBrowserProvider(new BrowserProvider(injectedProvider));
      }
    };

    window.addEventListener(
      EIP6963AnnounceProvider,
      handleProviderAnnouncement
    );

    window.dispatchEvent(new Event(EIP6963RequestProvider));

    return () => {
      window.removeEventListener(
        EIP6963AnnounceProvider,
        handleProviderAnnouncement
      );
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

  };
};